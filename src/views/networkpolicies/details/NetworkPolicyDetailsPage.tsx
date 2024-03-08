import * as React from 'react';

import {
  HorizontalNav,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';

import NetworkPolicyPageTitle from './components/NetworkPolicyDetailsPageTitle';
import { useNetworkPolicyTabs } from './hooks/useNetworkPolicyTabs';
import {
  NetworkPolicyModel,
  modelToGroupVersionKind,
} from '@kubevirt-ui/kubevirt-api/console';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';

export type NetworkPolicyPageNavProps = {
  name: string;
  namespace: string;
};

const NetworkPolicyPageNav: React.FC<NetworkPolicyPageNavProps> = ({
  name,
  namespace,
}) => {
  const [networkPolicy] = useK8sWatchResource<NetworkPolicyKind>({
    groupVersionKind: modelToGroupVersionKind(NetworkPolicyModel),
    name,
    namespace,
  });
  const pages = useNetworkPolicyTabs();
  return (
    <>
      <NetworkPolicyPageTitle networkPolicy={networkPolicy} />
      <HorizontalNav pages={pages} resource={networkPolicy} />
    </>
  );
};

export default NetworkPolicyPageNav;
