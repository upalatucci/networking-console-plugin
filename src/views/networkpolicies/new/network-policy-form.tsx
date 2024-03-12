import * as React from 'react';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router';
import * as _ from 'lodash';

import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { k8sCreate, useFlag, useModal } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionGroup,
  Alert,
  AlertActionCloseButton,
  AlertVariant,
  Button,
  Checkbox,
  Form,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
  Title,
} from '@patternfly/react-core';
import ConfirmModal, { ConfirmModalProps } from '@utils/components/ConfirmModal/ConfirmModal';
import ExternalLink from '@utils/components/ExternalLink/ExternalLink';
import { FLAGS } from '@utils/constants';
import { getNetworkPolicyDocURL, isManaged } from '@utils/constants/documentation';
import { useClusterNetworkFeatures } from '@utils/hooks/useClusterNetworkFeatures';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import {
  checkNetworkPolicyValidity,
  isNetworkPolicyConversionError,
  NetworkPolicy,
  networkPolicyFromK8sResource,
  networkPolicyNormalizeK8sResource,
  NetworkPolicyRule,
  networkPolicyToK8sResource,
} from '@utils/models/index';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';
import { resourcePathFromModel } from '@utils/utils';

import { NetworkPolicyConditionalSelector } from './network-policy-conditional-selector';
import { NetworkPolicyRuleConfigPanel } from './network-policy-rule-config';
import { NetworkPolicySelectorPreview } from './network-policy-selector-preview';

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

