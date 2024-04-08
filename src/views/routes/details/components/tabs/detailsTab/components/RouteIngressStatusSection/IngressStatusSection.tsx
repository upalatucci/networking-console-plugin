import React, { FC } from 'react';
import * as _ from 'lodash';

import IngressStatus from '@views/routes/details/components/tabs/detailsTab/components/RouteIngressStatusSection/IngressStatus';
import { RouteIngress, RouteKind } from '@views/routes/list/utils/types';

type IngressStatusSectionProps = {
  route: RouteKind;
};

const IngressStatusSection: FC<IngressStatusSectionProps> = ({ route }) => {
  return (
    <div className="co-m-pane__body">
      {_.map(route?.status?.ingress, (ingress: RouteIngress) => (
        <IngressStatus ingress={ingress} route={route} />
      ))}
    </div>
  );
};

export default IngressStatusSection;
