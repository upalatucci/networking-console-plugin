import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { modelToRef, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useLastNamespacePath } from '@utils/hooks/useLastNamespacePath';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import NetworkPolicyActions from '@views/networkpolicies/actions/NetworkPolicyActions';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';

type NetworkAttachmentDefinitionPageTitleProps = {
  networkPolicy: IoK8sApiNetworkingV1NetworkPolicy;
};

const NetworkAttachmentDefinitionPageTitle: FC<NetworkAttachmentDefinitionPageTitleProps> = ({
  networkPolicy,
}) => {
  const { t } = useNetworkingTranslation();
  const namespacePath = useLastNamespacePath();

  return (
    <div className="co-m-nav-title co-m-nav-title--detail">
      <div>
        <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link to={`/k8s/${namespacePath}/${modelToRef(NetworkPolicyModel)}`}>
              {t('NetworkAttachmentDefinitions')}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{t('NetworkAttachmentDefinition details')}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <span className="co-m-pane__heading">
        <h1 className="co-resource-item__resource-name">
          <span className="kv-resource-icon">{t('NAD')}</span>
          {networkPolicy?.metadata?.name}
        </h1>
        <NetworkPolicyActions obj={networkPolicy} />
      </span>
    </div>
  );
};

export default NetworkAttachmentDefinitionPageTitle;
