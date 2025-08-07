import React, { FC } from 'react';

import ActionsDropdown from '@utils/components/ActionsDropdown/ActionsDropdown';
import { ClusterUserDefinedNetworkKind } from '@utils/resources/udns/types';

import useVMNetworkActions from './hooks/useVMNetworkActions';

type VMNetworkActionProps = {
  isKebabToggle?: boolean;
  obj: ClusterUserDefinedNetworkKind;
};

const VMNetworkAction: FC<VMNetworkActionProps> = ({ isKebabToggle = true, obj }) => {
  const actions = useVMNetworkActions(obj);
  return (
    <ActionsDropdown actions={actions} id="vm-network-actions" isKebabToggle={isKebabToggle} />
  );
};

export default VMNetworkAction;
