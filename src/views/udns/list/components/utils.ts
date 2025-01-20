import { ALL_NAMESPACES_KEY, DEFAULT_NAMESPACE } from '@utils/constants';
import { ClusterUserDefinedNetworkModel, UserDefinedNetworkModel } from '@utils/models';
import { FIXED_PRIMARY_UDN_NAME } from '@utils/resources/udns/constants';
import {
  ClusterUserDefinedNetworkKind,
  UserDefinedNetworkKind,
  UserDefinedNetworkRole,
} from '@utils/resources/udns/types';
import { generateName, isEmpty } from '@utils/utils';

import { UDNForm } from './constants';

export const createUDN = (namespace: string): UserDefinedNetworkKind => ({
  apiVersion: `${UserDefinedNetworkModel.apiGroup}/${UserDefinedNetworkModel.apiVersion}`,
  kind: UserDefinedNetworkModel.kind,
  metadata: {
    name: FIXED_PRIMARY_UDN_NAME,
    namespace,
  },
  spec: {
    layer2: {
      ipamLifecycle: 'Persistent',
      role: UserDefinedNetworkRole.Primary,
      subnets: [''],
    },
    topology: 'Layer2',
  },
});

export const createClusterUDN = (name: string): ClusterUserDefinedNetworkKind => ({
  apiVersion: `${ClusterUserDefinedNetworkModel.apiGroup}/${ClusterUserDefinedNetworkModel.apiVersion}`,
  kind: ClusterUserDefinedNetworkModel.kind,
  metadata: {
    name,
  },
  spec: {
    namespaceSelector: { matchExpressions: [] },
    network: {
      layer2: {
        ipamLifecycle: 'Persistent',
        role: UserDefinedNetworkRole.Primary,
        subnets: [''],
      },
      topology: 'Layer2',
    },
  },
});

export const getDefaultUDN = (isClusterUDN: boolean, namespace: string): UDNForm => {
  return isClusterUDN
    ? createClusterUDN(generateName('cluster-udn'))
    : createUDN(namespace === ALL_NAMESPACES_KEY ? DEFAULT_NAMESPACE : namespace);
};

export const isUDNValid = (udn: UDNForm): boolean => {
  const clusterUDNConnected =
    Object.values(
      udn?.spec?.namespaceSelector?.matchExpressions ||
        udn?.spec?.namespaceSelector?.matchLabels ||
        {},
    ).length > 0;

  return !isEmpty(udn?.metadata?.namespace) || clusterUDNConnected;
};
