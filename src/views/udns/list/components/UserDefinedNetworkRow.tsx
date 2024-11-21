import React, { FC } from 'react';

import { modelToGroupVersionKind, NamespaceModel } from '@kubevirt-ui/kubevirt-api/console';
import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import MutedText from '@utils/components/MutedText/MutedText';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { UserDefinedNetworkModelGroupVersionKind } from '@utils/models';
import { getName, getNamespace } from '@utils/resources/shared';
import { getTopology } from '@utils/resources/udns/selectors';
import { UserDefinedNetworkKind } from '@utils/resources/udns/types';
import UDNActions from '@views/udns/actions/UDNActions';

type UserDefinedNetworkRowType = RowProps<UserDefinedNetworkKind>;

const UserDefinedNetworkRow: FC<UserDefinedNetworkRowType> = ({ activeColumnIDs, obj }) => {
  const { t } = useNetworkingTranslation();
  const namespace = getNamespace(obj);
  const name = getName(obj);
  const topology = getTopology(obj);

  return (
    <>
      <TableData activeColumnIDs={activeColumnIDs} id="name">
        <ResourceLink
          groupVersionKind={UserDefinedNetworkModelGroupVersionKind}
          name={name}
          namespace={namespace}
        />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="namespace">
        <ResourceLink groupVersionKind={modelToGroupVersionKind(NamespaceModel)} name={namespace} />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="topology">
        {topology || <MutedText content={t('Not available')} />}
      </TableData>
      <TableData
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-v5-c-table__action"
        id=""
      >
        <UDNActions obj={obj} />
      </TableData>
    </>
  );
};
export default UserDefinedNetworkRow;
