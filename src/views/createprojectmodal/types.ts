import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

import { DESCRIPTION_ANNOTATION, DISPLAY_NAME_ANNOTATION } from './constants';

type UDNSpec = {
  layer2: {
    ipamLifecycle: string;
    role: string;
    subnets: string[];
  };
  topology: string;
};

export enum NETWORK_TYPE {
  POD_NETWORK,
  UDN,
  // CLUSTER_UDN,
}

export type CreateProjectModalFormState = {
  clusterUDN?: K8sResourceCommon;
  networkType: NETWORK_TYPE;
  project: K8sResourceCommon & {
    metadata: {
      annotations: { [DESCRIPTION_ANNOTATION]: string; [DISPLAY_NAME_ANNOTATION]: string };
    };
  };
  udn: K8sResourceCommon & { spec: UDNSpec };
};
