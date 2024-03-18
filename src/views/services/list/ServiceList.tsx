import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import {
  modelToGroupVersionKind,
  modelToRef,
  ServiceModel,
} from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import {
  ListPageBody,
  ListPageCreateButton,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import ServiceRow from './components/ServiceRow';
import useServiceColumn from './hooks/useServiceColumn';

type ServiceListProps = {
  kind: string;
  namespace: string;
};

const ServiceList: FC<ServiceListProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();

  const [service, loaded, loadError] = useK8sWatchResource<IoK8sApiCoreV1Service[]>({
    groupVersionKind: modelToGroupVersionKind(ServiceModel),
    isList: true,
    namespace,
  });
  const [data, filteredData, onFilterChange] = useListPageFilter(service);
  const columns = useServiceColumn();

  return (
    <>
      <ListPageHeader title={t('Services')}>
        <ListPageCreateButton
          className="list-page-create-button-margin"
          createAccessReview={{
            groupVersionKind: modelToGroupVersionKind(ServiceModel),
            namespace,
          }}
          onClick={() =>
            navigate(`/k8s/ns/${namespace || 'default'}/${modelToRef(ServiceModel)}/~new`)
          }
        >
          {t('Create Service')}
        </ListPageCreateButton>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<IoK8sApiCoreV1Service>
          columns={columns}
          data={filteredData}
          loaded={loaded}
          loadError={loadError}
          Row={ServiceRow}
          unfilteredData={data}
        />
      </ListPageBody>
    </>
  );
};

export default ServiceList;
