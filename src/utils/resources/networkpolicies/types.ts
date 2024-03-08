import {
  K8sResourceCommon,
  Selector,
} from '@openshift-console/dynamic-plugin-sdk';

export type NetworkPolicyKind = K8sResourceCommon & {
  spec: {
    podSelector?: Selector;
    ingress?: {
      from?: NetworkPolicyPeer[];
      ports?: NetworkPolicyPort[];
    }[];
    egress?: {
      to?: NetworkPolicyPeer[];
      ports?: NetworkPolicyPort[];
    }[];
    policyTypes?: string[];
  };
};

export type NetworkPolicyPeer = {
  podSelector?: Selector;
  namespaceSelector?: Selector;
  ipBlock?: {
    cidr: string;
    except?: string[];
  };
};

export type NetworkPolicyPort = {
  port?: string | number;
  protocol?: string;
};
