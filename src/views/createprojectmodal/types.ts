import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { ClusterUserDefinedNetworkKind, UserDefinedNetworkKind } from '@utils/resources/udns/types';

import { DESCRIPTION_ANNOTATION, DISPLAY_NAME_ANNOTATION } from './constants';

export enum NETWORK_TYPE {
  POD_NETWORK,
  UDN,
  CLUSTER_UDN,
}

export type CreateProjectModalFormState = {
  clusterUDN?: ClusterUserDefinedNetworkKind;
  networkType: NETWORK_TYPE;
  project: K8sResourceCommon & {
    metadata: {
      annotations: { [DESCRIPTION_ANNOTATION]: string; [DISPLAY_NAME_ANNOTATION]: string };
    };
  };
  udn: UserDefinedNetworkKind;
};
