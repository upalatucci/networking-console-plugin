import React, { FC } from 'react';

import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import MutedText from '@utils/components/MutedText/MutedText';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

const ServiceAddress: FC<{ service: IoK8sApiCoreV1Service }> = ({ service }) => {
  const { t } = useNetworkingTranslation();
  const ServiceIPsRow = (name, desc, ips, note = null) => (
    <div className="co-ip-row">
      <div className="row">
        <div className="col-xs-6">
          <p className="ip-name">{name}</p>
          <p className="ip-desc">{desc}</p>
        </div>
        <div className="col-xs-6">
          {note && <MutedText content={note} isSpan />}
          {ips.join(', ')}
        </div>
      </div>
    </div>
  );

  const ServiceType = (type) => {
    switch (type) {
      case 'NodePort':
        return ServiceIPsRow(
          t('Node port'),
          t('Accessible outside the cluster'),
          service?.spec?.ports?.map((port) => port.nodePort),
          t('(all nodes): '),
        );
      case 'LoadBalancer':
        return ServiceIPsRow(
          t('External load balancer'),
          t('Ingress points of load balancer'),
          service?.status?.loadBalancer?.ingress?.map((i) => i.hostname || i.ip || '-'),
        );
      case 'ExternalName':
        return ServiceIPsRow(
          t('External service name'),
          t('Location of the resource that backs the service'),
          [service?.spec?.externalName],
        );
      default:
        return ServiceIPsRow(t('Cluster IP'), t('Accessible within the cluster only'), [
          service?.spec?.clusterIP,
        ]);
    }
  };

  return (
    <div>
      <div className="row co-ip-header">
        <div className="col-xs-6">{t('Type')}</div>
        <div className="col-xs-6">{t('Location')}</div>
      </div>
      <div className="rows">
        {ServiceType(service.spec.type)}
        {service.spec.externalIPs &&
          ServiceIPsRow(
            t('External IP'),
            t('IP Addresses accepting traffic for service'),
            service?.spec?.externalIPs,
          )}
      </div>
    </div>
  );
};

export default ServiceAddress;
