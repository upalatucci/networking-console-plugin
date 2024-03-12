import React, { FC } from 'react';

import NetworkAttachmentDefinitionModel from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import {
  getGroupVersionKindForModel,
  ResourceLink,
  RowProps,
  TableData,
} from '@openshift-console/dynamic-plugin-sdk';
import { getConfigAsJSON, getType } from '@utils/resources/nads/selectors';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import { getName, getNamespace } from '@utils/resources/shared';
import NADsActions from '@views/nads/actions/NADActions';

type NADsRowType = RowProps<NetworkAttachmentDefinitionKind>;

const NADsRow: FC<NADsRowType> = ({ activeColumnIDs, obj }) => {
  const namespace = getNamespace(obj);
  const name = getName(obj);

  const configJSON = getConfigAsJSON(obj);
  const type = getType(configJSON);

  return (
    <>
      <TableData activeColumnIDs={activeColumnIDs} id="name">
        <ResourceLink
          groupVersionKind={getGroupVersionKindForModel(NetworkAttachmentDefinitionModel)}
          name={name}
          namespace={namespace}
        />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="namespace">
        <ResourceLink kind="Namespace" name={namespace} />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="type">
        {type || <span className="text-secondary">Not available</span>}
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="">
        <NADsActions isKebabToggle obj={obj} />
      </TableData>
    </>
  );
};
export default NADsRow;
