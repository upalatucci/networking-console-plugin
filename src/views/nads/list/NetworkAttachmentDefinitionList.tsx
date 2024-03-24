import React, { FC } from 'react';

import { NetworkAttachmentDefinitionModelGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import {
  ListPageBody,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import { isEmpty } from '@utils/utils/utils';

import NADCreateDropdown from './components/NADCreateDropdown';
import NADListEmpty from './components/NADListEmpty';
import NADsRow from './components/NADsRow';
import useNADsColumns from './hooks/useNADsColumns';

type NetworkAttachmentDefinitionListProps = {
  namespace: string;
};

const NetworkAttachmentDefinitionList: FC<NetworkAttachmentDefinitionListProps> = ({
  namespace,
}) => {
  const { t } = useNetworkingTranslation();

  const [nads, loaded, loadError] = useK8sWatchResource<NetworkAttachmentDefinitionKind[]>({
    groupVersionKind: NetworkAttachmentDefinitionModelGroupVersionKind,
    isList: true,
    namespace,
  });
  const [data, filteredData, onFilterChange] = useListPageFilter(nads);
  const columns = useNADsColumns();

  return (
    <>
      <ListPageHeader title={t('NetworkAttachmentDefinitions')}>
        {!isEmpty(nads) && <NADCreateDropdown namespace={namespace} />}
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<NetworkAttachmentDefinitionKind>
          columns={columns}
          data={filteredData}
          EmptyMsg={() => <NADListEmpty namespace={namespace} />}
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
