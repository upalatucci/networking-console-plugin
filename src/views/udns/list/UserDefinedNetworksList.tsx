import React, { FC } from 'react';

import {
  ListPageBody,
  ListPageCreateButton,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResource,
  useListPageFilter,
  useModal,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import ListEmptyState from '@utils/components/ListEmptyState/ListEmptyState';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { UserDefinedNetworkModel, UserDefinedNetworkModelGroupVersionKind } from '@utils/models';
import { UserDefinedNetworkKind } from '@utils/resources/udns/types';

import UserDefinedNetworkCreateModal from './components/UserDefinedNetworkCreateModal';
import UserDefinedNetworkRow from './components/UserDefinedNetworkRow';
import useUDNColumns from './hooks/useUDNColumns';

type UserDefinedNetworksListProps = {
  namespace: string;
};

const UserDefinedNetworksList: FC<UserDefinedNetworksListProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();

  const createModal = useModal();
  const [udns, loaded, loadError] = useK8sWatchResource<UserDefinedNetworkKind[]>({
    groupVersionKind: UserDefinedNetworkModelGroupVersionKind,
    isList: true,
    namespace,
  });

  const [data, filteredData, onFilterChange] = useListPageFilter(udns);
  const columns = useUDNColumns();
  const title = t('UserDefinedNetworks');

  return (
    <ListEmptyState<UserDefinedNetworkKind>
      data={data}
      error={loadError}
      kind={UserDefinedNetworkModel.kind}
      learnMoreLink="https://docs.openshift.com/container-platform/4.17/networking/multiple_networks/understanding-user-defined-network.html"
      loaded={loaded}
      onCreate={() => createModal(UserDefinedNetworkCreateModal, {})}
      title={title}
    >
      <ListPageHeader title={title}>
        <ListPageCreateButton
          className="list-page-create-button-margin"
          createAccessReview={{
            groupVersionKind: UserDefinedNetworkModelGroupVersionKind,
            namespace,
          }}
          onClick={() => createModal(UserDefinedNetworkCreateModal, {})}
        >
          {t('Create UserDefinedNetwork')}
        </ListPageCreateButton>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<UserDefinedNetworkKind>
          columns={columns}
          data={filteredData}
          loaded={loaded}
          loadError={loadError}
          Row={UserDefinedNetworkRow}
          unfilteredData={data}
        />
      </ListPageBody>
    </ListEmptyState>
  );
};

export default UserDefinedNetworksList;
