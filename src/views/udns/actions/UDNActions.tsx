import React, { FC } from 'react';

import ActionsDropdown from '@utils/components/ActionsDropdown/ActionsDropdown';
import { ClusterUserDefinedNetworkKind, UserDefinedNetworkKind } from '@utils/resources/udns/types';

import useUDNActions from './hooks/useUDNActions';

type UDNActionsProps = {
  isKebabToggle?: boolean;
  obj: ClusterUserDefinedNetworkKind | UserDefinedNetworkKind;
};

const UDNActions: FC<UDNActionsProps> = ({ isKebabToggle = true, obj }) => {
  const [actions] = useUDNActions(obj);

  return (
    <ActionsDropdown
      actions={actions}
      id="user-defined-network-actions"
      isKebabToggle={isKebabToggle}
    />
  );
};

export default UDNActions;
