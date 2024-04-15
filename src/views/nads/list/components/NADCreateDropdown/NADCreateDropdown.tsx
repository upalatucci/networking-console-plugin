import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import { NetworkAttachmentDefinitionModelRef } from '@kubevirt-ui/kubevirt-api/console';
import NetworkAttachmentDefinitionModel from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { ListPageCreateDropdown } from '@openshift-console/dynamic-plugin-sdk';
import { DEFAULT_NAMESPACE } from '@utils/constants';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { resourcePathFromModel, SHARED_DEFAULT_PATH_NEW_RESOURCE_YAML } from '@utils/utils';

import { createItems } from './utils/constants';

type NADCreateDropdownProps = {
  namespace: string;
};

const NADCreateDropdown: FC<NADCreateDropdownProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();
  resourcePathFromModel;
  const onCreate = useCallback(
    (type: string) => {
      const baseURL = `${resourcePathFromModel(
        NetworkAttachmentDefinitionModel,
        null,
        namespace || DEFAULT_NAMESPACE,
      )}/${SHARED_DEFAULT_PATH_NEW_RESOURCE_YAML}`;

      if (type === 'form') return navigate(`${baseURL}/form`);

      return navigate(baseURL);
    },
    [namespace, navigate],
  );

  return (
    <ListPageCreateDropdown
      createAccessReview={{ groupVersionKind: NetworkAttachmentDefinitionModelRef, namespace }}
      items={createItems}
      onClick={onCreate}
    >
      {t('Create NetworkAttachmentDefinition')}
    </ListPageCreateDropdown>
  );
};

export default NADCreateDropdown;
