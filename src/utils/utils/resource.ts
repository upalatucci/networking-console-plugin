import {
  K8sGroupVersionKind,
  K8sModel,
  K8sResourceKindReference,
} from '@openshift-console/dynamic-plugin-sdk';
import { DEFAULT_NAMESPACE } from '@utils/constants';

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

export const getReference = ({
  group,
  kind,
  version,
}: K8sGroupVersionKind): K8sResourceKindReference => [group || 'core', version, kind].join('~');

export const getReferenceForModel = (model: K8sModel): K8sResourceKindReference =>
  getReference({ group: model.apiGroup, kind: model.kind, version: model.apiVersion });
