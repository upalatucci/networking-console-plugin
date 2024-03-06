import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';
import { getName, getNamespace } from '@utils/resources/shared';

export const getBasicID = <A extends K8sResourceKind = K8sResourceKind>(
  entity: A,
) => `${getNamespace(entity)}-${getName(entity)}`;

export const prefixedID = (idPrefix: string, id: string) =>
  idPrefix && id ? `${idPrefix}-${id}` : null;
