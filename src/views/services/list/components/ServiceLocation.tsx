import React, { FC } from 'react';
import * as _ from 'lodash';

import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

type ServiceLocationProps = {
  s: IoK8sApiCoreV1Service;
};

const ServiceLocation: FC<ServiceLocationProps> = ({ s }) => {
  const { t } = useNetworkingTranslation();

  switch (s.spec.type) {
    case 'NodePort': {
      const clusterIP = s.spec.clusterIP ? `${s.spec.clusterIP}:` : '';
      return (
        <>
          {_.map(s.spec.ports, (portObj, i) => {
            return (
              <div className="co-truncate co-select-to-copy" key={i}>
                {clusterIP}
                {portObj.nodePort}
              </div>
            );
          })}
        </>
      );
    }

    case 'LoadBalancer': {
      if (!s.status?.loadBalancer?.ingress?.length) {
        return <div className="co-truncate">{t('Pending')}</div>;
      }
      return (
        <>
          {_.map(s.status.loadBalancer.ingress, (ingress, i) => {
            return (
              <div className="co-truncate co-select-to-copy" key={i}>
                {ingress.hostname || ingress.ip || '-'}
              </div>
            );
          })}
        </>
      );
    }

    case 'ExternalName': {
      return (
        <>
          {_.map(s.spec.ports, (portObj, i) => {
            const externalName = s.spec.externalName ? `${s.spec.externalName}:` : '';
            return (
              <div className="co-truncate co-select-to-copy" key={i}>
                {externalName}
                {portObj.port}
              </div>
            );
          })}
        </>
      );
    }

    default: {
      if (s.spec.clusterIP === 'None') {
        return <div className="co-truncate">{t('None')}</div>;
      }
      return (
        <>
          {_.map(s.spec.ports, (portObj, i) => {
            const clusterIP = s.spec.clusterIP ? `${s.spec.clusterIP}:` : '';
            return (
              <div className="co-truncate co-select-to-copy" key={i}>
                {clusterIP}
                {portObj.port}
              </div>
            );
          })}
        </>
      );
    }
  }
};

export default ServiceLocation;
