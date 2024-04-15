import React, { FC } from 'react';

import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

const RulesHeader: FC = ({}) => {
  const { t } = useNetworkingTranslation();

  return (
    <div className="row co-m-table-grid__head">
      <div className="col-xs-6 col-sm-4 col-md-2">{t('Host')}</div>
      <div className="col-xs-6 col-sm-4 col-md-2">{t('Path')}</div>
      <div className="col-md-3 hidden-sm hidden-xs">{t('Path type')}</div>
      <div className="col-sm-4 col-md-2 hidden-xs">{t('Service')}</div>
      <div className="col-md-2 hidden-sm hidden-xs">{t('Service port')}</div>
    </div>
  );
};

export default RulesHeader;
