import React, { FC } from 'react';
import * as _ from 'lodash';

import NoRouteStatus from '@views/routes/details/components/tabs/detailsTab/components/NoRouteStatus';
import IngressStatusSection from '@views/routes/details/components/tabs/detailsTab/components/RouteIngressStatusSection/IngressStatusSection';
import TrafficSection from '@views/routes/details/components/tabs/detailsTab/components/TrafficSection/TrafficSection';
import { RouteKind } from '@views/routes/list/utils/types';

import RouteDetailsSection from './components/RouteDetailsSection/RouteDetailsSection';
import TLSSettingsSection from './components/TLSSettingsSection/TLSSettingsSection';

type RouteDetailsTabProps = {
  obj: RouteKind;
};

const RouteDetailsTab: FC<RouteDetailsTabProps> = ({ obj: route }) => (
  <>
    <RouteDetailsSection route={route} />
    <TLSSettingsSection route={route} />
    {!_.isEmpty(route?.spec?.alternateBackends) && <TrafficSection route={route} />}
    {_.isEmpty(route?.status?.ingress) ? <NoRouteStatus /> : <IngressStatusSection route={route} />}
  </>
);

export default RouteDetailsTab;
