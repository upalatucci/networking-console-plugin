import { K8sResourceCommon, Selector } from '@openshift-console/dynamic-plugin-sdk';

export type NetworkPolicyKind = K8sResourceCommon & {
  spec: {
    egress?: {
      ports?: NetworkPolicyPort[];
      to?: NetworkPolicyPeer[];
    }[];
    ingress?: {
      from?: NetworkPolicyPeer[];
      ports?: NetworkPolicyPort[];
    }[];
    podSelector?: Selector;
    policyTypes?: string[];
  };
};

export type NetworkPolicyPeer = {
  ipBlock?: {
    cidr: string;
    except?: string[];
  };
  namespaceSelector?: Selector;
  podSelector?: Selector;
};

export type NetworkPolicyPort = {
  port?: number | string;
  protocol?: string;
};
