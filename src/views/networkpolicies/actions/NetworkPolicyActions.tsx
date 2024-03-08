import React, { FC } from 'react';

import useNetworkPolicyActions from './hooks/useNetworkPolicyActions';
import ActionsDropdown from '@utils/components/ActionsDropdown/ActionsDropdown';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';

type NetworkPolicyActionsProps = {
  obj: NetworkPolicyKind;
  isKebabToggle?: boolean;
};

const NetworkPolicyActions: FC<NetworkPolicyActionsProps> = ({
  obj,
  isKebabToggle,
}) => {
  const [actions] = useNetworkPolicyActions(obj);

  return (
    <ActionsDropdown
      actions={actions}
      id="virtual-machine-instance-migration-actions"
      isKebabToggle={isKebabToggle}
    />
  );
};

export default NetworkPolicyActions;
