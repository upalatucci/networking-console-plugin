import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import React from 'react';

export const IngressHeader = () => {
  const { t } = useNetworkingTranslation();
  return (
    <div className="row co-m-table-grid__head">
      <div className="col-xs-4">{t('Target pods')}</div>
      <div className="col-xs-5">{t('From')}</div>
      <div className="col-xs-3">{t('To ports')}</div>
    </div>
  );
};

export const EgressHeader = () => {
  const { t } = useNetworkingTranslation();
  return (
    <div className="row co-m-table-grid__head">
      <div className="col-xs-4">{t('From pods')}</div>
      <div className="col-xs-5">{t('To')}</div>
      <div className="col-xs-3">{t('To ports')}</div>
    </div>
  );
};
