import {
  AccessReviewResourceAttributes,
  K8sModel,
  K8sResourceCommon,
  K8sVerb,
} from '@openshift-console/dynamic-plugin-sdk';

/**
 *
 * @param resource k8s resource
 * @returns resource's name
 */
export const getName = <A extends K8sResourceCommon = K8sResourceCommon>(resource: A) =>
  resource?.metadata?.name;

/**
 *
 * @param resource k8s resource
 * @returns resource's namespace
 */
export const getNamespace = <A extends K8sResourceCommon = K8sResourceCommon>(resource: A) =>
  resource?.metadata?.namespace;

/**
 * function to build AccessReviewResourceAttributes from a resource
 * @param model - k8s model
 * @param obj - resource
 * @param verb - verb
 * @param subresource - subresource
 * @returns AccessReviewResourceAttributes
 */
export const asAccessReview = (
  model: K8sModel,
  obj: K8sResourceCommon,
  verb: K8sVerb,
  subresource?: string,
): AccessReviewResourceAttributes => {
  if (!obj) {
    return null;
  }
  return {
    group: model.apiGroup,
    name: obj?.metadata?.name,
    namespace: obj?.metadata?.namespace,
    resource: model.plural,
    subresource,
    verb,
  };
};
