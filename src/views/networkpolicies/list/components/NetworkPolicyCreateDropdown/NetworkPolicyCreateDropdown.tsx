import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import { modelToRef, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { K8sModel, ListPageCreateDropdown } from '@openshift-console/dynamic-plugin-sdk';
import { DEFAULT_NAMESPACE } from '@utils/constants';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import { createItems } from './utils/constants';

type NetworkPolicyCreateDropdownProps = {
  model?: K8sModel;
  namespace: string;
};

const NetworkPolicyCreateDropdown: FC<NetworkPolicyCreateDropdownProps> = ({
  model = NetworkPolicyModel,
  namespace,
}) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();

  const networkModelRef = modelToRef(model);

  const onCreate = useCallback(
    (type: string) => {
      const baseURL = `/k8s/ns/${namespace || DEFAULT_NAMESPACE}/${networkModelRef}/~new`;

      if (type === 'form') return navigate(`${baseURL}/form`);

      return navigate(baseURL);
    },
    [networkModelRef, namespace, navigate],
  );

  return (
    <ListPageCreateDropdown
      createAccessReview={{ groupVersionKind: networkModelRef, namespace }}
      items={createItems}
      onClick={onCreate}
    >
      {t('Create {{label}}', { label: model.label })}
    </ListPageCreateDropdown>
  );
};

export default NetworkPolicyCreateDropdown;
