import React, { FC } from 'react';
import {
  ResourceLink,
  RowProps,
  TableData,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk';
import { getName, getNamespace } from '@utils/resources/shared';
import NetworkPolicyActions from '@views/networkpolicies/actions/NetworkPolicyActions';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';
import { Link } from 'react-router-dom-v5-compat';
import * as _ from 'lodash';
import { Selector } from '@utils/components/Selector/Selector';
import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';

type NetworkPolicyRowType = RowProps<NetworkPolicyKind>;

const NetworkPolicyRow: FC<NetworkPolicyRowType> = ({
  activeColumnIDs,
  obj,
}) => {
  const namespace = getNamespace(obj);
  const name = getName(obj);

  return (
    <>
      <TableData activeColumnIDs={activeColumnIDs} id="name">
        <ResourceLink
          groupVersionKind={getGroupVersionKindForModel(NetworkPolicyModel)}
          name={name}
          namespace={namespace}
        />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="namespace">
        <ResourceLink kind="Namespace" name={namespace} />
      </TableData>
      <TableData
        activeColumnIDs={activeColumnIDs}
        id="pod-selector"
        className="pf-m-hidden pf-m-visible-on-md"
      >
        {_.isEmpty(obj.spec.podSelector) ? (
          <Link
            to={`/search/ns/${obj.metadata.namespace}?kind=Pod`}
          >{`All pods within ${obj.metadata.namespace}`}</Link>
        ) : (
          <Selector
            selector={obj.spec.podSelector}
            namespace={obj.metadata.namespace}
          />
        )}
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="">
        <NetworkPolicyActions isKebabToggle obj={obj} />
      </TableData>
    </>
  );
};
export default NetworkPolicyRow;
