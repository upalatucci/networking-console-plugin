import React, { FC } from 'react';

import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye } from '@patternfly/react-core';

import Loading from '@utils/components/Loading/Loading';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';

type NADYAMLPageProps = {
  obj: NetworkAttachmentDefinitionKind;
};

const NADYAMLPage: FC<NADYAMLPageProps> = ({ obj }) => {
  const loading = (
    <Bullseye>
      <Loading />
    </Bullseye>
  );
  return !obj ? (
    loading
  ) : (
    <React.Suspense fallback={loading}>
      <ResourceYAMLEditor initialResource={obj} />
    </React.Suspense>
  );
};

export default NADYAMLPage;
