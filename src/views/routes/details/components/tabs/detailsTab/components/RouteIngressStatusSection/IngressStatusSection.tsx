import React, { FC } from 'react';

import { RouteIngress, RouteKind } from '@utils/types';
import IngressStatus from '@views/routes/details/components/tabs/detailsTab/components/RouteIngressStatusSection/IngressStatus';

type IngressStatusSectionProps = {
  route: RouteKind;
};

const IngressStatusSection: FC<IngressStatusSectionProps> = ({ route }) => {
  return (
    <div className="co-m-pane__body">
      {route?.status?.ingress.map((ingress: RouteIngress) => (
        <IngressStatus ingress={ingress} key={ingress.routerName} route={route} />
      ))}
    </div>
  );
};

export default IngressStatusSection;
