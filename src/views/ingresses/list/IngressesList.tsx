import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import { IngressModel, modelToGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiNetworkingV1Ingress } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import {
  ListPageBody,
  ListPageCreateButton,
  ListPageFilter,
  ListPageHeader,
  useActiveNamespace,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { getResourceURL } from '@utils/resources/shared';
import { getValidNamespace } from '@utils/utils/utils';
import useIngressColumns from '@views/ingresses/list/hooks/useIngressColumns';

import IngressTableRow from './components/IngressTableRow';

type IngressesListProps = {
  kind: string;
  namespace: string;
};

const IngressesList: FC<IngressesListProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const [activeNamespace] = useActiveNamespace();
  const navigate = useNavigate();
  const validNamespace = getValidNamespace(namespace || activeNamespace);

  const [ingress, loaded, loadError] = useK8sWatchResource<IoK8sApiNetworkingV1Ingress[]>({
    groupVersionKind: modelToGroupVersionKind(IngressModel),
    isList: true,
    namespace: validNamespace,
  });
  const [data, filteredData, onFilterChange] = useListPageFilter(ingress);
  const columns = useIngressColumns();

  return (
    <>
      <ListPageHeader title={t('Ingresses')}>
        <ListPageCreateButton
          className="list-page-create-button-margin"
          createAccessReview={{
            groupVersionKind: modelToGroupVersionKind(IngressModel),
            namespace: validNamespace,
          }}
          onClick={() =>
            navigate(
              getResourceURL({
                activeNamespace: validNamespace,
                model: IngressModel,
                path: '~new',
              }),
            )
          }
        >
          {t('Create Ingress')}
        </ListPageCreateButton>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<IoK8sApiNetworkingV1Ingress>
          columns={columns}
          data={filteredData}
          loaded={loaded}
          loadError={loadError}
          Row={IngressTableRow}
          unfilteredData={data}
        />
      </ListPageBody>
    </>
  );
};

export default IngressesList;
