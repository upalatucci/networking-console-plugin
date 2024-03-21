import NetworkAttachmentDefinitionModel from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { NET_ATTACH_DEF_HEADER_LABEL } from '@utils/constants';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { resourcePathFromModel } from '@utils/utils';
import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';

const NetworkAttachmentDefinitionFormTitle: FC = () => {
  const { t } = useNetworkingTranslation();
  return (
    <h1 className="co-m-pane__heading co-m-pane__heading--baseline">
      <div className="co-m-pane__name">{NET_ATTACH_DEF_HEADER_LABEL}</div>
      <div className="co-m-pane__heading-link">
        <Link
          id="yaml-link"
          replace
          to={`${resourcePathFromModel(NetworkAttachmentDefinitionModel)}/~new`}
        >
          {t('Edit YAML')}
        </Link>
      </div>
    </h1>
  );
};

export default NetworkAttachmentDefinitionFormTitle;
