import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { TableColumn, useActiveColumns } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { PaginationState } from '@utils/hooks/usePagination/utils/types';

type UseClusterPreferenceListColumnsValues = [
  columns: TableColumn<IoK8sApiNetworkingV1NetworkPolicy>[],
  activeColumns: TableColumn<IoK8sApiNetworkingV1NetworkPolicy>[],
];

type UseNetworkPolicyListColumns = (
  pagination: PaginationState,
  data: IoK8sApiNetworkingV1NetworkPolicy[],
) => UseClusterPreferenceListColumnsValues;

const useNetworkPolicyColumn: UseNetworkPolicyListColumns = () => {
  const { t } = useNetworkingTranslation();

  const columns: TableColumn<IoK8sApiNetworkingV1NetworkPolicy>[] = [
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
      id: 'pod-selector',
      props: { className: 'pf-m-hidden pf-m-visible-on-md' },
      sort: 'spec.podSelector',
      title: t('Pod selector'),
      transforms: [sortable],
    },
    {
      id: '',
      props: { className: 'dropdown-kebab-pf pf-v5-c-table__action' },
      title: '',
    },
  ];

  const [activeColumns] = useActiveColumns<IoK8sApiNetworkingV1NetworkPolicy>({
    columnManagementID: NetworkPolicyModel.kind,
    columns,
    showNamespaceOverride: false,
  });

  return [columns, activeColumns];
};

export default useNetworkPolicyColumn;
