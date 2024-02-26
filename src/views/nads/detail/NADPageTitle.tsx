import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

import NADActions from '../actions/NADActions';
import { NetworkAttachmentDefinitionModelRef } from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { DEFAULT_NAMESPACE } from '@utils/constants';
import { getName } from '@utils/resources/shared';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';

type NADPageTitleProps = {
  name: string;
  namespace: string;
  nad: NetworkAttachmentDefinitionKind;
};

const NADPageTitle: React.FC<NADPageTitleProps> = ({
  name,
  namespace,
  nad,
}) => {
  const { t } = useNetworkingTranslation();

  return (
    <>
      <div className="pf-c-page__main-breadcrumb">
        <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link
              to={`/k8s/ns/${
                namespace || DEFAULT_NAMESPACE
              }/${NetworkAttachmentDefinitionModelRef}`}
            >
              {t('NetworkAttachmentDefinitions')}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            {t('NetworkAttachmentDefinition Details')}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="co-m-nav-title co-m-nav-title--detail co-m-nav-title--breadcrumbs">
        <span className="co-m-pane__heading">
          <h1 className="co-m-pane__name co-resource-item">
            <span className="co-m-resource-icon co-m-resource-icon--lg">
              {t('DS')}
            </span>
            <span
              className="co-resource-item__resource-name"
              data-test-id="resource-title"
            >
              {name || getName(nad)}
            </span>
          </h1>
          <div className="co-actions">
            <NADActions obj={nad} />
          </div>
        </span>
      </div>
    </>
  );
};

export default NADPageTitle;
