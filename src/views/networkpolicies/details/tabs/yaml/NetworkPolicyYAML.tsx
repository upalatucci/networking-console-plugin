import React, { FC } from 'react';

import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import Loading from '@utils/components/Loading/Loading';

type NetworkPolicyYAMLPageProps = {
  obj?: IoK8sApiNetworkingV1NetworkPolicy;
};

const NetworkPolicyYAMLPage: FC<NetworkPolicyYAMLPageProps> = ({
  obj: networkPolicy,
}) => {
  return !networkPolicy ? (
    <Loading />
  ) : (
    <React.Suspense fallback={<Loading />}>
      <ResourceYAMLEditor initialResource={networkPolicy} />
    </React.Suspense>
  );
};

export default NetworkPolicyYAMLPage;
