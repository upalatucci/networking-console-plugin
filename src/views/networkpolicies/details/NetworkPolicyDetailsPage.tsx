import React, { FC } from 'react';

import { modelToGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import {
  HorizontalNav,
  K8sModel,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import Loading from '@utils/components/Loading/Loading';

import NetworkPolicyPageTitle from './components/NetworkPolicyDetailsPageTitle';
import { useNetworkPolicyTabs } from './hooks/useNetworkPolicyTabs';

export type NetworkPolicyPageNavProps = {
  kindObj: K8sModel;
  name: string;
  namespace: string;
};

const NetworkPolicyDetailsPage: FC<NetworkPolicyPageNavProps> = ({ kindObj, name, namespace }) => {
  const [networkPolicy, loaded] = useK8sWatchResource<IoK8sApiNetworkingV1NetworkPolicy>({
    groupVersionKind: modelToGroupVersionKind(kindObj),
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

export default NetworkPolicyDetailsPage;
