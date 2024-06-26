import React, { FC } from 'react';

import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import Loading from '@utils/components/Loading/Loading';

type ServiceYAMLPageProps = {
  obj?: IoK8sApiCoreV1Service;
};

const ServiceYAMLPage: FC<ServiceYAMLPageProps> = ({ obj: service }) => {
  return !service ? (
    <Loading />
  ) : (
    <React.Suspense fallback={<Loading />}>
      <ResourceYAMLEditor initialResource={service} />
    </React.Suspense>
  );
};

export default ServiceYAMLPage;
