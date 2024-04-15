import React, { FC } from 'react';

import { IngressModel, modelToGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiNetworkingV1Ingress } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import Loading from '@utils/components/Loading/Loading';
import IngressDetailsPageTitle from '@views/ingresses/details/components/IngressDetailsPageTitle/IngressDetailsPageTitle';
import useIngressTabs from '@views/ingresses/details/hooks/useIngressTabs';

type IngressDetailsPageProps = {
  name: string;
  namespace: string;
};

const IngressDetailsPage: FC<IngressDetailsPageProps> = ({ name, namespace }) => {
  const [ingress, loaded] = useK8sWatchResource<IoK8sApiNetworkingV1Ingress>({
    groupVersionKind: modelToGroupVersionKind(IngressModel),
    name,
    namespace,
  });
  const pages = useIngressTabs();

  if (!loaded) {
    return <Loading />;
  }

  return (
    <>
      <IngressDetailsPageTitle ingress={ingress} />
      <HorizontalNav pages={pages} resource={ingress} />
    </>
  );
};

export default IngressDetailsPage;
