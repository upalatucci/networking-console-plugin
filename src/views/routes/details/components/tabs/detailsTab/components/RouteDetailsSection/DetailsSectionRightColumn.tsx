import React, { FC } from 'react';

import { DetailsItem } from '@utils/components/DetailsItem/DetailsItem';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { RouteKind } from '@utils/types';
import CustomRouteHelp from '@views/routes/details/components/tabs/detailsTab/components/RouteDetailsSection/CustomRouteHelp';
import { IngressStatusProps } from '@views/routes/details/utils/types';
import { getIngressStatusForHost, showCustomRouteHelp } from '@views/routes/details/utils/utils';
import RouteLocation from '@views/routes/list/components/RouteLocation';
import RouteStatus from '@views/routes/list/components/RouteStatus';

type DetailsSectionRightColumnProps = {
  route: RouteKind;
};

const DetailsSectionRightColumn: FC<DetailsSectionRightColumnProps> = ({ route }) => {
  const { t } = useNetworkingTranslation();

  const primaryIngressStatus: IngressStatusProps = getIngressStatusForHost(
    route.spec.host,
    route.status.ingress,
  );

  return (
    <div className="col-sm-6">
      <dl className="co-m-pane__details">
        <dt>{t('Location')}</dt>
        <dd>
          <RouteLocation route={route} />
        </dd>
        <dt>{t('Status')}</dt>
        <dd>
          <RouteStatus route={route} />
        </dd>
        <DetailsItem label={t('Host')} obj={route} path="spec.host" />
        <DetailsItem label={t('Path')} obj={route} path="spec.path" />
        {primaryIngressStatus && (
          <DetailsItem
            label={t('Router canonical hostname')}
            obj={route}
            path="status.ingress.routerCanonicalHostname"
          >
            <div>{primaryIngressStatus.routerCanonicalHostname || '-'}</div>
            {showCustomRouteHelp(primaryIngressStatus, route.metadata.annotations) && (
              <CustomRouteHelp
                host={primaryIngressStatus.host}
                routerCanonicalHostname={primaryIngressStatus.routerCanonicalHostname}
              />
            )}
          </DetailsItem>
        )}
      </dl>
    </div>
  );
};

export default DetailsSectionRightColumn;
