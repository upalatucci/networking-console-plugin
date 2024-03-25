import React, { FC } from 'react';

import Title from '@utils/components/Title/Title';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import TLSSettings from '@views/routes/details/components/tabs/detailsTab/components/TLSSettingsSection/TLSSettings';
import { RouteKind } from '@views/routes/list/utils/types';

type TLSSettingsSectionProps = {
  route: RouteKind;
};

const TLSSettingsSection: FC<TLSSettingsSectionProps> = ({ route }) => {
  const { t } = useNetworkingTranslation();

  return (
    <div className="co-m-pane__body">
      <Title titleText={t('TLS Settings')} />
      <TLSSettings route={route} />
    </div>
  );
};

export default TLSSettingsSection;
