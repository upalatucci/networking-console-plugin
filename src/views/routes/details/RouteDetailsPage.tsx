import React, { FC } from 'react';

import { modelToGroupVersionKind, RouteModel } from '@kubevirt-ui/kubevirt-api/console';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import Loading from '@utils/components/Loading/Loading';
import RouteDetailsPageTitle from '@views/routes/details/components/RouteDetailsPageTitle/RouteDetailsPageTitle';
import useRouteTabs from '@views/routes/details/hooks/useRouteTabs';
import { RouteKind } from '@views/routes/list/utils/types';

type RouteDetailsPageProps = {
  name: string;
  namespace: string;
};

const RouteDetailsPage: FC<RouteDetailsPageProps> = ({ name, namespace }) => {
  const [route, loaded] = useK8sWatchResource<RouteKind>({
    groupVersionKind: modelToGroupVersionKind(RouteModel),
    name,
    namespace: namespace,
  });

  const pages = useRouteTabs();

  if (!loaded) {
    return <Loading />;
  }

  return (
    <>
      <RouteDetailsPageTitle route={route} />
      <HorizontalNav pages={pages} resource={route} />
    </>
  );
};

export default RouteDetailsPage;
