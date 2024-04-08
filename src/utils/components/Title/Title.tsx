import React, { FC } from 'react';

import { Title as PFTitle } from '@patternfly/react-core';

import './Title.scss';

type TitleProps = {
  titleText: string;
};

const Title: FC<TitleProps> = ({ titleText }) => {
  return (
    <PFTitle className="section-title" headingLevel="h2">
      {titleText}
    </PFTitle>
  );
};

export default Title;
