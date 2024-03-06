import * as React from 'react';
import {
  ActionGroup,
  Alert,
  Button,
  Checkbox,
  Title,
  Form,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
  AlertActionCloseButton,
  AlertVariant,
} from '@patternfly/react-core';
import * as _ from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import { NetworkPolicyConditionalSelector } from './network-policy-conditional-selector';
import {
  isNetworkPolicyConversionError,
  NetworkPolicy,
  networkPolicyFromK8sResource,
  networkPolicyNormalizeK8sResource,
  NetworkPolicyRule,
  networkPolicyToK8sResource,
  checkNetworkPolicyValidity,
} from '@utils/models/index';
import { NetworkPolicyRuleConfigPanel } from './network-policy-rule-config';
import { NetworkPolicySelectorPreview } from './network-policy-selector-preview';
import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import {
  k8sCreate,
  useFlag,
  useModal,
} from '@openshift-console/dynamic-plugin-sdk';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';
import { FLAGS } from '@utils/constants';
import { useClusterNetworkFeatures } from '@utils/hooks/useClusterNetworkFeatures';
import { resourcePathFromModel } from '@utils/utils';
import { useHistory } from 'react-router';
import {
  getNetworkPolicyDocURL,
  isManaged,
} from '@utils/constants/documentation';
import ExternalLink from '@utils/components/ExternalLink/ExternalLink';
import ConfirmModal, {
  ConfirmModalProps,
} from '@utils/components/ConfirmModal/ConfirmModal';

const emptyRule = (): NetworkPolicyRule => {
  return {
    key: _.uniqueId(),
    peers: [],
    ports: [],
  };
};

type NetworkPolicyFormProps = {
  formData: NetworkPolicyKind;
  onChange: (newFormData: NetworkPolicyKind) => void;
};

