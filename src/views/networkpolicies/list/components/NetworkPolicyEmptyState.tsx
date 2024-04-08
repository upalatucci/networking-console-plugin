import React, { FC } from 'react';
import { useLocation, useParams } from 'react-router-dom-v5-compat';

import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateFooter,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { MultiNetworkPolicyModel } from '@utils/models';
import { isEmpty } from '@utils/utils';

import NetworkPolicyCreateDropdown from './NetworkPolicyCreateDropdown/NetworkPolicyCreateDropdown';

const NetworkPolicyEmptyState: FC = () => {
  const { t } = useNetworkingTranslation();
  const location = useLocation();
  const { ns: namespace } = useParams();

  const networkModel = isEmpty(location.pathname.match(MultiNetworkPolicyModel.kind))
    ? NetworkPolicyModel
    : MultiNetworkPolicyModel;

  return (
    <EmptyState>
      <EmptyStateHeader
        headingLevel="h4"
        titleText={t('No {{kind}} found', { kind: networkModel.kind })}
      />
      <EmptyStateFooter>
        <EmptyStateActions>
          <NetworkPolicyCreateDropdown model={MultiNetworkPolicyModel} namespace={namespace} />
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NetworkPolicyEmptyState;
