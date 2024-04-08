import { K8sResourceCondition, K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export type Traffic = {
  latestRevision?: boolean;
  percent: number;
  revisionName: string;
  tag?: string;
  url?: string;
};

export type RouteKind = {
  status: {
    traffic: Traffic[];
    url: string;
  };
} & K8sResourceKind;

export type RouteIngress = {
  conditions: K8sResourceCondition[];
  host?: string;
  routerCanonicalHostname?: string;
  routerName?: string;
  wildcardPolicy?: string;
};
