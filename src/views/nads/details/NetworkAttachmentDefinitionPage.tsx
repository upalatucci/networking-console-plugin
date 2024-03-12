import * as React from 'react';

import { NetworkAttachmentDefinitionModelGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';

import NetworkAttachmentDefinitionPageTitle from './components/NetworkAttachmentDefinitionPageTitle';
import { useNADTab } from './hooks/useNADTab';

export type NetworkAttachmentDefinitionPageNavProps = {
  name: string;
  namespace: string;
};

const NetworkAttachmentDefinitionPageNav: React.FC<NetworkAttachmentDefinitionPageNavProps> = ({
  name,
  namespace,
}) => {
  const [nad] = useK8sWatchResource<NetworkAttachmentDefinitionKind>({
    groupVersionKind: NetworkAttachmentDefinitionModelGroupVersionKind,
    name,
    namespace,
  });
  const pages = useNADTab();
  return (
    <>
      <NetworkAttachmentDefinitionPageTitle nad={nad} />
      <HorizontalNav pages={pages} resource={nad} />
    </>
  );
};

export default NetworkAttachmentDefinitionPageNav;
