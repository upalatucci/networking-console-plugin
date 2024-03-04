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
import {
  NetworkAttachmentDefinitionModelGroupVersionKind,
  NetworkAttachmentDefinitionModelRef,
} from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import useNADsColumns from './hooks/useNADsColumns';
import NADsRow from './components/NADsRow';
import { useHistory } from 'react-router';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';

type NetworkAttachmentDefinitionListProps = {
  kind: string;
  namespace: string;
};

const NetworkAttachmentDefinitionList: FC<
  NetworkAttachmentDefinitionListProps
> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const history = useHistory();

  const [nads, loaded, loadError] = useK8sWatchResource<
    NetworkAttachmentDefinitionKind[]
  >({
    isList: true,
    groupVersionKind: NetworkAttachmentDefinitionModelGroupVersionKind,
    namespace,
  });
  const [data, filteredData, onFilterChange] = useListPageFilter(nads);
  const columns = useNADsColumns();

  return (
    <>
      <ListPageHeader title={t('NetworkAttachmentDefinition')}>
        <ListPageCreateButton
          createAccessReview={{
            groupVersionKind: NetworkAttachmentDefinitionModelGroupVersionKind,
            namespace,
          }}
          onClick={() =>
            history.push(
              `/k8s/ns/${
                namespace || 'default'
              }/${NetworkAttachmentDefinitionModelRef}/~new/form`,
            )
          }
          className="list-page-create-button-margin"
        >
          {t('Create NetworkAttachmentDefinition')}
        </ListPageCreateButton>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          onFilterChange={onFilterChange}
        />
        <VirtualizedTable<NetworkAttachmentDefinitionKind>
          columns={columns}
          data={filteredData}
          loaded={loaded}
          loadError={loadError}
          Row={NADsRow}
          unfilteredData={data}
        />
      </ListPageBody>
    </>
  );
};

export default NetworkAttachmentDefinitionList;
