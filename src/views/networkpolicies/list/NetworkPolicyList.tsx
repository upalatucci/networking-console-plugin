import React, { FC } from 'react';

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
import useNetworkPolicyColumn from './hooks/useNetworkPolicyColumn';
import NetworkPolicyRow from './components/NetworkPolicyRow';
import { useHistory } from 'react-router';
import {
  modelToGroupVersionKind,
  modelToRef,
  NetworkPolicyModel,
} from '@kubevirt-ui/kubevirt-api/console';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';

type NetworkPolicyListProps = {
  kind: string;
  namespace: string;
};

const NetworkPolicyList: FC<NetworkPolicyListProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const history = useHistory();

  const [nads, loaded, loadError] = useK8sWatchResource<NetworkPolicyKind[]>({
    isList: true,
    groupVersionKind: modelToGroupVersionKind(NetworkPolicyModel),
    namespace,
  });
  const [data, filteredData, onFilterChange] = useListPageFilter(nads);
  const columns = useNetworkPolicyColumn();

  return (
    <>
      <ListPageHeader title={t('NetworkPolicies')}>
        <ListPageCreateButton
          createAccessReview={{
            groupVersionKind: modelToGroupVersionKind(NetworkPolicyModel),
            namespace,
          }}
          onClick={() =>
            history.push(
              `/k8s/ns/${namespace || 'default'}/${modelToRef(
                NetworkPolicyModel,
              )}/~new/form`,
            )
          }
          className="list-page-create-button-margin"
        >
          {t('Create NetworkPolicy')}
        </ListPageCreateButton>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          onFilterChange={onFilterChange}
        />
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
