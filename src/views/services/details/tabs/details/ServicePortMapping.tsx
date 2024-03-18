import React from 'react';

import { ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

const ServicePortMapping = ({ ports }) => {
  const { t } = useNetworkingTranslation();
  return (
    <div>
      <div className="row co-ip-header">
        <div className="col-xs-3">{t('Name')}</div>
        <div className="col-xs-3">{t('Port')}</div>
        <div className="col-xs-3">{t('Protocol')}</div>
        <div className="col-xs-3">{t('Pod port or name')}</div>
      </div>
      <div className="rows">
        {ports.map((portObj, i) => {
          return (
            <div className="co-ip-row" key={i}>
              <div className="row">
                <div className="col-xs-3 co-text-service">
                  <p>{portObj.name || '-'}</p>
                  {portObj.nodePort && <p className="co-text-node">{t('Node port')}</p>}
                </div>
                <div className="col-xs-3 co-text-service">
                  <p>
                    <ResourceIcon kind="Service" />
                    <span>{portObj.port}</span>
                  </p>
                  {portObj.nodePort && (
                    <p className="co-text-node">
                      <ResourceIcon kind="Node" />
                      <span>{portObj.nodePort}</span>
                    </p>
                  )}
                </div>
                <div className="col-xs-3">
                  <p>{portObj.protocol}</p>
                </div>
                <div className="col-xs-3 co-text-pod">
                  <p>
                    <ResourceIcon kind="Pod" />
                    <span>{portObj.targetPort}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicePortMapping;
