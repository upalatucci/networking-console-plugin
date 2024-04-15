import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import { modelToGroupVersionKind, modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import {
  ListPageBody,
  ListPageCreateButton,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Pagination } from '@patternfly/react-core';
import ListEmptyState from '@utils/components/ListEmptyState/ListEmptyState';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import usePagination from '@utils/hooks/usePagination/usePagination';
import { paginationDefaultValues } from '@utils/hooks/usePagination/utils/constants';
import { MultiNetworkPolicyModel } from '@utils/models';
import { isEmpty } from '@utils/utils';
import { SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM } from '@utils/utils';

import NetworkPolicyEmptyState from './components/NetworkPolicyEmptyState';
import NetworkPolicyRow from './components/NetworkPolicyRow';
import useNetworkPolicyColumn from './hooks/useNetworkPolicyColumn';

import '@styles/list-management-group.scss';

type MultiNetworkPolicyListProps = {
  namespace: string;
};

const MultiNetworkPolicyList: FC<MultiNetworkPolicyListProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();

  const [multinetworkPolicies, loaded, loadError] = useK8sWatchResource<
    IoK8sApiNetworkingV1NetworkPolicy[]
  >({
    groupVersionKind: modelToGroupVersionKind(MultiNetworkPolicyModel),
    isList: true,
    namespace,
  });

  const { onPaginationChange, pagination } = usePagination();
  const [data, filteredData, onFilterChange] = useListPageFilter(multinetworkPolicies);
  const [columns, activeColumns] = useNetworkPolicyColumn(pagination, data);
  const title = t('MultiNetworkPolicies');

  return (
    <ListEmptyState<IoK8sApiNetworkingV1NetworkPolicy>
      createButtonlink={SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM}
      data={data}
      kind={MultiNetworkPolicyModel.kind}
      learnMoreLink="https://docs.openshift.com/dedicated/networking/network_policy/creating-network-policy.html"
      loaded={loaded}
      title={title}
    >
      <ListPageHeader title={title}>
        {!isEmpty(data.length) && (
          <ListPageCreateButton
            className="list-page-create-button-margin"
            createAccessReview={{
              groupVersionKind: modelToGroupVersionKind(MultiNetworkPolicyModel),
              namespace,
            }}
            onClick={() =>
              navigate(
                `/k8s/ns/${namespace || 'default'}/${modelToRef(MultiNetworkPolicyModel)}/${SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM}`,
              )
            }
          >
            {t('Create MultiNetworkPolicy')}
          </ListPageCreateButton>
        )}
      </ListPageHeader>
      <ListPageBody>
        <div className="list-management-group">
          <ListPageFilter
            columnLayout={{
              columns: columns?.map(({ additional, id, title: columnTitle }) => ({
                additional,
                id,
                title: columnTitle,
              })),
              id: MultiNetworkPolicyModel.kind,
              selectedColumns: new Set(activeColumns?.map((col) => col?.id)),
              type: '',
            }}
            data={data}
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
          {loaded && !isEmpty(data.length) && (
            <Pagination
              isLastFullPageShown
              itemCount={data.length}
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

export default MultiNetworkPolicyList;
