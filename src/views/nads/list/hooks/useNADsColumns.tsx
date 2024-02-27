import { useMemo } from 'react';

import {
  K8sResourceCommon,
  TableColumn,
  useActiveColumns,
} from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

const useNADsColumns = (): { id: string; title: string }[] => {
  const { t } = useNetworkingTranslation();

  const columns: TableColumn<K8sResourceCommon>[] = useMemo(
    () => [
      {
        id: 'name',
        sort: 'metadata.name',
        title: t('Name'),
        transforms: [sortable],
      },
      {
        id: 'namespace',
        sort: 'metadata.namespace',
        title: t('Namespace'),
        transforms: [sortable],
      },
      {
        id: 'type',
        title: t('Type'),
        transforms: [sortable],
      },
      {
        id: '',
        props: { className: 'dropdown-kebab-pf pf-c-table__action' },
        title: '',
      },
    ],
    [t],
  );

  const [activeColumns] = useActiveColumns<K8sResourceCommon>({
    columnManagementID: '',
    columns,
    showNamespaceOverride: false,
  });

  return activeColumns;
};

export default useNADsColumns;