export const NetworkPolicyForm: React.FC<NetworkPolicyFormProps> = ({ formData, onChange }) => {
  const history = useHistory();
  const { t } = useNetworkingTranslation();
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
          title={t(
            'This NetworkPolicy cannot be displayed in form. Please switch to the YAML editor.',
          )}
          variant={AlertVariant.danger}
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

  const handleDenyAllIngress: React.ReactEventHandler<HTMLInputElement> = (event) =>
    onPolicyChange({
      ...networkPolicy,
      ingress: {
        ...networkPolicy.ingress,
        denyAll: event.currentTarget.checked,
      },
    });

  const handleDenyAllEgress: React.ReactEventHandler<HTMLInputElement> = (event) =>
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
      btnText: t('Remove all'),
      executeFn: () => {
        execute();
        return Promise.resolve();
      },
      message: msg,
      title: t('Are you sure?'),
    });
  };

  const removeAllIngress = () => {
    removeAll(
      t('This action will remove all rules within the Ingress section and cannot be undone.'),
      () => updateIngressRules([]),
    );
  };

  const removeAllEgress = () => {
    removeAll(
      t('This action will remove all rules within the Egress section and cannot be undone.'),
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
    k8sCreate({ data: policy, model: NetworkPolicyModel })
      .then(() => {
        setInProgress(false);
        history.push(
          resourcePathFromModel(NetworkPolicyModel, networkPolicy.name, networkPolicy.namespace),
        );
      })
      .catch((err) => {
        setError(err.message);
        setInProgress(false);
      });
  };

  return (
    <div className="co-m-pane__body co-m-pane__form">
      <Form className="co-create-networkpolicy" onSubmit={save}>
        {showSDNAlert &&
          networkFeaturesLoaded &&
          networkFeatures?.PolicyEgress === undefined &&
          networkFeatures?.PolicyPeerIPBlockExceptions === undefined && (
            <Alert
              actionClose={<AlertActionCloseButton onClose={() => setShowSDNAlert(false)} />}
              title={t('When using the OpenShift SDN cluster network provider:')}
              variant="info"
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
                {t('Refer to your cluster administrator to know which network provider is used.')}
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
            id="name"
            name="name"
            onChange={handleNameChange}
            placeholder="my-policy"
            required
            type="text"
            value={networkPolicy.name}
          />
        </div>
        <div className="form-group co-create-networkpolicy__podselector">
          <NetworkPolicyConditionalSelector
            dataTest="main-pod-selector"
            helpText={t(
              'If no pod selector is provided, the policy will apply to all pods in the namespace.',
            )}
            onChange={handleMainPodSelectorChange}
            selectorType="pod"
            values={networkPolicy.podSelector}
          />
          <p>
            <Trans t={t}>
              Show a preview of the{' '}
              <Button
                data-test="show-affected-pods"
                isInline
                ref={podsPreviewPopoverRef}
                variant="link"
              >
                affected pods
              </Button>{' '}
              that this policy will apply to
            </Trans>
          </p>
          <NetworkPolicySelectorPreview
            dataTest="policy-pods-preview"
            podSelector={networkPolicy.podSelector}
            policyNamespace={networkPolicy.namespace}
            popoverRef={podsPreviewPopoverRef}
          />
        </div>
        <Title headingLevel="h2">{t('Policy type')}</Title>
        <FormGroup isInline label={t('Select default ingress and egress deny rules')} role="group">
          <Checkbox
            id="denyAllIngress"
            isChecked={networkPolicy.ingress.denyAll}
            label={t('Deny all ingress traffic')}
            name="denyAllIngress"
            onChange={handleDenyAllIngress}
          />
          {networkFeaturesLoaded && networkFeatures.PolicyEgress !== false && (
            <Checkbox
              id="denyAllEgress"
              isChecked={networkPolicy.egress.denyAll}
              label={t('Deny all egress traffic')}
              name="denyAllEgress"
              onChange={handleDenyAllEgress}
            />
          )}
        </FormGroup>
        {!networkPolicy.ingress.denyAll && (
          <FormFieldGroupExpandable
            className="co-create-networkpolicy__expandable-xl"
            header={
              <FormFieldGroupHeader
                actions={
                  <>
                    <Button
                      data-test="remove-all-ingress"
                      isDisabled={networkPolicy.ingress.rules.length === 0}
                      onClick={removeAllIngress}
                      variant="link"
                    >
                      {t('Remove all')}
                    </Button>
                    <Button data-test="add-ingress" onClick={addIngressRule} variant="secondary">
                      {t('Add ingress rule')}
                    </Button>
                  </>
                }
                titleDescription={t(
                  'Add ingress rules to be applied to your selected pods. Traffic is allowed from pods if it matches at least one rule.',
                )}
                titleText={{
                  id: 'ingress-header',
                  text: t('Ingress'),
                }}
              />
            }
            isExpanded
            toggleAriaLabel="Ingress"
          >
            {networkPolicy.ingress.rules.map((rule, idx) => (
              <NetworkPolicyRuleConfigPanel
                direction="ingress"
                key={rule.key}
                onChange={(r) => {
                  const newRules = [...networkPolicy.ingress.rules];
                  newRules[idx] = r;
                  updateIngressRules(newRules);
                }}
                onRemove={() => removeIngressRule(idx)}
                policyNamespace={networkPolicy.namespace}
                rule={rule}
              />
            ))}
          </FormFieldGroupExpandable>
        )}
        {!networkPolicy.egress.denyAll &&
          networkFeaturesLoaded &&
          networkFeatures.PolicyEgress !== false && (
            <FormFieldGroupExpandable
              className="co-create-networkpolicy__expandable-xl"
              header={
                <FormFieldGroupHeader
                  actions={
                    <>
                      <Button
                        data-test="remove-all-egress"
                        isDisabled={networkPolicy.egress.rules.length === 0}
                        onClick={removeAllEgress}
                        variant="link"
                      >
                        {t('Remove all')}
                      </Button>
                      <Button data-test="add-egress" onClick={addEgressRule} variant="secondary">
                        {t('Add egress rule')}
                      </Button>
                    </>
                  }
                  titleDescription={t(
                    'Add egress rules to be applied to your selected pods. Traffic is allowed to pods if it matches at least one rule.',
                  )}
                  titleText={{
                    id: 'egress-header',
                    text: t('Egress'),
                  }}
                />
              }
              isExpanded
              toggleAriaLabel="Egress"
            >
              {networkPolicy.egress.rules.map((rule, idx) => (
                <NetworkPolicyRuleConfigPanel
                  direction="egress"
                  key={rule.key}
                  onChange={(r) => {
                    const newRules = [...networkPolicy.egress.rules];
                    newRules[idx] = r;
                    updateEgressRules(newRules);
                  }}
                  onRemove={() => removeEgressRule(idx)}
                  policyNamespace={networkPolicy.namespace}
                  rule={rule}
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
            id="save-changes"
            isDisabled={inProgress}
            isLoading={inProgress}
            type="submit"
            variant="primary"
          >
            {t('Create')}
          </Button>
          <Button id="cancel" onClick={history.goBack} variant="secondary">
            {t('Cancel')}
          </Button>
        </ActionGroup>
      </Form>
    </div>
  );
};
