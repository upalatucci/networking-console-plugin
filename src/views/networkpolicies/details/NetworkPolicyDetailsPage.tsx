import * as React from 'react';

import { modelToGroupVersionKind, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';

import NetworkPolicyPageTitle from './components/NetworkPolicyDetailsPageTitle';
import { useNetworkPolicyTabs } from './hooks/useNetworkPolicyTabs';

export type NetworkPolicyPageNavProps = {
  name: string;
  namespace: string;
};

const NetworkPolicyPageNav: React.FC<NetworkPolicyPageNavProps> = ({ name, namespace }) => {
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
