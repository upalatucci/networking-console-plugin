import NetworkAttachmentDefinitionModel from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import {
  IPAMConfig,
  NetworkAttachmentDefinitionAnnotations,
  NetworkAttachmentDefinitionConfig,
  NetworkAttachmentDefinitionKind,
  RESOURCE_NAME_ANNOTATION,
} from '@utils/resources/nads/types';
import { isEmpty } from '@utils/utils';
import { networkConsole } from '@utils/utils/utils';

import { NetworkAttachmentDefinitionFormInput, NetworkTypeKeys } from './types';

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
      bridge: networkTypeData?.bridge,
      ipam,
      macspoofchk: networkTypeData?.macspoofchk,
      preserveDefaultVlan: false,
      vlan: parseInt(networkTypeData?.vlanTagNum, 10) || undefined,
    },
    [NetworkTypeKeys.ovnKubernetesNetworkType]: {
      netAttachDefName,
      topology: 'layer2',
    },
    [NetworkTypeKeys.ovnKubernetesSecondaryLocalnet]: {
      cniVersion: '0.4.0',
      mtu: parseInt(networkTypeData?.mtu, 10) || undefined,
      name: networkTypeData?.bridgeMapping,
      netAttachDefName,
      topology: 'localnet',
      vlanID: parseInt(networkTypeData?.vlanID, 10) || undefined,
    },
    [NetworkTypeKeys.sriovNetworkType]: {
      ipam,
    },
  };

  return { ...commonConfig, ...specificConfig[networkType] };
};

const parseIPAM = (ipamString: string | undefined): IPAMConfig => {
  try {
    return JSON.parse(ipamString || '{}');
  } catch (e) {
    networkConsole.error('Could not parse IP address management JSON', e);
    return {};
  }
};

const getResourceName = (
  formData: NetworkAttachmentDefinitionFormInput,
  networkType: string,
): string => {
  const paramsData = formData?.[networkType];

  if (isEmpty(paramsData)) return null;

  if (networkType === NetworkTypeKeys.cnvBridgeNetworkType)
    return `bridge.network.kubevirt.io/${paramsData?.bridge}`;

  return !isEmpty(paramsData?.resourceName) ? `openshift.io/${paramsData?.resourceName}` : null;
};

export const createNetAttachDef = (
  formData: NetworkAttachmentDefinitionFormInput,
  namespace: string,
) => {
  const { description, name, networkType } = formData;
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
