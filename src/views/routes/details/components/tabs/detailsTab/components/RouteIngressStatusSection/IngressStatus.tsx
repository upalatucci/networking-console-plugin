import React, { FC } from 'react';

import { DetailsItem } from '@utils/components/DetailsItem/DetailsItem';
import Title from '@utils/components/Title/Title';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import CustomRouteHelp from '@views/routes/details/components/tabs/detailsTab/components/RouteDetailsSection/CustomRouteHelp';
import Conditions from '@views/routes/details/components/tabs/detailsTab/components/RouteIngressStatusSection/Conditions';
import { showCustomRouteHelp } from '@views/routes/details/utils/utils';
import { RouteIngress, RouteKind } from '@views/routes/list/utils/types';

type IngressStatusProps = {
  ingress: RouteIngress;
  route: RouteKind;
};

const IngressStatus: FC<IngressStatusProps> = ({ ingress, route }) => {
  const { t } = useNetworkingTranslation();

  return (
    <div className="co-m-route-ingress-status" key={ingress?.routerName}>
      <Title
        titleText={`${t('Router: {{routerName}}', {
          routerName: ingress?.routerName,
        })}`}
      />
      <dl>
        <DetailsItem label={t('Host')} obj={route} path="status.ingress.host">
          {ingress?.host}
        </DetailsItem>
        <DetailsItem label={t('Wildcard policy')} obj={route} path="status.ingress.wildcardPolicy">
          {ingress?.wildcardPolicy}
        </DetailsItem>
        <DetailsItem
          label={t('Router canonical hostname')}
          obj={route}
          path="status.ingress.routerCanonicalHostname"
        >
          <div>{ingress?.routerCanonicalHostname || '-'}</div>
          {showCustomRouteHelp(ingress, route.metadata.annotations) && (
            <CustomRouteHelp
              host={ingress?.host}
              routerCanonicalHostname={ingress?.routerCanonicalHostname}
            />
          )}
        </DetailsItem>
      </dl>
      <h3 className="co-section-heading-secondary">{t('Conditions')}</h3>
      <Conditions conditions={ingress?.conditions} />
    </div>
  );
};

export default IngressStatus;
