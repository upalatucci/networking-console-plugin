import React, { FC, Suspense } from 'react';

import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import Loading from '@utils/components/Loading/Loading';
import { ClusterUserDefinedNetworkKind } from '@utils/resources/udns/types';

type NetworkYAMLPageProps = {
  obj: ClusterUserDefinedNetworkKind;
};

const NetworkYAMLPage: FC<NetworkYAMLPageProps> = ({ obj }) => {
  return !obj ? (
    <Loading />
  ) : (
    <Suspense fallback={<Loading />}>
      <ResourceYAMLEditor initialResource={obj} />
    </Suspense>
  );
};

export default NetworkYAMLPage;
