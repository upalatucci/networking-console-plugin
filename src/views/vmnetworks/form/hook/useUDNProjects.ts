import { useMemo } from 'react';

import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import useProjects from '@utils/hooks/useProjects/useProjects';
import { getLabels } from '@utils/resources/shared';
import { PRIMARY_USER_DEFINED_LABEL } from '@views/udns/list/constants';

const useUDNProjects = (): [projects: K8sResourceCommon[], loaded: boolean] => {
  const [projects, loaded] = useProjects();

  const udnProjects = useMemo(
    () =>
      projects?.filter((project) => getLabels(project)?.[PRIMARY_USER_DEFINED_LABEL] === 'true'),
    [projects],
  );

  return [udnProjects, loaded];
};

export default useUDNProjects;
