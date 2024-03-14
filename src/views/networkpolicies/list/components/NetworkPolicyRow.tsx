import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { NamespaceModel, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import {
  getGroupVersionKindForModel,
  ResourceLink,
  RowProps,
  TableData,
} from '@openshift-console/dynamic-plugin-sdk';
import { Selector } from '@utils/components/Selector/Selector';
import { getName, getNamespace } from '@utils/resources/shared';
import NetworkPolicyActions from '@views/networkpolicies/actions/NetworkPolicyActions';
import { modelToGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console/modelUtils';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { isEmpty } from 'lodash';

type NetworkPolicyRowType = RowProps<IoK8sApiNetworkingV1NetworkPolicy>;

const NetworkPolicyRow: FC<NetworkPolicyRowType> = ({ activeColumnIDs, obj }) => {
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
        <ResourceLink groupVersionKind={modelToGroupVersionKind(NamespaceModel)} name={namespace} />
      </TableData>
      <TableData
        activeColumnIDs={activeColumnIDs}
        className="pf-m-hidden pf-m-visible-on-md"
        id="pod-selector"
      >
        {isEmpty(obj.spec.podSelector) ? (
          <Link
            to={`/search/ns/${obj.metadata.namespace}?kind=Pod`}
          >{`All pods within ${obj.metadata.namespace}`}</Link>
        ) : (
          <Selector namespace={obj.metadata.namespace} selector={obj.spec.podSelector} />
        )}
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="">
        <NetworkPolicyActions isKebabToggle obj={obj} />
      </TableData>
    </>
  );
};
export default NetworkPolicyRow;
