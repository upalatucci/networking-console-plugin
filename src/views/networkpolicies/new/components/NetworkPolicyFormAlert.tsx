import React, { FC } from 'react';

import { Alert, AlertVariant } from '@patternfly/react-core';

type NetworkPolicyFormAlertProps = {
  message: string;
  title: string;
};

const NetworkPolicyFormAlert: FC<NetworkPolicyFormAlertProps> = ({ message, title }) => {
  return (
    <div className="co-m-pane__body">
      <Alert title={title} variant={AlertVariant.danger}>
        {message}
      </Alert>
    </div>
  );
};

export default NetworkPolicyFormAlert;
