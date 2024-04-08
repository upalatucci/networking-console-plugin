export * from './network-policy';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { t } from '@utils/hooks/useNetworkingTranslation';

export const QuickStartModel: K8sModel = {
  abbr: 'CQS',
  apiGroup: 'console.openshift.io',
  apiVersion: 'v1',
  crd: true,
  kind: 'ConsoleQuickStart',
  label: 'ConsoleQuickStart',
  labelPlural: 'ConsoleQuickStarts',
  namespaced: false,
  plural: 'consolequickstarts',
  propagationPolicy: 'Background',
};

export const EndPointSliceModel: K8sModel = {
  abbr: 'EPS',
  apiGroup: 'discovery.k8s.io',
  apiVersion: 'v1',
  kind: 'EndpointSlice',
  label: 'EndpointSlice',
  labelPlural: 'EndpointSlices',
  namespaced: true,
  plural: 'endpointslices',
};

export const MultiNetworkPolicyModel: K8sModel = {
  abbr: 'MNP',
  apiGroup: 'k8s.cni.cncf.io',
  apiVersion: 'v1beta1',
  id: 'multinetworkpolicy',
  kind: 'MultiNetworkPolicy',
  // t('MultiNetworkPolicy')
  label: 'MultiNetworkPolicy',
  labelKey: 'multi-networkpolicies',
  // t('MultiNetworkPolicies')
  labelPlural: 'MultiNetworkPolicies',
  labelPluralKey: 'multi-networkpolicies',
  namespaced: true,
  plural: 'multi-networkpolicies',
};

export const NetworkOperatorModel: K8sModel = {
  abbr: 'N',
  apiGroup: 'operator.openshift.io',
  apiVersion: 'v1',
  id: 'Network',
  kind: 'Network',
  label: 'network',
  labelKey: t('network'),
  labelPlural: 'Networks',
  labelPluralKey: t('networks'),
  namespaced: false,
  plural: 'networks',
};
