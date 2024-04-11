import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import { modelToRef, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateFooter,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { useLastNamespacePath } from '@utils/hooks/useLastNamespacePath';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { MultiNetworkPolicyModel } from '@utils/models';
import { isEmpty } from '@utils/utils';

const NetworkPolicyEmptyState: FC = () => {
  const { t } = useNetworkingTranslation();
  const lastNamespacePath = useLastNamespacePath();
  const location = useLocation();

  const networkModel = isEmpty(location.pathname.match(MultiNetworkPolicyModel.kind))
    ? NetworkPolicyModel
    : MultiNetworkPolicyModel;

  const navigate = useNavigate();

  return (
    <EmptyState>
      <EmptyStateHeader
        headingLevel="h4"
        titleText={t('No {{kind}} found', { kind: networkModel.kind })}
      />
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button
            onClick={() =>
              navigate(`/k8s/${lastNamespacePath}/${modelToRef(networkModel)}/~new/form`)
            }
          >
            {t('Create {{kind}}', { kind: networkModel.kind })}
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NetworkPolicyEmptyState;
