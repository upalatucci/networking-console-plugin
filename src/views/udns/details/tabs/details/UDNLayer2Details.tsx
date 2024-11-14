import React, { FC } from 'react';

import { DetailsItem } from '@utils/components/DetailsItem/DetailsItem';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { ClusterUserDefinedNetworkKind, UserDefinedNetworkKind } from '@utils/resources/udns/types';

type UDNLayer2DetailsProps = {
  emptyText: React.JSX.Element;
  joinSubnets: React.JSX.Element;
  obj: ClusterUserDefinedNetworkKind | UserDefinedNetworkKind;
  subnets: React.JSX.Element;
};

const UDNLayerDetails: FC<UDNLayer2DetailsProps> = ({ emptyText, joinSubnets, obj, subnets }) => {
  const { t } = useNetworkingTranslation();
  const layer2Path = obj.spec?.network ? 'spec.network.layer2' : 'spec.layer2';

  return (
    <>
      <DetailsItem
        defaultValue={emptyText}
        label={t('IPAMLifecycle')}
        obj={obj}
        path={`${layer2Path}.ipamLifecycle`}
      />
      <DetailsItem defaultValue={emptyText} label={t('MTU')} obj={obj} path={`${layer2Path}.mtu`} />
      <DetailsItem
        defaultValue={emptyText}
        label={t('Role')}
        obj={obj}
        path={`${layer2Path}.role`}
      />
      <DetailsItem
        defaultValue={emptyText}
        label={t('Subnets')}
        obj={obj}
        path={`${layer2Path}.subnets"`}
      >
        {subnets}
      </DetailsItem>
      <DetailsItem
        defaultValue={emptyText}
        label={t('JoinSubnets')}
        obj={obj}
        path={`${layer2Path}.joinSubnets`}
      >
        {joinSubnets}
      </DetailsItem>
    </>
  );
};

export default UDNLayerDetails;
