import React, { FC } from 'react';

import { Selector as K8sSelector } from '@openshift-console/dynamic-plugin-sdk';
import { Grid, GridItem } from '@patternfly/react-core';
import { NetworkPolicyPort } from '@utils/resources/networkpolicies/types';

import { ConsolidatedRow } from '../../utils/types';

import NetworkPolicyDetailsRowIP from './NetworkPolicyDetailsRowIP';
import NetworkPolicyDetailsRowPodSelector from './NetworkPolicyDetailsRowPodSelector';
import NetworkPolicyDetailsRowSelector from './NetworkPolicyDetailsRowSelector';

type NetworkPolicyDetailsRowProps = {
  mainPodSelector: K8sSelector;
  namespace: string;
  ports: NetworkPolicyPort[];
  row: ConsolidatedRow;
};

const NetworkPolicyDetailsRow: FC<NetworkPolicyDetailsRowProps> = ({
  mainPodSelector,
  namespace,
  ports,
  row,
}) => {
  return (
    <Grid>
      <GridItem span={4}>
        <NetworkPolicyDetailsRowPodSelector
          mainPodSelector={mainPodSelector}
          namespace={namespace}
        />
      </GridItem>
      <GridItem span={4}>
        <NetworkPolicyDetailsRowSelector namespace={namespace} row={row} />
      </GridItem>
      <GridItem span={4}>
        {(ports || []).map((port) => (
          <NetworkPolicyDetailsRowIP key={port.port} port={port} />
        ))}
      </GridItem>
    </Grid>
  );
};

export default NetworkPolicyDetailsRow;
