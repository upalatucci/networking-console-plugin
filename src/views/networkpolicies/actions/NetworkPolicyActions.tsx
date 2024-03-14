import React, { FC } from 'react';

import ActionsDropdown from '@utils/components/ActionsDropdown/ActionsDropdown';

import useNetworkPolicyActions from './hooks/useNetworkPolicyActions';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';

type NetworkPolicyActionsProps = {
  isKebabToggle?: boolean;
  obj: IoK8sApiNetworkingV1NetworkPolicy;
};

const NetworkPolicyActions: FC<NetworkPolicyActionsProps> = ({ isKebabToggle, obj }) => {
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
