import { useMemo } from 'react';

import { TableColumn, useActiveColumns } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { RouteKind } from '@views/routes/list/utils/types';

export const tableColumnClasses = [
  'pf-v5-u-w-25-on-xl',
  'pf-m-hidden pf-m-visible-on-md',
  'pf-m-hidden pf-m-visible-on-lg',
  'pf-m-hidden pf-m-visible-on-xl',
  'pf-m-hidden pf-m-visible-on-xl',
  '',
];

type UseRouteColumns = () => { id: string; title: string }[];

const useRouteColumns: UseRouteColumns = () => {
  const { t } = useNetworkingTranslation();

  const columns: TableColumn<RouteKind>[] = useMemo(
    () => [
      {
        id: 'name',
        props: { className: tableColumnClasses[0] },
        sortField: 'metadata.name',
        title: t('Name'),
        transforms: [sortable],
      },
      {
        id: 'namespace',
        props: { className: tableColumnClasses[1] },
        sortField: 'metadata.namespace',
        title: t('Namespace'),
        transforms: [sortable],
      },
      {
        id: 'status',
        props: { className: tableColumnClasses[2] },
        title: t('Status'),
      },
      {
        id: 'location',
        props: { className: tableColumnClasses[3] },
        sortField: 'spec.host',
        title: t('Location'),
        transforms: [sortable],
      },
      {
        id: 'service',
        props: { className: tableColumnClasses[4] },
        sortField: 'spec.to.name',
        title: t('Service'),
        transforms: [sortable],
      },
      {
        id: '',
        props: { className: tableColumnClasses[5] },
        title: '',
      },
    ],
    [t],
  );

  const [activeColumns] = useActiveColumns<RouteKind>({
    columnManagementID: '',
    columns,
    showNamespaceOverride: false,
  });

  return activeColumns;
};

export default useRouteColumns;
