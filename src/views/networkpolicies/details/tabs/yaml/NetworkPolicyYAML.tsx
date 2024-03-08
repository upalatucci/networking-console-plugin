import React, { FC } from 'react';

import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye } from '@patternfly/react-core';
import Loading from '@utils/components/Loading/Loading';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';

type NetworkPolicyYAMLPageProps = {
  obj?: NetworkPolicyKind;
};

const NetworkPolicyYAMLPage: FC<NetworkPolicyYAMLPageProps> = ({
  obj: networkPolicy,
}) => {
  const loading = (
    <Bullseye>
      <Loading />
    </Bullseye>
  );
  return !networkPolicy ? (
    loading
  ) : (
    <React.Suspense fallback={loading}>
      <ResourceYAMLEditor initialResource={networkPolicy} />
    </React.Suspense>
  );
};

export default NetworkPolicyYAMLPage;
