import {
  IoK8sApiNetworkingV1Ingress,
  IoK8sApiNetworkingV1IngressRule,
} from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { get, isString } from '@utils/utils';

export const ingressValidHosts = (ingress: IoK8sApiNetworkingV1Ingress) =>
  get(ingress, 'spec.rules', [])
    .map((rule: IoK8sApiNetworkingV1IngressRule) => rule?.host)
    .filter(isString);

export const getHostsStr = (ingress: IoK8sApiNetworkingV1Ingress) => {
  const hosts = ingressValidHosts(ingress);
  const hostsStr = hosts.join(', ');

  return hosts?.length ? hostsStr : null;
};
