import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { NetworkAttachmentDefinitionModelRef } from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useLastNamespacePath } from '@utils/hooks/useLastNamespacePath';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import NADsActions from '@views/nads/actions/NADActions';

type NetworkAttachmentDefinitionPageTitleProps = {
  nad: NetworkAttachmentDefinitionKind;
};

const NetworkAttachmentDefinitionPageTitle: FC<NetworkAttachmentDefinitionPageTitleProps> = ({
  nad,
}) => {
  const { t } = useNetworkingTranslation();
  const namespacePath = useLastNamespacePath();

  return (
    <div className="co-m-nav-title co-m-nav-title--detail">
      <div>
        <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link to={`/k8s/${namespacePath}/${NetworkAttachmentDefinitionModelRef}`}>
              {t('NetworkAttachmentDefinitions')}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{t('NetworkAttachmentDefinition details')}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <span className="co-m-pane__heading">
        <h1 className="co-resource-item__resource-name">
          <span className="kv-resource-icon">{t('NAD')}</span>
          {nad?.metadata?.name}
        </h1>
        <NADsActions obj={nad} />
      </span>
    </div>
  );
};

export default NetworkAttachmentDefinitionPageTitle;
