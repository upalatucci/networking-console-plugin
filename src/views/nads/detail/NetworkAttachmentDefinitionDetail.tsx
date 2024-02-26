import * as React from 'react';

import {
  HorizontalNav,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye } from '@patternfly/react-core';

import NADPageTitle from './NADPageTitle';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import Loading from '@utils/components/Loading/Loading';
import NADYAMLPage from './tabs/NADYAMLPage';
import NADDetailPage from './tabs/NADDetailPage';

type NADPageProps = {
  kind: string;
  name: string;
  namespace: string;
};

const NADNavPage: React.FC<NADPageProps> = ({ kind, name, namespace }) => {
  const { t } = useNetworkingTranslation();
  const [nad, loaded] = useK8sWatchResource<NetworkAttachmentDefinitionKind>({
    kind,
    name,
    namespace,
  });

  const pages = React.useMemo(
    () => [
      {
        component: NADDetailPage,
        href: '',
        name: t('Details'),
      },
      {
        component: NADYAMLPage,
        href: 'yaml',
        name: t('YAML'),
      },
    ],
    [t],
  );

  return (
    <>
      <NADPageTitle nad={nad} name={name} namespace={namespace} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={nad} />
      ) : (
        <Bullseye>
          <Loading />
        </Bullseye>
      )}
    </>
  );
};

export default NADNavPage;
