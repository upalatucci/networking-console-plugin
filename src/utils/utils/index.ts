import {
  K8sGroupVersionKind,
  K8sModel,
  K8sResourceKindReference,
} from '@openshift-console/dynamic-plugin-sdk';
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

export const isEqualObject = (object, otherObject) => {
  if (object === otherObject) {
    return true;
  }

  if (object === null || otherObject === null) {
    return false;
  }

  if (object?.constructor !== otherObject?.constructor) {
    return false;
  }

  if (typeof object !== 'object') {
    return false;
  }

  const objectKeys = Object.keys(object);
  const otherObjectKeys = Object.keys(otherObject);

  if (objectKeys.length !== otherObjectKeys.length) {
    return false;
  }

  for (const key of objectKeys) {
    if (!otherObjectKeys.includes(key) || !isEqualObject(object[key], otherObject[key])) {
      return false;
    }
  }

  return true;
};

export const getReference = ({
  group,
  kind,
  version,
}: K8sGroupVersionKind): K8sResourceKindReference => [group || 'core', version, kind].join('~');

export const getReferenceForModel = (model: K8sModel): K8sResourceKindReference =>
  getReference({ group: model.apiGroup, kind: model.kind, version: model.apiVersion });
