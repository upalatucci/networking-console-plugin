import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import { modelToGroupVersionKind, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import {
  ListPageBody,
  ListPageCreateButton,
  ListPageFilter,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Pagination } from '@patternfly/react-core';
import ListEmptyState from '@utils/components/ListEmptyState/ListEmptyState';
import { DEFAULT_NAMESPACE } from '@utils/constants';
import { SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM } from '@utils/constants/ui';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import usePagination from '@utils/hooks/usePagination/usePagination';
import { paginationDefaultValues } from '@utils/hooks/usePagination/utils/constants';
import { resourcePathFromModel } from '@utils/resources/shared';
import { isEmpty } from '@utils/utils';

import NetworkPolicyEmptyState from './components/NetworkPolicyEmptyState';
import NetworkPolicyRow from './components/NetworkPolicyRow';
import useNetworkPolicyColumn from './hooks/useNetworkPolicyColumn';

import '@styles/list-management-group.scss';

type NetworkPolicyListProps = {
  namespace: string;
};

const NetworkPolicyList: FC<NetworkPolicyListProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();

  const [networkPolicies, loaded, loadError] = useK8sWatchResource<
    IoK8sApiNetworkingV1NetworkPolicy[]
  >({
    groupVersionKind: modelToGroupVersionKind(NetworkPolicyModel),
    isList: true,
    namespace,
  });

  const { onPaginationChange, pagination } = usePagination();
  const [data, filteredData, onFilterChange] = useListPageFilter(networkPolicies);
  const [columns, activeColumns] = useNetworkPolicyColumn(pagination, filteredData);

  return (
    <ListEmptyState<IoK8sApiNetworkingV1NetworkPolicy>
      createButtonlink={SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM}
      data={data}
      error={loadError}
      kind={NetworkPolicyModel.kind}
      learnMoreLink="https://kubernetes.io/docs/concepts/services-networking/network-policies/"
      loaded={loaded}
    >
      {!isEmpty(data.length) && (
        <ListPageCreateButton
          className="list-page-create-button-margin"
          createAccessReview={{
            groupVersionKind: modelToGroupVersionKind(NetworkPolicyModel),
            namespace,
          }}
          onClick={() =>
            navigate(
              `${resourcePathFromModel(
                NetworkPolicyModel,
                null,
                namespace || DEFAULT_NAMESPACE,
              )}/${SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM}`,
            )
          }
        >
          {t('Create NetworkPolicy')}
        </ListPageCreateButton>
      )}
      <ListPageBody>
        <div className="list-management-group">
          <ListPageFilter
            columnLayout={{
              columns: columns?.map(({ additional, id, title: columnTitle }) => ({
                additional,
                id,
                title: columnTitle,
              })),
              id: NetworkPolicyModel.kind,
              selectedColumns: new Set(activeColumns?.map((col) => col?.id)),
              type: '',
            }}
            data={data}
            hideLabelFilter
            loaded={loaded}
            onFilterChange={(...args) => {
              onFilterChange(...args);
              onPaginationChange({
                endIndex: pagination?.perPage,
                page: 1,
                perPage: pagination?.perPage,
                startIndex: 0,
              });
            }}
          />
          {loaded && !isEmpty(filteredData) && (
            <Pagination
              isLastFullPageShown
              itemCount={filteredData.length}
              onPerPageSelect={(_e, perPage, page, startIndex, endIndex) =>
                onPaginationChange({ endIndex, page, perPage, startIndex })
              }
              onSetPage={(_e, page, perPage, startIndex, endIndex) =>
                onPaginationChange({ endIndex, page, perPage, startIndex })
              }
              page={pagination?.page}
              perPage={pagination?.perPage}
              perPageOptions={paginationDefaultValues}
            />
          )}
        </div>
        <VirtualizedTable<IoK8sApiNetworkingV1NetworkPolicy>
          columns={activeColumns}
          data={filteredData}
          loaded={loaded}
          loadError={loadError}
          NoDataEmptyMsg={NetworkPolicyEmptyState}
          Row={NetworkPolicyRow}
          unfilteredData={data}
        />
      </ListPageBody>
    </ListEmptyState>
  );
};

export default NetworkPolicyList;
