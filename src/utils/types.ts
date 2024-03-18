import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

type EndpointSlice = {
  kind?: string;
  name?: string;
  namespace?: string;
  uid?: string;
};

export type EndpointSliceKind = {
  endpoints?: EndpointSlice[];
} & K8sResourceCommon;
