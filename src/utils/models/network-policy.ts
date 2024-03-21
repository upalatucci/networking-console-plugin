import { TFunction } from 'i18next';
import * as _ from 'lodash';

import {
  IoK8sApiNetworkingV1NetworkPolicy,
  IoK8sApiNetworkingV1NetworkPolicyIngressRule,
} from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { Selector } from '@openshift-console/dynamic-plugin-sdk';
import {
  NetworkPolicyPeer as K8SPeer,
  NetworkPolicyPort as K8SPort,
} from '@utils/resources/networkpolicies/types';

// Reference: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#networkpolicyspec-v1-networking-k8s-io

export interface NetworkPolicy {
  egress: NetworkPolicyRules;
  ingress: NetworkPolicyRules;
  name: string;
  namespace: string;
  podSelector: string[][];
}

export interface NetworkPolicyRules {
  denyAll: boolean;
  rules: NetworkPolicyRule[];
}

export interface NetworkPolicyRule {
  key: string;
  peers: NetworkPolicyPeer[];
  ports: NetworkPolicyPort[];
}

export interface NetworkPolicyPeer {
  ipBlock?: NetworkPolicyIPBlock;
  key: string;
  namespaceSelector?: string[][];
  podSelector?: string[][];
}

export interface NetworkPolicyIPBlock {
  cidr: string;
  except: { key: string; value: string }[];
}

export type NetworkPolicyPort = {
  key: string;
  port: string;
  protocol: string;
};

const networkPolicyTypeIngress = 'Ingress';
const networkPolicyTypeEgress = 'Egress';

interface ConversionError {
  error: string;
  kind: 'invalid' | 'unsupported';
}

const isError = <T>(result: ConversionError | T): result is ConversionError => {
  return result && (result as ConversionError).error !== undefined;
};
export const isNetworkPolicyConversionError = isError;

const factorOutError = <T>(list: (ConversionError | T)[]): ConversionError | T[] => {
  const err = list.find((r) => isError(r)) as ConversionError | undefined;
  if (err) {
    return err;
  }
  return list as T[];
};

const errors = {
  isMissing: (t: TFunction, path: string): ConversionError => ({
    error: t('{{path}} is missing.', { path }),
    kind: 'invalid',
  }),
  notSupported: (t: TFunction, path: string): ConversionError => ({
    error: t('{{path}} found in resource, but is not supported in form.', {
      path,
    }),
    kind: 'unsupported',
  }),
  shouldBeAnArray: (t: TFunction, path: string): ConversionError => ({
    error: t('{{path}} should be an Array.', { path }),
    kind: 'invalid',
  }),
  shouldNotBeEmpty: (t: TFunction, path: string): ConversionError => ({
    error: t('{{path}} should not be empty.', { path }),
    kind: 'invalid',
  }),
};

export const selectorToK8s = (selector: string[][]): Selector => {
  const filtered = selector.filter((pair) => pair.length >= 2 && pair[0] !== '');
  if (filtered.length > 0) {
    return { matchLabels: _.fromPairs(filtered) };
  }
  return {};
};

const isValidSelector = (selector: string[][]): boolean => {
  const filtered = selector.filter((pair) => pair.length >= 2 && pair[0] !== '');
  if (filtered.length > 0) {
    const obj = _.fromPairs(filtered);
    return Object.keys(obj).length === filtered.length;
  }
  return true;
};

type Rule = { from?: K8SPeer[]; ports?: K8SPort[]; to?: K8SPeer[] };

const ruleToK8s = (
  rule: NetworkPolicyRule,
  direction: 'egress' | 'ingress',
): IoK8sApiNetworkingV1NetworkPolicyIngressRule => {
  const res: IoK8sApiNetworkingV1NetworkPolicyIngressRule = {};
  if (rule.peers.length > 0) {
    const peers = rule.peers.map((p) => {
      const peer: K8SPeer = {};
      if (p.ipBlock) {
        peer.ipBlock = {
          cidr: p.ipBlock.cidr,
          ...(p.ipBlock.except && {
            except: p.ipBlock.except.map((e) => e.value),
          }),
        };
      } else {
        if (p.podSelector) {
          peer.podSelector = selectorToK8s(p.podSelector);
        }
        if (p.namespaceSelector) {
          peer.namespaceSelector = selectorToK8s(p.namespaceSelector);
        }
      }
      return peer;
    });
    if (direction === 'ingress') {
      res.from = peers;
    }
  }
  if (rule.ports.length > 0) {
    res.ports = rule.ports.map((p) => ({
      port: p.port,
      protocol: p.protocol,
    }));
  }
  return res;
};

