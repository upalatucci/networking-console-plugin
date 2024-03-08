/* eslint-disable react/prop-types */
import * as React from 'react';
import {
  ActionGroup,
  Alert,
  AlertVariant,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  Popover,
  PopoverPosition,
  TextInput,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import * as _ from 'lodash';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom-v5-compat';
import NetworkAttachmentDefinitionModel from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import SriovNetworkNodePolicyModel from '@kubevirt-ui/kubevirt-api/console/models/SriovNetworkNodePolicyModel';
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import {
  NetworkAttachmentDefinitionAnnotations,
  NetworkAttachmentDefinitionConfig,
  TypeParamsData,
} from '@utils/resources/nads/types';
import {
  ValidationErrorType,
  resourcePathFromModel,
  validateDNS1123SubdomainValue,
} from '@utils/utils';
import {
  NET_ATTACH_DEF_HEADER_LABEL,
  cnvBridgeNetworkType,
  networkTypeParams,
  networkTypes,
  ovnKubernetesNetworkType,
  ovnKubernetesSecondaryLocalnet,
} from '@utils/constants';
import {
  K8sResourceKind,
  RedExclamationCircleIcon,
  getGroupVersionKindForModel,
  k8sCreate,
  useK8sModels,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import NetworkTypeOptions from './NetworkTypeOptions';
import { useHistory } from 'react-router';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import './nad-form.scss';

const buildConfig = (
  name,
  networkType,
  typeParamsData,
  namespace,
): NetworkAttachmentDefinitionConfig => {
  const config: NetworkAttachmentDefinitionConfig = {
    name,
    type: networkType,
    cniVersion: '0.3.1',
  };

  let ipam = {};
  try {
    ipam = JSON.parse(_.get(typeParamsData, 'ipam.value', {}));
  } catch (e) {
    console.error('Could not parse ipam.value JSON', e); // eslint-disable-line no-console
  }

  if (networkType === cnvBridgeNetworkType) {
    config.bridge = _.get(typeParamsData, 'bridge.value', '');
    config.vlan = parseInt(typeParamsData?.vlanTagNum?.value, 10) || undefined;
    config.macspoofchk = _.get(typeParamsData, 'macspoofchk.value', true);
    config.ipam = ipam;
    config.preserveDefaultVlan = false;
  } else if (networkType === 'sriov') {
    config.ipam = ipam;
  } else if (networkType === ovnKubernetesNetworkType) {
    config.topology = 'layer2';
    config.netAttachDefName = `${namespace}/${name}`;
  } else if (networkType === ovnKubernetesSecondaryLocalnet) {
    config.cniVersion = '0.4.0';
    config.name = _.get(typeParamsData, 'bridgeMapping.value', '');
    config.type = ovnKubernetesNetworkType;
    config.topology = 'localnet';
    config.vlanID = parseInt(typeParamsData?.vlanID?.value, 10) || undefined;
    config.mtu = parseInt(typeParamsData?.mtu?.value, 10) || undefined;
    config.netAttachDefName = `${namespace}/${name}`;
  }
  return config;
};

const getResourceName = (networkType, typeParamsData): string => {
  if (_.isEmpty(typeParamsData)) return null;

  return networkType === cnvBridgeNetworkType
    ? `bridge.network.kubevirt.io/${_.get(typeParamsData, 'bridge.value', '')}`
    : `openshift.io/${_.get(typeParamsData, 'resourceName.value', '')}`;
};

const generateNADName = (): string => {
  return `network-${uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '-',
  })}`;
};

const createNetAttachDef = (
  e: React.FormEvent<EventTarget>,
  description,
  name,
  networkType,
  typeParamsData,
  namespace,
  setError,
  setLoading,
  history,
) => {
  e.preventDefault();

  setLoading(true);
  setError(null);

  const config = JSON.stringify(
    buildConfig(name, networkType, typeParamsData, namespace),
  );
  const resourceName = getResourceName(networkType, typeParamsData);
  const annotations: NetworkAttachmentDefinitionAnnotations = {
    ...(resourceName && { 'k8s.v1.cni.cncf.io/resourceName': resourceName }),
  };

  if (!_.isEmpty(description)) {
    annotations.description = description;
  }

  const newNetAttachDef = {
    apiVersion: `${NetworkAttachmentDefinitionModel.apiGroup}/${NetworkAttachmentDefinitionModel.apiVersion}`,
    kind: NetworkAttachmentDefinitionModel.kind,
    metadata: {
      name,
      namespace,
      annotations,
    },
    spec: {
      config,
    },
  };

  k8sCreate({ model: NetworkAttachmentDefinitionModel, data: newNetAttachDef })
    .then(() => {
      setLoading(false);
      history.push(
        resourcePathFromModel(
          NetworkAttachmentDefinitionModel,
          name,
          namespace,
        ),
      );
    })
    .catch((err) => {
      setError(err);
      setLoading(false);
      console.error(
        'Error while create a NetworkAttachmentDefinitionModel',
        err,
      ); // eslint-disable-line no-console
    });
};

const handleNameChange = (
  enteredName,
  namespace,
  fieldErrors,
  setName,
  setFieldErrors,
) => {
  const fieldErrorsUpdate = { ...fieldErrors };
  delete fieldErrorsUpdate.nameValidationMsg;

  const nameValidation = validateDNS1123SubdomainValue(enteredName, {
    // t('Network attachment definition name cannot be empty')
    // t('Network attachment definition name can contain only alphanumeric characters')
    // t('Network attachment definition name must start/end with alphanumeric character')
    // t('Network attachment definition name cannot contain uppercase characters')
    // t('Network attachment definition name is too long')
    // t('Network attachment definition name is too short')
    emptyMsg: 'Network attachment definition name cannot be empty',
    errorMsg:
      'Network attachment definition name can contain only alphanumeric characters',
    startEndAlphanumbericMsg:
      'Network attachment definition name must start/end with alphanumeric character',
    uppercaseMsg:
      'Network attachment definition name cannot contain uppercase characters',
    longMsg: 'Network attachment definition name is too long',
    shortMsg: 'Network attachment definition name is too short',
  });
  if (_.get(nameValidation, 'type', null) === ValidationErrorType.Error) {
    fieldErrorsUpdate.nameValidationMsg = nameValidation.messageKey;
  }

  setName(enteredName);
  setFieldErrors(fieldErrorsUpdate);
};

const getNetworkTypes = (
  hasSriovNetNodePolicyCRD,
  hasHyperConvergedCRD,
  hasOVNK8sNetwork,
) => {
  const types = _.clone(networkTypes);
  if (!hasSriovNetNodePolicyCRD) {
    delete types.sriov;
  }

  if (!hasHyperConvergedCRD) {
    delete types[cnvBridgeNetworkType];
  }

  if (!hasOVNK8sNetwork) {
    delete types[ovnKubernetesNetworkType];
    delete types[ovnKubernetesSecondaryLocalnet];
  }

  return types;
};

const allTypeParamFieldsValid = (typeParamsData) => {
  return !_.some(typeParamsData, ({ validationMsg }) => validationMsg !== null);
};

const allRequiredFieldsFilled = (
  name,
  networkType,
  typeParamsData,
): boolean => {
  if (_.isEmpty(name) || networkType === null) {
    return false;
  }

  const allParamsForType = _.get(networkTypeParams, [networkType]);
  const requiredKeys = _.keys(allParamsForType).filter((key) =>
    _.get(allParamsForType, [key, 'required'], false),
  );

  return _.every(requiredKeys, (key) => {
    const value = _.get(typeParamsData, [key, 'value']);
    return !_.isEmpty(value);
  });
};

const validateForm = (
  fieldErrors,
  name,
  networkType,
  typeParamsData,
  setError,
) => {
  setError(null);
  const nameIsValid = _.get(fieldErrors, 'nameValidationMsg', '') === '';

  return (
    nameIsValid &&
    allRequiredFieldsFilled(name, networkType, typeParamsData) &&
    allTypeParamFieldsValid(typeParamsData)
  );
};

// t('Network Type')
// t('Edit YAML')
// t('Networks are not project-bound. Using the same name creates a shared NAD.')
const NetworkAttachmentDefinitionFormBase = ({ match }) => {
  const [sriovNetNodePoliciesData, loaded] = useK8sWatchResource({
    groupVersionKind: getGroupVersionKindForModel(SriovNetworkNodePolicyModel),
    isList: true,
    optional: true,
  });
  const namespace = _.get(match, 'params.ns', 'default');

  const history = useHistory();

  const models = useK8sModels();

  const hasHyperConvergedCRD = !!['v1beta1', 'v1alpha1', 'v1alpha3'].find(
    (v) => models?.[`${'hco.kubevirt.io'}~${v}~HyperConverged`],
  );

  const hasSriovNetNodePolicyCRD =
    !!models?.[
      `${SriovNetworkNodePolicyModel.apiGroup}~${SriovNetworkNodePolicyModel.apiVersion}~${SriovNetworkNodePolicyModel.kind}`
    ];

  const { t } = useNetworkingTranslation();
  const [loading, setLoading] = React.useState(
    hasSriovNetNodePolicyCRD && !loaded,
  );
  const [name, setName] = React.useState(generateNADName());
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [networkType, setNetworkType] = React.useState(null);
  const [typeParamsData, setTypeParamsData] = React.useState<TypeParamsData>(
    {},
  );
  const [error, setError] = React.useState(null);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  const formIsValid = React.useMemo(
    () =>
      validateForm(fieldErrors, name, networkType, typeParamsData, setError),
    [fieldErrors, name, networkType, typeParamsData],
  );

  const [networkConfig, networkConfigLoaded] =
    useK8sWatchResource<K8sResourceKind>({
      groupVersionKind: {
        kind: 'Network',
        version: 'v1',
        group: 'operator.openshift.io',
      },
      isList: false,
      name: 'cluster',
      namespaced: false,
    });

  const hasOVNK8sNetwork =
    networkConfig?.spec?.defaultNetwork?.type === 'OVNKubernetes';

  const networkTypeItems = getNetworkTypes(
    hasSriovNetNodePolicyCRD,
    hasHyperConvergedCRD,
    hasOVNK8sNetwork,
  );

  const dropdownItems = Object.keys(networkTypeItems).map((itemKey) => (
    <DropdownItem
      key={itemKey}
      value={itemKey}
      component="button"
      onClick={() => setNetworkType(itemKey)}
    >
      {networkTypeItems[itemKey]}
    </DropdownItem>
  ));

  const networkTypeTitle = t('Network Type');

  React.useEffect(
    () =>
      setLoading(hasSriovNetNodePolicyCRD && !loaded && !networkConfigLoaded),
    [hasSriovNetNodePolicyCRD, networkConfigLoaded, loaded],
  );

  // t('Create network attachment definition')

  const nadsList = resourcePathFromModel(NetworkAttachmentDefinitionModel);

  return (
    <div className="co-m-pane__body co-m-pane__form">
      <h1 className="co-m-pane__heading co-m-pane__heading--baseline">
        <div className="co-m-pane__name">{NET_ATTACH_DEF_HEADER_LABEL}</div>
        <div className="co-m-pane__heading-link">
          <Link to={`${nadsList}/~new`} id="yaml-link" replace>
            {t('Edit YAML')}
          </Link>
        </div>
      </h1>
      <Form className="nad-form">
        <FormGroup
          fieldId="basic-settings-name"
          isRequired
          label={t('Name')}
          labelIcon={
            <Popover
              aria-label={'Help'}
              bodyContent={() =>
                t(
                  'Networks are not project-bound. Using the same name creates a shared NAD.',
                )
              }
              position={PopoverPosition.right}
            >
              <HelpIcon className="network-type-options--help-icon" />
            </Popover>
          }
        >
          <TextInput
            type="text"
            placeholder={name}
            id="network-attachment-definition-name"
            onChange={(_event, value) =>
              handleNameChange(
                value,
                namespace,
                fieldErrors,
                setName,
                setFieldErrors,
              )
            }
            value={name}
          />

          {fieldErrors.nameValidationMsg && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem
                  variant="error"
                  icon={<RedExclamationCircleIcon />}
                >
                  {t(fieldErrors.nameValidationMsg)}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>

        <FormGroup
          fieldId="basic-settings-description"
          label={t('Description')}
        >
          <TextInput
            type="text"
            id="network-attachment-definition-description"
            onChange={(_event, value) => setDescription(value)}
            value={description}
          />
        </FormGroup>

        <FormGroup
          fieldId="basic-settings-network-type"
          required
          label={networkTypeTitle}
          className="network-type"
        >
          {_.isEmpty(networkTypeItems) && (
            <Alert
              className="co-alert"
              isInline
              variant="warning"
              title={'Missing installed operators'}
            >
              <Trans t={t}>
                <strong>OpenShift Virtualization Operator</strong> or{' '}
                <strong>SR-IOV Network Operator </strong>
                needs to be installed on the cluster, in order to pick the
                Network Type.
              </Trans>
            </Alert>
          )}
          <Dropdown
            id="network-type"
            selected={networkType}
            onSelect={() => setIsDropdownOpen(false)}
            popperProps={{ enableFlip: true, position: 'right' }}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                id="toggle-nads-network-type"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                isExpanded={isDropdownOpen}
                ref={toggleRef}
              >
                {networkTypeItems[networkType] || networkTypeTitle}
              </MenuToggle>
            )}
            isOpen={isDropdownOpen}
          >
            <DropdownList>{dropdownItems}</DropdownList>
          </Dropdown>
        </FormGroup>

        <div className="co-form-subsection">
          <NetworkTypeOptions
            networkType={networkType}
            setTypeParamsData={setTypeParamsData}
            sriovNetNodePoliciesData={sriovNetNodePoliciesData}
            typeParamsData={typeParamsData}
          />
        </div>

        {error && (
          <Alert isInline title={t('Error')} variant={AlertVariant.danger}>
            {error.message}
          </Alert>
        )}

        <ActionGroup className="pf-v5-c-form">
          <Button
            id="save-changes"
            isDisabled={!formIsValid || loading}
            isLoading={loading}
            onClick={(e) =>
              createNetAttachDef(
                e,
                description,
                name,
                networkType,
                typeParamsData,
                namespace,
                setError,
                setLoading,
                history,
              )
            }
            type="submit"
            variant="primary"
          >
            {t('Create')}
          </Button>
          <Button
            id="cancel"
            onClick={history.goBack}
            type="button"
            variant="secondary"
          >
            {t('Cancel')}
          </Button>
        </ActionGroup>
      </Form>
    </div>
  );
};

// const mapStateToProps = ({ k8s }) => {
//   const kindsInFlight = k8s.getIn(['RESOURCES', 'inFlight']);
//   const hasHyperConvergedCRD =
//     !kindsInFlight &&
//     !!['v1beta1', 'v1alpha1', 'v1alpha3'].find(
//       (v) =>
//         !!modelFor(
//           referenceForGroupVersionKind('hco.kubevirt.io')(v)('HyperConverged'),
//         ),
//     );

//   return {
//     // FIXME: These should be feature flags.
//     // TODO: Change back when ready to add back SR-IOV support
//     // hasSriovNetNodePolicyCRD:
//     //   !kindsInFlight && !!k8sModels.get(referenceForModel(SriovNetworkNodePolicyModel)),
//     hasSriovNetNodePolicyCRD: false,
//     hasHyperConvergedCRD,
//   };
// };

export default NetworkAttachmentDefinitionFormBase;

type FieldErrors = {
  nameValidationMsg?: string;
};
