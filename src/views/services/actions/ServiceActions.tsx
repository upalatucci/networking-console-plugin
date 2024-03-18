import React, { FC } from 'react';

import ActionsDropdown from '@utils/components/ActionsDropdown/ActionsDropdown';

import useServiceActions from './hooks/useServiceActions';
import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';

type ServiceActionsProps = {
  isKebabToggle?: boolean;
  obj: IoK8sApiCoreV1Service;
};

const ServiceActions: FC<ServiceActionsProps> = ({ isKebabToggle, obj }) => {
  const [actions] = useServiceActions(obj);

  return (
    <ActionsDropdown
      actions={actions}
      id="virtual-machine-instance-migration-actions"
      isKebabToggle={isKebabToggle}
    />
  );
};

export default ServiceActions;
