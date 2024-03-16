import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { modelToRef, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import {
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Stack,
  Title,
} from '@patternfly/react-core';
import { useLastNamespacePath } from '@utils/hooks/useLastNamespacePath';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import NetworkPolicyActions from '@views/networkpolicies/actions/NetworkPolicyActions';

type NetworkAttachmentDefinitionPageTitleProps = {
  networkPolicy: IoK8sApiNetworkingV1NetworkPolicy;
};

const NetworkAttachmentDefinitionPageTitle: FC<NetworkAttachmentDefinitionPageTitleProps> = ({
  networkPolicy,
}) => {
  const { t } = useNetworkingTranslation();
  const namespacePath = useLastNamespacePath();

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to={`/k8s/${namespacePath}/${modelToRef(NetworkPolicyModel)}`}>
            {t('NetworkPolicy')}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{t('NetworkPolicy details')}</BreadcrumbItem>
      </Breadcrumb>
      <Stack hasGutter>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Title headingLevel="h1">{networkPolicy?.metadata?.name}</Title>
          </FlexItem>
          <FlexItem>
            <NetworkPolicyActions obj={networkPolicy} />
          </FlexItem>
        </Flex>
      </Stack>
    </PageSection>
  );
};

export default NetworkAttachmentDefinitionPageTitle;
