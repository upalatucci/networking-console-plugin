import React, { FC } from 'react';

import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye } from '@patternfly/react-core';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import Loading from '@utils/components/Loading/Loading';

type NADYAMLPageProps = {
  obj?: NetworkAttachmentDefinitionKind;
};

const NADYAMLPage: FC<NADYAMLPageProps> = ({ obj: nad }) => {
  const loading = (
    <Bullseye>
      <Loading />
    </Bullseye>
  );
  return !nad ? (
    loading
  ) : (
    <React.Suspense fallback={loading}>
      <ResourceYAMLEditor initialResource={nad} />
    </React.Suspense>
  );
};

export default NADYAMLPage;
