import { ClusterUserDefinedNetworkModel, UserDefinedNetworkModel } from '@utils/models';

import {
  ClusterUserDefinedNetworkKind,
  UserDefinedNetworkKind,
  UserDefinedNetworkLayer3Subnet,
} from '../types';

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

export const getTopology = (
  obj: ClusterUserDefinedNetworkKind | UserDefinedNetworkKind,
): string => {
  return obj.spec?.network?.topology || obj?.spec?.topology || null;
};

export const getDescription = (udn: UserDefinedNetworkKind): string => {
  return udn?.metadata?.annotations?.description;
};

export const getModel = (obj: ClusterUserDefinedNetworkKind | UserDefinedNetworkKind) => {
  if (obj.kind === 'ClusterUserDefinedNetwork') {
    return ClusterUserDefinedNetworkModel;
  } else {
    return UserDefinedNetworkModel;
  }
};
