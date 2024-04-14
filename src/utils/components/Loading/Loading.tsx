import React, { FC } from 'react';

import { Bullseye } from '@patternfly/react-core';

import './loading.scss';

const Loading: FC = () => (
  <div className="Loading--main">
    <Bullseye>
      <div className="co-m-loader co-an-fade-in-out" data-test="loading-indicator">
        <div className="co-m-loader-dot__one" />
        <div className="co-m-loader-dot__two" />
        <div className="co-m-loader-dot__three" />
      </div>
    </Bullseye>
  </div>
);

export default Loading;
