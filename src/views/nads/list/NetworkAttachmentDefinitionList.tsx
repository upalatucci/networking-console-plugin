import React, { FC } from 'react';

import NetworkAttachmentDefinitionModel, {
  NetworkAttachmentDefinitionModelGroupVersionKind,
} from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import {
  ListPageBody,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import ListEmptyState from '@utils/components/ListEmptyState/ListEmptyState';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import { SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM } from '@utils/utils';
import { isEmpty } from '@utils/utils/utils';

import NADCreateDropdown from './components/NADCreateDropdown/NADCreateDropdown';
import NADListEmpty from './components/NADListEmpty/NADListEmpty';
import NADsRow from './components/NADsRow/NADsRow';
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
  const title = t('NetworkAttachmentDefinitions');
  return (
    <ListEmptyState<NetworkAttachmentDefinitionKind>
      createButtonlink={SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM}
      data={data}
      kind={NetworkAttachmentDefinitionModel.kind}
      learnMoreLink="https://docs.openshift.com/dedicated/virt/vm_networking/virt-connecting-vm-to-ovn-secondary-network.html#virt-connecting-vm-to-ovn-secondary-network"
      loaded={loaded}
      title={title}
    >
      <ListPageHeader title={title}>
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
    </ListEmptyState>
  );
};

export default NetworkAttachmentDefinitionList;
