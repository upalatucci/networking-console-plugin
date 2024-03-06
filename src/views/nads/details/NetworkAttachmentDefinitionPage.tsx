import * as React from 'react';

import {
  HorizontalNav,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';

import NetworkAttachmentDefinitionPageTitle from './components/NetworkAttachmentDefinitionPageTitle';
import { useNADTab } from './hooks/useNADTab';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import { NetworkAttachmentDefinitionModelGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';

export type NetworkAttachmentDefinitionPageNavProps = {
  name: string;
  namespace: string;
};

const NetworkAttachmentDefinitionPageNav: React.FC<
  NetworkAttachmentDefinitionPageNavProps
> = ({ name, namespace }) => {
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