export const networkPolicyToK8sResource = (
  from: NetworkPolicy,
): IoK8sApiNetworkingV1NetworkPolicy => {
  const podSelector = selectorToK8s(from.podSelector);
  const policyTypes: string[] = [];
  const res: IoK8sApiNetworkingV1NetworkPolicy = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'NetworkPolicy',
    metadata: {
      name: from.name,
      namespace: from.namespace,
    },
    spec: {
      podSelector,
      policyTypes,
    },
  };
  if (from.ingress.denyAll) {
    policyTypes.push(networkPolicyTypeIngress);
    res.spec.ingress = [];
  } else if (from.ingress.rules.length > 0) {
    policyTypes.push(networkPolicyTypeIngress);
    res.spec.ingress = from.ingress.rules.map((r) => ruleToK8s(r, 'ingress'));
  }
  if (from.egress.denyAll) {
    policyTypes.push(networkPolicyTypeEgress);
    res.spec.egress = [];
  } else if (from.egress.rules.length > 0) {
    policyTypes.push(networkPolicyTypeEgress);
    res.spec.egress = from.egress.rules.map((r) => ruleToK8s(r, 'egress'));
  }
  return res;
};

const checkRulesValidity = (
  rules: NetworkPolicyRule[],
  t: TFunction,
): ConversionError | undefined => {
  for (const rule of rules) {
    for (const peer of rule.peers) {
      if (peer.podSelector && !isValidSelector(peer.podSelector)) {
        return {
          error: t('Duplicate keys found in peer pod selector'),
          kind: 'invalid',
        };
      }
      if (peer.namespaceSelector && !isValidSelector(peer.namespaceSelector)) {
        return {
          error: t('Duplicate keys found in peer namespace selector'),
          kind: 'invalid',
        };
      }
    }
  }
  return undefined;
};

export const checkNetworkPolicyValidity = (
  from: NetworkPolicy,
  t: TFunction,
): ConversionError | undefined => {
  if (!isValidSelector(from.podSelector)) {
    return {
      error: t('Duplicate keys found in main pod selector'),
      kind: 'invalid',
    };
  }
  const errIn = checkRulesValidity(from.ingress.rules, t);
  if (errIn) {
    return errIn;
  }
  const errEg = checkRulesValidity(from.egress.rules, t);
  if (errEg) {
    return errEg;
  }
  return undefined;
};

export const networkPolicyNormalizeK8sResource = (
  from: IoK8sApiNetworkingV1NetworkPolicy,
): IoK8sApiNetworkingV1NetworkPolicy => {
  // This normalization is performed in order to make sure that converting from and to k8s back and forth remains consistent
  const clone = _.cloneDeep(from);
  if (clone.spec) {
    if (_.isEmpty(clone.spec.podSelector)) {
      clone.spec.podSelector = {};
    }
    if (!clone.spec.policyTypes) {
      clone.spec.policyTypes = [networkPolicyTypeIngress];
      if (_.has(clone.spec, 'egress')) {
        clone.spec.policyTypes.push(networkPolicyTypeEgress);
      }
    }
    if (
      !_.has(clone.spec, 'ingress') &&
      clone.spec.policyTypes.includes(networkPolicyTypeIngress)
    ) {
      clone.spec.ingress = [];
    }
    if (!_.has(clone.spec, 'egress') && clone.spec.policyTypes.includes(networkPolicyTypeEgress)) {
      clone.spec.egress = [];
    }
    [clone.spec.ingress, clone.spec.egress].forEach(
      (xgress) =>
        xgress &&
        xgress.forEach(
          (r) =>
            r.ports &&
            r.ports.forEach((p) => {
              p.port = Number.isNaN(Number(p.port)) ? p.port : Number(p.port);
            }),
        ),
    );
  }
  return clone;
};

const selectorFromK8s = (
  selector: Selector | undefined,
  path: string,
  t: TFunction,
): ConversionError | string[][] => {
  if (!selector) {
    return [];
  }
  if (selector.matchExpressions) {
    return errors.notSupported(t, `${path}.matchExpressions`);
  }
  const matchLabels = selector.matchLabels || {};
  return _.isEmpty(matchLabels) ? [] : _.map(matchLabels, (key: string, val: string) => [val, key]);
};

const portFromK8s = (port: K8SPort): ConversionError | NetworkPolicyPort => {
  return {
    key: _.uniqueId('port-'),
    port: port.port ? String(port.port) : '',
    protocol: port.protocol || 'TCP',
  };
};

const ipblockFromK8s = (
  ipblock: { cidr: string; except?: string[] },
  path: string,
  t: TFunction,
): ConversionError | NetworkPolicyIPBlock => {
  const res: NetworkPolicyIPBlock = {
    cidr: ipblock.cidr || '',
    except: [],
  };
  if (_.has(ipblock, 'except')) {
    if (!_.isArray(ipblock.except)) {
      return errors.shouldBeAnArray(t, `${path}.except`);
    }
    res.except = ipblock.except
      ? ipblock.except.map((e) => ({ key: _.uniqueId('exception-'), value: e }))
      : [];
  }
  return res;
};

