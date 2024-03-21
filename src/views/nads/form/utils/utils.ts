import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';
import { isEmpty } from '@utils/utils';
import {
  IPAMConfig,
  NetworkAttachmentDefinitionAnnotations,
  NetworkAttachmentDefinitionConfig,
  NetworkAttachmentDefinitionKind,
  RESOURCE_NAME_ANNOTATION,
} from '@utils/resources/nads/types';
import NetworkAttachmentDefinitionModel from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import {
  NetworkAttachmentDefinitionFormInput,
  NetworkTypeKeys,
  NetworkTypeKeysType,
  networkTypes,
} from './types';

export const generateNADName = (): string => {
  return `network-${uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '-',
  })}`;
};

export const getNetworkTypes = (
  hasSriovNetNodePolicyCRD: boolean,
  hasHyperConvergedCRD: boolean,
  hasOVNK8sNetwork: boolean,
) => {
  const types: Record<NetworkTypeKeysType, string> = { ...networkTypes };
  if (!hasSriovNetNodePolicyCRD) {
    delete types[NetworkTypeKeys.sriovNetworkType];
  }

  if (!hasHyperConvergedCRD) {
    delete types[NetworkTypeKeys.cnvBridgeNetworkType];
  }

  if (!hasOVNK8sNetwork) {
    delete types[NetworkTypeKeys.ovnKubernetesNetworkType];
    delete types[NetworkTypeKeys.ovnKubernetesSecondaryLocalnet];
  }

  return types;
};

const buildConfig = (
  formData: NetworkAttachmentDefinitionFormInput,
  namespace: string,
): NetworkAttachmentDefinitionConfig => {
  const { name, networkType } = formData;
  const networkTypeData = formData?.[networkType];

  const commonConfig: Partial<NetworkAttachmentDefinitionConfig> = {
    cniVersion: '0.3.1',
    name,
    type: networkType,
  };

  const ipam = parseIPAM(networkTypeData?.ipam);
  const netAttachDefName = `${namespace}/${name}`;

  const specificConfig: Record<NetworkTypeKeys, Partial<NetworkAttachmentDefinitionConfig>> = {
    [NetworkTypeKeys.cnvBridgeNetworkType]: {
      bridge: networkTypeData?.bridge || '',
      vlan: parseInt(networkTypeData?.vlanTagNum, 10) || undefined,
      macspoofchk: networkTypeData?.macspoofchk ?? true,
      preserveDefaultVlan: false,
      ipam,
    },
    [NetworkTypeKeys.sriovNetworkType]: {
      ipam,
    },
    [NetworkTypeKeys.ovnKubernetesNetworkType]: {
      topology: 'layer2',
      netAttachDefName,
    },
    [NetworkTypeKeys.ovnKubernetesSecondaryLocalnet]: {
      cniVersion: '0.4.0',
      name: networkTypeData?.bridgeMapping || '',
      topology: 'localnet',
      vlanID: parseInt(networkTypeData?.vlanID, 10) || undefined,
      mtu: parseInt(networkTypeData?.mtu, 10) || undefined,
      netAttachDefName,
    },
  };

  return { ...commonConfig, ...specificConfig[networkType] };
};

const parseIPAM = (ipamString: string | undefined): IPAMConfig => {
  try {
    return JSON.parse(ipamString || '{}');
  } catch (e) {
    console.error('Could not parse ipam.value JSON', e); // eslint-disable-line no-console
    return {};
  }
};

const getResourceName = (
  formData: NetworkAttachmentDefinitionFormInput,
  networkType: string,
): string => {
  const paramsData = formData?.[networkType];

  if (isEmpty(paramsData)) return null;

  return networkType === NetworkTypeKeys.cnvBridgeNetworkType
    ? `bridge.network.kubevirt.io/${paramsData?.bridge ?? ''}`
    : `openshift.io/${paramsData?.resourceName ?? ''}`;
};

export const createNetAttachDef = (
  formData: NetworkAttachmentDefinitionFormInput,
  namespace: string,
) => {
  const { description, networkType, name } = formData;
  const config = JSON.stringify(buildConfig(formData, namespace));
  const resourceName = getResourceName(formData, networkType);
  const annotations: NetworkAttachmentDefinitionAnnotations = {
    ...(!isEmpty(resourceName) && { [RESOURCE_NAME_ANNOTATION]: resourceName }),
    ...(!isEmpty(description) && { description: description }),
  };

  const newNetAttachDef: NetworkAttachmentDefinitionKind = {
    apiVersion: `${NetworkAttachmentDefinitionModel.apiGroup}/${NetworkAttachmentDefinitionModel.apiVersion}`,
    kind: NetworkAttachmentDefinitionModel.kind,
    metadata: {
      annotations,
      name,
      namespace,
    },
    spec: {
      config,
    },
  };

  return k8sCreate({ data: newNetAttachDef, model: NetworkAttachmentDefinitionModel });
};
