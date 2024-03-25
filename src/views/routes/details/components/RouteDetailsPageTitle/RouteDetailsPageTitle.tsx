import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { modelToRef, RouteModel } from '@kubevirt-ui/kubevirt-api/console';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useLastNamespacePath } from '@utils/hooks/useLastNamespacePath';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { getName } from '@utils/resources/shared';
import RouteActions from '@views/routes/actions/RouteActions';
import { RouteKind } from '@views/routes/list/utils/types';

import './RouteDetailsPageTitle.scss';

type RouteDetailsPageTitleProps = {
  route: RouteKind;
};

const RouteDetailsPageTitle: FC<RouteDetailsPageTitleProps> = ({ route }) => {
  const { t } = useNetworkingTranslation();
  const namespacePath = useLastNamespacePath();

  return (
    <div className="co-m-nav-title co-m-nav-title--detail">
      <div className="route-details-breadcrumbs">
        <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link to={`/k8s/${namespacePath}/${modelToRef(RouteModel)}`}>{t('Routes')}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{t('Route details')}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <span className="co-m-pane__heading">
        <h1 className="co-resource-item__resource-name">
          <span
            className="co-m-resource-icon co-m-resource-service co-m-resource-icon--lg"
            title="Route"
          >
            {t('RT')}
          </span>
          {getName(route)}
        </h1>
        <RouteActions route={route} />
      </span>
    </div>
  );
};

export default RouteDetailsPageTitle;
