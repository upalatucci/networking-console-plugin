import React, { FC } from 'react';

import { Title } from '@patternfly/react-core';
import DetailsPageTitle from '@utils/components/DetailsPageTitle/DetailsPageTitle';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { getName } from '@utils/resources/shared';
import { ClusterUserDefinedNetworkKind } from '@utils/resources/udns/types';
import UDNActions from '@views/udns/actions/UDNActions';

type VMNetworkTitleProps = {
  network: ClusterUserDefinedNetworkKind;
};

const VMNetworkTitle: FC<VMNetworkTitleProps> = ({ network }) => {
  const { t } = useNetworkingTranslation();

  return (
    <DetailsPageTitle
      breadcrumbs={[
        { name: t('VirtualMachine networks'), to: `/k8s/cluster/virtualmachine-networks` },
        { name: t('VirtualMachine network details') },
      ]}
    >
      <Title headingLevel="h1">{getName(network)}</Title>
      <UDNActions isKebabToggle={false} obj={network} />
    </DetailsPageTitle>
  );
};

export default VMNetworkTitle;
