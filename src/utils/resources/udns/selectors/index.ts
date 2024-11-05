import { UserDefinedNetworkKind, UserDefinedNetworkLayer3Subnet } from '../types';

export const getLayer2Subnets = (udn: UserDefinedNetworkKind): string[] => {
  return udn.spec?.layer2?.subnets || [];
};

export const getLayer2JoinSubnets = (udn: UserDefinedNetworkKind): string[] => {
  return udn.spec?.layer2?.joinSubnets || [];
};

export const getLayer3Subnets = (udn: UserDefinedNetworkKind): UserDefinedNetworkLayer3Subnet[] => {
  return udn.spec?.layer3?.subnets || [];
};

export const getLayer3JoinSubnets = (udn: UserDefinedNetworkKind): string[] => {
  return udn.spec?.layer3?.joinSubnets || [];
};

export const getTopology = (udn: UserDefinedNetworkKind): string => {
  return udn?.spec?.topology || null;
};

export const getDescription = (udn: UserDefinedNetworkKind): string => {
  return udn?.metadata?.annotations?.description;
};
