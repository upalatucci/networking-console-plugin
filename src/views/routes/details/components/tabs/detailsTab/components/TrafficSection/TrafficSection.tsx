import React, { FC } from 'react';

import { Title } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import TrafficSettings from '@views/routes/details/components/tabs/detailsTab/components/TrafficSection/TrafficSettings';
import { RouteKind } from '@views/routes/list/utils/types';

type TrafficSectionProps = {
  route: RouteKind;
};

const TrafficSection: FC<TrafficSectionProps> = ({ route }) => {
  const { t } = useNetworkingTranslation();

  return (
    <div className="co-m-pane__body">
      <Title headingLevel="h2">{t('Traffic')}</Title>
      <TrafficSettings route={route} />
    </div>
  );
};

export default TrafficSection;
