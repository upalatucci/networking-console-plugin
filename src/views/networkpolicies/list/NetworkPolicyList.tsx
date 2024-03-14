import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import {
  modelToGroupVersionKind,
  modelToRef,
  NetworkPolicyModel,
} from '@kubevirt-ui/kubevirt-api/console';
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
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';

import NetworkPolicyRow from './components/NetworkPolicyRow';
import useNetworkPolicyColumn from './hooks/useNetworkPolicyColumn';

type NetworkPolicyListProps = {
  namespace: string;
};

const NetworkPolicyList: FC<NetworkPolicyListProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();

  const [nads, loaded, loadError] = useK8sWatchResource<NetworkPolicyKind[]>({
    groupVersionKind: modelToGroupVersionKind(NetworkPolicyModel),
    isList: true,
    namespace,
  });

  const [data, filteredData, onFilterChange] = useListPageFilter(nads);
  const columns = useNetworkPolicyColumn();

  return (
    <>
      <ListPageHeader title={t('NetworkPolicies')}>
        <ListPageCreateButton
          className="list-page-create-button-margin"
          createAccessReview={{
            groupVersionKind: modelToGroupVersionKind(NetworkPolicyModel),
            namespace,
          }}
          onClick={() =>
            navigate(
              `/k8s/ns/${namespace || 'default'}/${modelToRef(NetworkPolicyModel)}/~new/form`,
            )
          }
        >
          {t('Create NetworkPolicy')}
        </ListPageCreateButton>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<NetworkPolicyKind>
          columns={columns}
          data={filteredData}
          loaded={loaded}
          loadError={loadError}
          Row={NetworkPolicyRow}
          unfilteredData={data}
        />
      </ListPageBody>
    </>
  );
};

export default NetworkPolicyList;
