import React, { FC } from 'react';
import { useHistory } from 'react-router';

import {
  NetworkAttachmentDefinitionModelGroupVersionKind,
  NetworkAttachmentDefinitionModelRef,
} from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
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
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';

import NADsRow from './components/NADsRow';
import useNADsColumns from './hooks/useNADsColumns';

type NetworkAttachmentDefinitionListProps = {
  kind: string;
  namespace: string;
};

const NetworkAttachmentDefinitionList: FC<NetworkAttachmentDefinitionListProps> = ({
  namespace,
}) => {
  const { t } = useNetworkingTranslation();
  const history = useHistory();

  const [nads, loaded, loadError] = useK8sWatchResource<NetworkAttachmentDefinitionKind[]>({
    groupVersionKind: NetworkAttachmentDefinitionModelGroupVersionKind,
    isList: true,
    namespace,
  });
  const [data, filteredData, onFilterChange] = useListPageFilter(nads);
  const columns = useNADsColumns();

  return (
    <>
      <ListPageHeader title={t('NetworkAttachmentDefinition')}>
        <ListPageCreateButton
          className="list-page-create-button-margin"
          createAccessReview={{
            groupVersionKind: NetworkAttachmentDefinitionModelGroupVersionKind,
            namespace,
          }}
          onClick={() =>
            history.push(
              `/k8s/ns/${namespace || 'default'}/${NetworkAttachmentDefinitionModelRef}/~new/form`,
            )
          }
        >
          {t('Create NetworkAttachmentDefinition')}
        </ListPageCreateButton>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
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
