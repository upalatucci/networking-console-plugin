import React, { FC } from 'react';

import Title from '@utils/components/Title/Title';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { RouteKind } from '@utils/types';
import DetailsSectionLeftColumn from '@views/routes/details/components/tabs/detailsTab/components/RouteDetailsSection/DetailsSectionLeftColumn';
import DetailsSectionRightColumn from '@views/routes/details/components/tabs/detailsTab/components/RouteDetailsSection/DetailsSectionRightColumn';

type RouteDetailsSectionProps = {
  route: RouteKind;
};

const RouteDetailsSection: FC<RouteDetailsSectionProps> = ({ route }) => {
  const { t } = useNetworkingTranslation();

  return (
    <div className="co-m-pane__body">
      <Title titleText={t('Route details')} />
      <div className="row">
        <DetailsSectionLeftColumn route={route} />
        <DetailsSectionRightColumn route={route} />
      </div>
    </div>
  );
};

export default RouteDetailsSection;