export const NetworkPolicyForm: React.FC<NetworkPolicyFormProps> = ({
  formData,
  onChange,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const isOpenShift = useFlag(FLAGS.OPENSHIFT);

  const createModal = useModal();

  const normalizedK8S = networkPolicyNormalizeK8sResource(formData);
  const converted = networkPolicyFromK8sResource(normalizedK8S, t);
  const [networkPolicy, setNetworkPolicy] = React.useState(converted);

  const [inProgress, setInProgress] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showSDNAlert, setShowSDNAlert] = React.useState(true);
  const [networkFeatures, networkFeaturesLoaded] = useClusterNetworkFeatures();
  const podsPreviewPopoverRef = React.useRef();

  if (isNetworkPolicyConversionError(networkPolicy)) {
    // Note, this case is not expected to happen. Validity of the network policy for form should have been checked prior to showing this form.
    // When used with the SyncedEditor, an error is thrown when the data is invalid, that should prevent the user from opening the form with invalid data, hence not running into this conditional block.
    return (
      <div className="co-m-pane__body">
        <Alert
          variant={AlertVariant.danger}
          title={t(
            'This NetworkPolicy cannot be displayed in form. Please switch to the YAML editor.',
          )}
        >
          {networkPolicy.error}
        </Alert>
      </div>
    );
  }

  const onPolicyChange = (policy: NetworkPolicy) => {
    setNetworkPolicy(policy);
    onChange(networkPolicyToK8sResource(policy));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onPolicyChange({ ...networkPolicy, name: event.currentTarget.value });

  const handleMainPodSelectorChange = (updated: string[][]) => {
    onPolicyChange({ ...networkPolicy, podSelector: updated });
  };

  const handleDenyAllIngress: React.ReactEventHandler<HTMLInputElement> = (
    event,
  ) =>
    onPolicyChange({
      ...networkPolicy,
      ingress: {
        ...networkPolicy.ingress,
        denyAll: event.currentTarget.checked,
      },
    });

  const handleDenyAllEgress: React.ReactEventHandler<HTMLInputElement> = (
    event,
  ) =>
    onPolicyChange({
      ...networkPolicy,
      egress: { ...networkPolicy.egress, denyAll: event.currentTarget.checked },
    });

  const updateIngressRules = (rules: NetworkPolicyRule[]) =>
    onPolicyChange({
      ...networkPolicy,
      ingress: { ...networkPolicy.ingress, rules },
    });

  const updateEgressRules = (rules: NetworkPolicyRule[]) =>
    onPolicyChange({
      ...networkPolicy,
      egress: { ...networkPolicy.egress, rules },
    });

  const addIngressRule = () => {
    updateIngressRules([emptyRule(), ...networkPolicy.ingress.rules]);
  };

  const addEgressRule = () => {
    updateEgressRules([emptyRule(), ...networkPolicy.egress.rules]);
  };

  const removeAll = (msg: string, execute: () => void) => {
    createModal<ConfirmModalProps>(ConfirmModal, {
      title: t('Are you sure?'),
      message: msg,
      btnText: t('Remove all'),
      executeFn: () => {
        execute();
        return Promise.resolve();
      },
    });
  };

  const removeAllIngress = () => {
    removeAll(
      t(
        'This action will remove all rules within the Ingress section and cannot be undone.',
      ),
      () => updateIngressRules([]),
    );
  };

  const removeAllEgress = () => {
    removeAll(
      t(
        'This action will remove all rules within the Egress section and cannot be undone.',
      ),
      () => updateEgressRules([]),
    );
  };

  const removeIngressRule = (idx: number) => {
    updateIngressRules([
      ...networkPolicy.ingress.rules.slice(0, idx),
      ...networkPolicy.ingress.rules.slice(idx + 1),
    ]);
  };

  const removeEgressRule = (idx: number) => {
    updateEgressRules([
      ...networkPolicy.egress.rules.slice(0, idx),
      ...networkPolicy.egress.rules.slice(idx + 1),
    ]);
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();

    const invalid = checkNetworkPolicyValidity(networkPolicy, t);
    if (invalid) {
      setError(invalid.error);
      return;
    }

    const policy = networkPolicyToK8sResource(networkPolicy);
    setInProgress(true);
    k8sCreate({ model: NetworkPolicyModel, data: policy })
      .then(() => {
        setInProgress(false);
        history.push(
          resourcePathFromModel(
            NetworkPolicyModel,
            networkPolicy.name,
            networkPolicy.namespace,
          ),
        );
      })
      .catch((err) => {
        setError(err.message);
        setInProgress(false);
      });
  };

  return (
    <div className="co-m-pane__body co-m-pane__form">
      <Form onSubmit={save} className="co-create-networkpolicy">
        {showSDNAlert &&
          networkFeaturesLoaded &&
          networkFeatures?.PolicyEgress === undefined &&
          networkFeatures?.PolicyPeerIPBlockExceptions === undefined && (
            <Alert
              variant="info"
              title={t(
                'When using the OpenShift SDN cluster network provider:',
              )}
              actionClose={
                <AlertActionCloseButton
                  onClose={() => setShowSDNAlert(false)}
                />
              }
            >
              <ul>
                <li>{t('Egress network policy is not supported.')}</li>
                <li>
                  {t(
                    'IP block exceptions are not supported and would cause the entire IP block section to be ignored.',
                  )}
                </li>
              </ul>
              <p>
                {t(
                  'Refer to your cluster administrator to know which network provider is used.',
                )}
              </p>
              {!isManaged() && (
                <p>
                  {t('More information:')}&nbsp;
                  <ExternalLink
                    href={getNetworkPolicyDocURL(isOpenShift)}
                    text={t('NetworkPolicies documentation')}
                  />
                </p>
              )}
            </Alert>
          )}
        <div className="form-group co-create-networkpolicy__name">
          <label className="co-required" htmlFor="name">
            {t('Policy name')}
          </label>
          <input
            className="pf-v5-c-form-control"
            type="text"
            onChange={handleNameChange}
            value={networkPolicy.name}
            placeholder="my-policy"
            id="name"
            name="name"
            required
          />
        </div>
        <div className="form-group co-create-networkpolicy__podselector">
          <NetworkPolicyConditionalSelector
            selectorType="pod"
            helpText={t(
              'If no pod selector is provided, the policy will apply to all pods in the namespace.',
            )}
            values={networkPolicy.podSelector}
            onChange={handleMainPodSelectorChange}
            dataTest="main-pod-selector"
          />
          <p>
            <Trans ns="console-app">
              Show a preview of the{' '}
              <Button
                data-test="show-affected-pods"
                ref={podsPreviewPopoverRef}
                variant="link"
                isInline
              >
                affected pods
              </Button>{' '}
              that this policy will apply to
            </Trans>
          </p>
          <NetworkPolicySelectorPreview
            policyNamespace={networkPolicy.namespace}
            podSelector={networkPolicy.podSelector}
            popoverRef={podsPreviewPopoverRef}
            dataTest="policy-pods-preview"
          />
        </div>
        <Title headingLevel="h2">{t('Policy type')}</Title>
        <FormGroup
          role="group"
          isInline
          label={t('Select default ingress and egress deny rules')}
        >
          <Checkbox
            label={t('Deny all ingress traffic')}
            onChange={handleDenyAllIngress}
            isChecked={networkPolicy.ingress.denyAll}
            name="denyAllIngress"
            id="denyAllIngress"
          />
          {networkFeaturesLoaded && networkFeatures.PolicyEgress !== false && (
            <Checkbox
              label={t('Deny all egress traffic')}
              onChange={handleDenyAllEgress}
              isChecked={networkPolicy.egress.denyAll}
              name="denyAllEgress"
              id="denyAllEgress"
            />
          )}
        </FormGroup>
        {!networkPolicy.ingress.denyAll && (
          <FormFieldGroupExpandable
            toggleAriaLabel="Ingress"
            className="co-create-networkpolicy__expandable-xl"
            isExpanded
            header={
              <FormFieldGroupHeader
                titleText={{
                  text: t('Ingress'),
                  id: 'ingress-header',
                }}
                titleDescription={t(
                  'Add ingress rules to be applied to your selected pods. Traffic is allowed from pods if it matches at least one rule.',
                )}
                actions={
                  <>
                    <Button
                      variant="link"
                      isDisabled={networkPolicy.ingress.rules.length === 0}
                      onClick={removeAllIngress}
                      data-test="remove-all-ingress"
                    >
                      {t('Remove all')}
                    </Button>
                    <Button
                      data-test="add-ingress"
                      variant="secondary"
                      onClick={addIngressRule}
                    >
                      {t('Add ingress rule')}
                    </Button>
                  </>
                }
              />
            }
          >
            {networkPolicy.ingress.rules.map((rule, idx) => (
              <NetworkPolicyRuleConfigPanel
                key={rule.key}
                policyNamespace={networkPolicy.namespace}
                direction="ingress"
                rule={rule}
                onChange={(r) => {
                  const newRules = [...networkPolicy.ingress.rules];
                  newRules[idx] = r;
                  updateIngressRules(newRules);
                }}
                onRemove={() => removeIngressRule(idx)}
              />
            ))}
          </FormFieldGroupExpandable>
        )}
        {!networkPolicy.egress.denyAll &&
          networkFeaturesLoaded &&
          networkFeatures.PolicyEgress !== false && (
            <FormFieldGroupExpandable
              toggleAriaLabel="Egress"
              className="co-create-networkpolicy__expandable-xl"
              isExpanded
              header={
                <FormFieldGroupHeader
                  titleText={{
                    text: t('Egress'),
                    id: 'egress-header',
                  }}
                  titleDescription={t(
                    'Add egress rules to be applied to your selected pods. Traffic is allowed to pods if it matches at least one rule.',
                  )}
                  actions={
                    <>
                      <Button
                        variant="link"
                        isDisabled={networkPolicy.egress.rules.length === 0}
                        onClick={removeAllEgress}
                        data-test="remove-all-egress"
                      >
                        {t('Remove all')}
                      </Button>
                      <Button
                        data-test="add-egress"
                        variant="secondary"
                        onClick={addEgressRule}
                      >
                        {t('Add egress rule')}
                      </Button>
                    </>
                  }
                />
              }
            >
              {networkPolicy.egress.rules.map((rule, idx) => (
                <NetworkPolicyRuleConfigPanel
                  key={rule.key}
                  policyNamespace={networkPolicy.namespace}
                  direction="egress"
                  rule={rule}
                  onChange={(r) => {
                    const newRules = [...networkPolicy.egress.rules];
                    newRules[idx] = r;
                    updateEgressRules(newRules);
                  }}
                  onRemove={() => removeEgressRule(idx)}
                />
              ))}
            </FormFieldGroupExpandable>
          )}

        {error && (
          <Alert isInline title={t('Error')} variant={AlertVariant.danger}>
            {error}
          </Alert>
        )}

        <ActionGroup className="pf-v5-c-form">
          <Button
            type="submit"
            id="save-changes"
            variant="primary"
            isLoading={inProgress}
            isDisabled={inProgress}
          >
            {t('Create')}
          </Button>
          <Button onClick={history.goBack} id="cancel" variant="secondary">
            {t('Cancel')}
          </Button>
        </ActionGroup>
      </Form>
    </div>
  );
};
