import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import _ from 'lodash';

import {
  ListPageBody,
  ListPageCreateDropdown,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResources,
  useListPageFilter,
  useModal,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import ListEmptyState from '@utils/components/ListEmptyState/ListEmptyState';
import { DEFAULT_NAMESPACE } from '@utils/constants';
import { SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM } from '@utils/constants/ui';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import {
  ClusterUserDefinedNetworkModel,
  ClusterUserDefinedNetworkModelGroupVersionKind,
  UserDefinedNetworkModel,
  UserDefinedNetworkModelGroupVersionKind,
} from '@utils/models';
import { resourcePathFromModel } from '@utils/resources/shared';
import { ClusterUserDefinedNetworkKind, UserDefinedNetworkKind } from '@utils/resources/udns/types';

import UserDefinedNetworkCreateModal from './components/UserDefinedNetworkCreateModal';
import UserDefinedNetworkRow from './components/UserDefinedNetworkRow';
import useUDNColumns from './hooks/useUDNColumns';

type UserDefinedNetworksListProps = {
  namespace: string;
};

const UserDefinedNetworksList: FC<UserDefinedNetworksListProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();
  const createModal = useModal();
  const resources = useK8sWatchResources({
    ClusterUserDefinedNetwork: {
      groupVersionKind: ClusterUserDefinedNetworkModelGroupVersionKind,
      isList: true,
      namespaced: false,
    },
    UserDefinedNetwork: {
      groupVersionKind: UserDefinedNetworkModelGroupVersionKind,
      isList: true,
      namespace,
      namespaced: true,
    },
  });
  const loaded = Object.values(resources)
    .filter((r) => !r.loadError)
    .every((r) => r.loaded);
  const loadError = resources.UserDefinedNetwork.loadError;
  const flatten = _.flatMap(resources, (r) => {
    return r.data;
  });
  const [data, filteredData, onFilterChange] = useListPageFilter(flatten);
  const columns = useUDNColumns();
  const title = t('UserDefinedNetworks');

  return (
    <ListEmptyState<ClusterUserDefinedNetworkKind | UserDefinedNetworkKind>
      createButtonlink={SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM}
      data={data}
      error={loadError}
      kind={UserDefinedNetworkModel.kind}
      learnMoreLink="https://docs.openshift.com/container-platform/4.17/networking/multiple_networks/understanding-user-defined-network.html"
      loaded={loaded}
      onCreate={() => createModal(UserDefinedNetworkCreateModal, {})}
      title={title}
    >
      <ListPageHeader title={title}>
        <ListPageCreateDropdown
          createAccessReview={{
            groupVersionKind: UserDefinedNetworkModelGroupVersionKind,
            namespace,
          }}
          items={{
            ClusterUserDefinedNetwork: t('ClusterUserDefinedNetwork'),
            UserDefinedNetwork: t('UserDefinedNetwork'),
          }}
          // TODO: wait for inputs on how to manage cases here
          // onClick={() => createModal(UserDefinedNetworkCreateModal, {})}
          onClick={(item: string) => {
            if (item === 'ClusterUserDefinedNetwork') {
              navigate(
                `${resourcePathFromModel(
                  ClusterUserDefinedNetworkModel,
                )}/${SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM}`,
              );
            } else {
              navigate(
                `${resourcePathFromModel(
                  UserDefinedNetworkModel,
                  null,
                  namespace || DEFAULT_NAMESPACE,
                )}/${SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM}`,
              );
            }
          }}
        >
          {t('Create')}
        </ListPageCreateDropdown>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<ClusterUserDefinedNetworkKind | UserDefinedNetworkKind>
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
