import * as React from 'react';

import { modelToGroupVersionKind, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

import NetworkPolicyPageTitle from './components/NetworkPolicyDetailsPageTitle';
import { useNetworkPolicyTabs } from './hooks/useNetworkPolicyTabs';
import Loading from '@utils/components/Loading/Loading';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';

export type NetworkPolicyPageNavProps = {
  name: string;
  namespace: string;
};

const NetworkPolicyPageNav: React.FC<NetworkPolicyPageNavProps> = ({ name, namespace }) => {
  const [networkPolicy, loaded] = useK8sWatchResource<IoK8sApiNetworkingV1NetworkPolicy>({
    groupVersionKind: modelToGroupVersionKind(NetworkPolicyModel),
    name,
    namespace,
  });
  const pages = useNetworkPolicyTabs();

  if (!loaded) {
    return <Loading />;
  }

  return (
    <>
      <NetworkPolicyPageTitle networkPolicy={networkPolicy} />
      <HorizontalNav pages={pages} resource={networkPolicy} />
    </>
  );
};

export default NetworkPolicyPageNav;
