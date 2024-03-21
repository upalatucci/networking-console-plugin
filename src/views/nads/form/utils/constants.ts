import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';

export const CLUSTER_NETWORK_CONFIG_NAME = 'cluster';
export const OVN_K8S = 'OVNKubernetes';

export const NetworkConfigModel: K8sModel = {
  label: 'Network',
  labelPlural: 'Networks',
  apiGroup: 'operator.openshift.io',
  kind: 'Network',
  apiVersion: 'v1',
  abbr: 'NO',
  namespaced: false,
  id: 'network',
  plural: 'networks',
  crd: true,
};
