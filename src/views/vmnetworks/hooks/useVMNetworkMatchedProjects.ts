import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { ClusterUserDefinedNetworkKind } from '@utils/resources/udns/types';
import { getVMNetworkProjects } from '@utils/resources/vmnetworks/utils';

import useUDNProjects from '../form/hook/useUDNProjects';

const useVMNetworkMatchedProjects = (
  vmNetwork: ClusterUserDefinedNetworkKind,
): [matchingProjects: K8sResourceCommon[], loaded: boolean] => {
  const [projects, loaded] = useUDNProjects();

  const matchingProjects = getVMNetworkProjects(vmNetwork, projects);

  return [matchingProjects, loaded];
};

export default useVMNetworkMatchedProjects;
