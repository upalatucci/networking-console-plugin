import React, { FC } from 'react';

import { PageSection } from '@patternfly/react-core';
import Title from '@utils/components/Title/Title';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { RouteKind } from '@utils/types';
import TLSSettings from '@views/routes/details/components/tabs/detailsTab/components/TLSSettingsSection/TLSSettings';

type TLSSettingsSectionProps = {
  route: RouteKind;
};

const TLSSettingsSection: FC<TLSSettingsSectionProps> = ({ route }) => {
  const { t } = useNetworkingTranslation();

  return (
    <PageSection>
      <Title titleText={t('TLS Settings')} />
      <TLSSettings route={route} />
    </PageSection>
  );
};

export default TLSSettingsSection;
