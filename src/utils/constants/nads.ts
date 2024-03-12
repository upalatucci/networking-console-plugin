// t('Create network attachment definition')
export const NET_ATTACH_DEF_HEADER_LABEL = 'Create network attachment definition';

export const ELEMENT_TYPES = {
  CHECKBOX: 'checkbox',
  DROPDOWN: 'dropdown',
  TEXT: 'text',
  TEXTAREA: 'textarea',
};

export const cnvBridgeNetworkType = 'cnv-bridge';
export const ovnKubernetesNetworkType = 'ovn-k8s-cni-overlay';
export const ovnKubernetesSecondaryLocalnet = 'ovn-k8s-cni-overlay-localnet';

export const networkTypes = {
  [cnvBridgeNetworkType]: 'CNV Linux bridge',
  [ovnKubernetesNetworkType]: 'OVN Kubernetes L2 overlay network',
  [ovnKubernetesSecondaryLocalnet]: 'OVN Kubernetes secondary localnet network',
  sriov: 'SR-IOV',
};

export enum NetworkTypes {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'CNV-Bridge' = 'CNV Linux bridge',
  SRIOV = 'SR-IOV',
}

// t('Resource name')
// t('VLAN tag number')
// t('IP address management')
// t('Bridge name')
// t('MAC spoof check')
// t('Bridge mapping')
// t('Physical network name. A bridge mapping must be configured on cluster nodes to map between physical network names and Open vSwitch bridges.')
// t('MTU')
// t('VLAN')

export const networkTypeParams: NetworkTypeParamsList = {
  [cnvBridgeNetworkType]: {
    bridge: {
      name: 'Bridge name',
      required: true,
      type: ELEMENT_TYPES.TEXT,
    },
    macspoofchk: {
      initValue: true,
      name: 'MAC spoof check',
      type: ELEMENT_TYPES.CHECKBOX,
    },
    vlanTagNum: {
      hintText: 'Ex: 100',
      name: 'VLAN tag number',
      type: ELEMENT_TYPES.TEXT,
    },
  },
  [ovnKubernetesSecondaryLocalnet]: {
    bridgeMapping: {
      hintText:
        'Physical network name. A bridge mapping must be configured on cluster nodes to map between physical network names and Open vSwitch bridges.',
      name: 'Bridge mapping',
      required: true,
      type: ELEMENT_TYPES.TEXT,
    },
    mtu: {
      name: 'MTU',
      type: ELEMENT_TYPES.TEXT,
    },
    vlanID: {
      name: 'VLAN',
      type: ELEMENT_TYPES.TEXT,
    },
  },
  sriov: {
    ipam: {
      name: 'IP address management',
      type: ELEMENT_TYPES.TEXTAREA,
    },
    resourceName: {
      name: 'Resource name',
      required: true,
      type: ELEMENT_TYPES.DROPDOWN,
      values: {},
    },
    vlanTagNum: {
      hintText: 'Ex: 100',
      name: 'VLAN tag number',
      type: ELEMENT_TYPES.TEXT,
    },
  },
};

type NetworkTypeParamsList = {
  [key: string]: NetworkTypeParams;
};

export type NetworkTypeParams = {
  [key: string]: NetworkTypeParameter;
};

export type NetworkTypeParameter = {
  hintText?: string;
  initValue?: any;
  name: string;
  required?: boolean;
  type: string;
  validation?: (params: {
    [key: string]: { validationMsg: null | string; value: any };
  }) => null | string;
  values?: { [key: string]: string };
};
