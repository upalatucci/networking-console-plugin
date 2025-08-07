import React, { FC } from 'react';

import { Title } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

const BridgeMappingPopover: FC = () => {
  const { t } = useNetworkingTranslation();
  return (
    <div>
      <Title headingLevel="h2">{t('Bridge mapping')}</Title>
      <p>{t('The network connects to a physical network through an Open vSwitch bridge.')}</p>
    </div>
  );
};

export default BridgeMappingPopover;
