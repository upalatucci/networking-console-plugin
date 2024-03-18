import React, { FC } from 'react';

import { modelToGroupVersionKind, ServiceModel } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import Loading from '@utils/components/Loading/Loading';

import ServicePageTitle from './components/ServiceDetailsPageTitle';
import { useServiceTabs } from './hooks/useServiceTabs';

export type ServicePageNavProps = {
  name: string;
  namespace: string;
};

const ServicePageNav: FC<ServicePageNavProps> = ({ name, namespace }) => {
  const [service, loaded] = useK8sWatchResource<IoK8sApiCoreV1Service>({
    groupVersionKind: modelToGroupVersionKind(ServiceModel),
    name,
    namespace,
  });
  const pages = useServiceTabs();

  if (!loaded) {
    return <Loading />;
  }

  return (
    <>
      <ServicePageTitle service={service} />
      <HorizontalNav pages={pages} resource={service} />
    </>
  );
};

export default ServicePageNav;