const peerFromK8s = (
  peer: K8SPeer,
  path: string,
  t: TFunction,
): ConversionError | NetworkPolicyPeer => {
  const out: NetworkPolicyPeer = { key: _.uniqueId() };
  if (peer.ipBlock) {
    const ipblock = ipblockFromK8s(peer.ipBlock, `${path}.ipBlock`, t);
    if (isError(ipblock)) {
      return ipblock;
    }
    out.ipBlock = ipblock;
  } else {
    if (peer.podSelector) {
      const podSel = selectorFromK8s(peer.podSelector, `${path}.podSelector`, t);
      if (isError(podSel)) {
        return podSel;
      }
      out.podSelector = podSel;
    }
    if (peer.namespaceSelector) {
      const nsSel = selectorFromK8s(peer.namespaceSelector, `${path}.namespaceSelector`, t);
      if (isError(nsSel)) {
        return nsSel;
      }
      out.namespaceSelector = nsSel;
    }
  }
  if (!out.ipBlock && !out.namespaceSelector && !out.podSelector) {
    return errors.shouldNotBeEmpty(t, path);
  }
  return out;
};

const ruleFromK8s = (
  rule: Rule,
  path: string,
  peersKey: 'from' | 'to',
  t: TFunction,
): ConversionError | NetworkPolicyRule => {
  const converted: NetworkPolicyRule = {
    key: _.uniqueId(),
    peers: [],
    ports: [],
  };
  if (rule.ports) {
    if (!_.isArray(rule.ports)) {
      return errors.shouldBeAnArray(t, `${path}.ports`);
    }
    const ports = factorOutError(rule.ports.map((p) => portFromK8s(p)));
    if (isError(ports)) {
      return ports;
    }
    converted.ports = ports;
  }
  const rulePeers = rule[peersKey];
  if (rulePeers) {
    if (!_.isArray(rule[peersKey])) {
      return errors.shouldBeAnArray(t, `${path}.${peersKey}`);
    }
    const peers = factorOutError(
      rulePeers.map((p, idx) => peerFromK8s(p, `${path}.${peersKey}[${idx}]`, t)),
    );
    if (isError(peers)) {
      return peers;
    }
    converted.peers = peers;
  }
  return converted;
};

const rulesFromK8s = (
  rules: Rule[] | undefined,
  path: string,
  peersKey: 'from' | 'to',
  isAffected: boolean,
  t: TFunction,
): ConversionError | NetworkPolicyRules => {
  if (!isAffected) {
    return { denyAll: false, rules: [] };
  }
  // Quoted from doc reference: "If this field is empty then this NetworkPolicy does not allow any traffic"
  if (!rules) {
    return { denyAll: true, rules: [] };
  }
  if (!_.isArray(rules)) {
    return errors.shouldBeAnArray(t, path);
  }
  if (rules.length === 0) {
    return { denyAll: true, rules: [] };
  }
  const converted = factorOutError(
    rules.map((r, idx) => ruleFromK8s(r, `${path}[${idx}]`, peersKey, t)),
  );
  if (isError(converted)) {
    return converted;
  }
  return { denyAll: false, rules: converted };
};

export const networkPolicyFromK8sResource = (
  from: IoK8sApiNetworkingV1NetworkPolicy,
  t: TFunction,
): ConversionError | NetworkPolicy => {
  if (!from.metadata) {
    return errors.isMissing(t, 'metadata');
  }
  if (!from.spec) {
    return errors.isMissing(t, 'spec');
  }
  // per spec, podSelector can be null, but key must be present
  if (!_.has(from.spec, 'podSelector')) {
    return errors.isMissing(t, 'spec.podSelector');
  }
  const podSelector = selectorFromK8s(from.spec.podSelector, 'spec.podSelector', t);
  if (isError(podSelector)) {
    return podSelector;
  }
  if (from.spec.policyTypes && !_.isArray(from.spec.policyTypes)) {
    return errors.shouldBeAnArray(t, 'spec.policyTypes');
  }

  // Note, the logic differs between ingress and egress, see https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#networkpolicyspec-v1-networking-k8s-io
  // A policy affects egress if it is explicitely specified in policyTypes, or if policyTypes isn't set and there is an egress section.
  // A policy affects ingress if it is explicitely specified in policyTypes, or if policyTypes isn't set, regardless the presence of an ingress sections.
  const affectsEgress = from.spec.policyTypes
    ? from.spec.policyTypes.includes(networkPolicyTypeEgress)
    : !!from.spec.egress;
  const affectsIngress = from.spec.policyTypes
    ? from.spec.policyTypes.includes(networkPolicyTypeIngress)
    : true;

  const ingressRules = rulesFromK8s(from.spec.ingress, 'spec.ingress', 'from', affectsIngress, t);
  if (isError(ingressRules)) {
    return ingressRules;
  }

  const egressRules = rulesFromK8s(from.spec.egress, 'spec.egress', 'to', affectsEgress, t);
  if (isError(egressRules)) {
    return egressRules;
  }

  return {
    egress: egressRules,
    ingress: ingressRules,
    name: from.metadata.name || '',
    namespace: from.metadata.namespace || '',
    podSelector,
  };
};
