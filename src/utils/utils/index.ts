import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { DEFAULT_NAMESPACE } from '@utils/constants';

export * from './validateDNS';

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export const isEmpty = (obj) =>
  [Array, Object].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

export const resourcePathFromModel = (
  model: K8sModel,
  name?: string,
  namespace = DEFAULT_NAMESPACE,
) => {
  const { crd, namespaced, plural } = model;

  let url = '/k8s/';

  if (!namespaced) {
    url += 'cluster/';
  }

  if (namespaced) {
    url += namespace ? `ns/${namespace}/` : 'all-namespaces/';
  }

  if (crd) {
    url += `${model.apiGroup}~${model.apiVersion}~${model.kind}`;
  } else if (plural) {
    url += plural;
  }

  if (name) {
    // Some resources have a name that needs to be encoded. For instance,
    // Users can have special characters in the name like `#`.
    url += `/${encodeURIComponent(name)}`;
  }

  return url;
};
