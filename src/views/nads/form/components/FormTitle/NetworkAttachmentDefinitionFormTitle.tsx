import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import NetworkAttachmentDefinitionModel from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { Flex, FlexItem, Title } from '@patternfly/react-core';
import { NET_ATTACH_DEF_HEADER_LABEL } from '@utils/constants';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { resourcePathFromModel } from '@utils/utils';
import { SHARED_DEFAULT_PATH_NEW_RESOURCE_YAML } from '@utils/utils/paths';

type NetworkAttachmentDefinitionFormTitleProps = {
  namespace: string;
};

const NetworkAttachmentDefinitionFormTitle: FC<NetworkAttachmentDefinitionFormTitleProps> = ({
  namespace,
}) => {
  const { t } = useNetworkingTranslation();
  return (
    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
      <FlexItem>
        <Title headingLevel="h1">{NET_ATTACH_DEF_HEADER_LABEL}</Title>
      </FlexItem>
      <FlexItem>
        <Link
          id="yaml-link"
          replace
          to={`${resourcePathFromModel(NetworkAttachmentDefinitionModel, null, namespace)}/${SHARED_DEFAULT_PATH_NEW_RESOURCE_YAML}`}
        >
          {t('Edit YAML')}
        </Link>
      </FlexItem>
    </Flex>
  );
};

export default NetworkAttachmentDefinitionFormTitle;
