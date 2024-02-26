import React, { FC } from 'react';

import { PageSection, PageSectionVariants } from '@patternfly/react-core';

import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';

type NADDetailsPageProps = {
  nad: NetworkAttachmentDefinitionKind;
};

const NADDetailsPage: FC<NADDetailsPageProps> = () => {
  return (
    <div>
      <PageSection variant={PageSectionVariants.light}>text</PageSection>
    </div>
  );
};

export default NADDetailsPage;
