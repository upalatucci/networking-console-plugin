import React, { FC } from 'react';

import useNADsActions from './hooks/useNADsActions';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import ActionsDropdown from '@utils/components/ActionsDropdown/ActionsDropdown';

type NADsActionsProps = {
  obj: NetworkAttachmentDefinitionKind;
  isKebabToggle?: boolean;
};

const NADsActions: FC<NADsActionsProps> = ({ obj, isKebabToggle }) => {
  const [actions] = useNADsActions(obj);

  return (
    <ActionsDropdown
      actions={actions}
      id="virtual-machine-instance-migration-actions"
      isKebabToggle={isKebabToggle}
    />
  );
};

export default NADsActions;
