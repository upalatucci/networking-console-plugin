import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';

export const CLUSTER_NETWORK_CONFIG_NAME = 'cluster';
export const OVN_K8S = 'OVNKubernetes';

export const NetworkConfigModel: K8sModel = {
  abbr: 'NO',
  apiGroup: 'operator.openshift.io',
  apiVersion: 'v1',
  crd: true,
  id: 'network',
  kind: 'Network',
  label: 'Network',
  labelPlural: 'Networks',
  namespaced: false,
  plural: 'networks',
};
