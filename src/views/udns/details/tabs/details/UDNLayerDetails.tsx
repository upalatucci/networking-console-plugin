import React, { FC } from 'react';

import { DetailsItemComponentProps } from '@openshift-console/dynamic-plugin-sdk';
import {
  Card,
  CardBody,
  ClipboardCopy,
  Flex,
  FlexItem,
  List,
  ListItem,
} from '@patternfly/react-core';
import { DetailsItem } from '@utils/components/DetailsItem/DetailsItem';
import MutedText from '@utils/components/MutedText/MutedText';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import {
  getLayer2JoinSubnets,
  getLayer2Subnets,
  getLayer3JoinSubnets,
  getLayer3Subnets,
  getTopology,
} from '@utils/resources/udns/selectors';
import {
  UserDefinedNetworkKind,
  UserDefinedNetworkLayer3Subnet,
} from '@utils/resources/udns/types';
import { TopologyKeys } from '@views/udns/form/utils/types';

import UDNLayer2Details from './UDNLayer2Details';
import UDNLayer3Details from './UDNLayer3Details';

const UDNLayerDetails: FC<DetailsItemComponentProps<UserDefinedNetworkKind>> = ({ obj: udn }) => {
  const { t } = useNetworkingTranslation();

  const getEmptyText = () => {
    return <MutedText content={t('Not available')} />;
  };

  const getLayer3SubnetListItem = (subnet: UserDefinedNetworkLayer3Subnet, i: number) => {
    return (
      <ListItem key={`${subnet.cidr}|${subnet.hostSubnet}`}>
        <Flex flex={{ default: 'flex_1' }}>
          <FlexItem flex={{ default: 'flex_1' }}>
            <DetailsItem
              defaultValue={getEmptyText()}
              label={t('CIDR')}
              obj={udn}
              path={`spec.layer3.subnets[${i}].cidr`}
            />
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <DetailsItem
              defaultValue={getEmptyText()}
              label={t('HostSubnet')}
              obj={udn}
              path={`spec.layer3.subnets[${i}].hostSubnet`}
            />
          </FlexItem>
        </Flex>
      </ListItem>
    );
  };

  const getTextListItem = (text: string) => {
    return (
      <ListItem key={text}>
        <ClipboardCopy
          clickTip={t('Copied')}
          hoverTip={t('Copy')}
          isCode
          isReadOnly
          variant="inline-compact"
        >
          {text}
        </ClipboardCopy>
      </ListItem>
    );
  };

  const getList = (children: React.JSX.Element[]) => {
    if (!children.length) {
      return getEmptyText();
    }
    return <List>{children}</List>;
  };

  const getContent = () => {
    switch (getTopology(udn)) {
      case TopologyKeys.Layer2:
        return (
          <UDNLayer2Details
            emptyText={getEmptyText()}
            joinSubnets={getList(getLayer2JoinSubnets(udn).map((jsn) => getTextListItem(jsn)))}
            subnets={getList(getLayer2Subnets(udn).map((sn) => getTextListItem(sn)))}
            udn={udn}
          />
        );
      case TopologyKeys.Layer3:
        return (
          <UDNLayer3Details
            emptyText={getEmptyText()}
            joinSubnets={getList(getLayer3JoinSubnets(udn).map((jsn) => getTextListItem(jsn)))}
            subnets={getList(getLayer3Subnets(udn).map((sn, i) => getLayer3SubnetListItem(sn, i)))}
            udn={udn}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <Card isPlain>
      <CardBody>{getContent()}</CardBody>
    </Card>
  );
};

export default UDNLayerDetails;
