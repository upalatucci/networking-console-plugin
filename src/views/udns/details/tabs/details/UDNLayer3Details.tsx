import React, { FC } from 'react';

import { DetailsItem } from '@utils/components/DetailsItem/DetailsItem';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { UserDefinedNetworkKind } from '@utils/resources/udns/types';

type UDNLayer3DetailsProps = {
  emptyText: React.JSX.Element;
  joinSubnets: React.JSX.Element;
  subnets: React.JSX.Element;
  udn: UserDefinedNetworkKind;
};

const UDNLayer3Details: FC<UDNLayer3DetailsProps> = ({ emptyText, joinSubnets, subnets, udn }) => {
  const { t } = useNetworkingTranslation();

  return (
    <>
      <DetailsItem defaultValue={emptyText} label={t('MTU')} obj={udn} path="spec.layer3.mtu" />
      <DetailsItem defaultValue={emptyText} label={t('Role')} obj={udn} path="spec.layer3.role" />
      <DetailsItem
        defaultValue={emptyText}
        label={t('Subnets')}
        obj={udn}
        path="spec.layer3.subnets"
      >
        {subnets}
      </DetailsItem>
      <DetailsItem
        defaultValue={emptyText}
        label={t('JoinSubnets')}
        obj={udn}
        path="spec.layer3.joinSubnets"
      >
        {joinSubnets}
      </DetailsItem>
    </>
  );
};

export default UDNLayer3Details;
