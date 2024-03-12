import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export type NetworkAttachmentDefinitionAnnotations = {
  description?: string;
  'k8s.v1.cni.cncf.io/resourceName'?: string;
};

export type IPAMConfig = {
  dataDir?: string;
  subnet?: string;
  type?: string;
};

export type NetworkAttachmentDefinitionPlugin = {
  [key: string]: any;
};

export type NetworkAttachmentDefinitionConfig = {
  bridge?: string;
  cniVersion: string;
  ipam?: IPAMConfig;
  isGateway?: true;
  macspoofchk?: boolean;
  mtu?: number;
  name: string;
  netAttachDefName?: string;
  plugins?: NetworkAttachmentDefinitionPlugin[];
  preserveDefaultVlan?: boolean;
  topology?: string;
  type?: string;
  vlan?: number;
  vlanID?: number;
};

// The config is a JSON object with the NetworkAttachmentDefinitionConfig type stored as a string
export type NetworkAttachmentDefinitionSpec = {
  config: string;
};

export type NetworkAttachmentDefinitionKind = {
  spec?: NetworkAttachmentDefinitionSpec;
} & K8sResourceKind;

export type TypeParamsDataItem = {
  validationMsg?: string;
  value?: any;
};

export type TypeParamsData = {
  [key: string]: TypeParamsDataItem;
};
