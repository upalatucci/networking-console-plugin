import React, { FC } from 'react';

import { PageSection, Title } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { RouteKind } from '@utils/types';
import TrafficSettings from '@views/routes/details/components/tabs/detailsTab/components/TrafficSection/TrafficSettings';

type TrafficSectionProps = {
  route: RouteKind;
};

const TrafficSection: FC<TrafficSectionProps> = ({ route }) => {
  const { t } = useNetworkingTranslation();

  return (
    <PageSection>
      <Title headingLevel="h2">{t('Traffic')}</Title>
      <TrafficSettings route={route} />
    </PageSection>
  );
};

export default TrafficSection;
