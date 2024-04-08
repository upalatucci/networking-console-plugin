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

/**
 * Get creation timestamp
 * @param resource - resource from which to retrieve creation timestamp
 * @returns Date - creation timestamp as a Date object
 */
export const getCreationTimestamp = <A extends K8sResourceCommon = K8sResourceCommon>(
  resource: A,
) => new Date(resource?.metadata?.creationTimestamp);

/**
 * Get annotations
 * @param resource - resource from which to retrieve annotations
 * @param defaultValue - value to return if there are no annotations
 * @returns { [key: string]: string } - annotations
 */
export const getAnnotations = <A extends K8sResourceCommon = K8sResourceCommon>(
  resource: A,
  defaultValue?: {
    [key: string]: string;
  },
): { [key: string]: string } => resource?.metadata?.annotations || defaultValue;

/**
 * Get labels
 * @param resource - resource from which to retrieve labels
 * @param defaultValue - value to return if there are no annotations
 * @returns { [key: string]: string } - labels
 */
export const getLabels = <A extends K8sResourceCommon = K8sResourceCommon>(
  resource: A,
  defaultValue?: { [key: string]: string },
): { [key: string]: string } => resource?.metadata?.labels || defaultValue;

/**
 * Get UID
 * @param resource - resource from which to retrieve UID
 * @returns string - UID
 */
export const getUID = <A extends K8sResourceCommon = K8sResourceCommon>(resource: A): string =>
  resource?.metadata?.uid;
