import {
  K8sResourceCommon,
  MatchExpression,
  Operator,
} from '@openshift-console/dynamic-plugin-sdk';
import { verifyMatchExpressions } from '@utils/utils';

import { ClusterUserDefinedNetworkKind } from '../udns/types';

export const getVMNetworkProjects = (
  vmNetwork: ClusterUserDefinedNetworkKind,
  projects: K8sResourceCommon[],
): K8sResourceCommon[] => {
  const namespaceSelector = vmNetwork?.spec?.namespaceSelector || {};

  const matchLabelsToExpressions = Object.entries(namespaceSelector.matchLabels || {}).map(
    ([key, value]): MatchExpression => ({
      key,
      operator: Operator.Equals,
      values: [value],
    }),
  );

  const matchExpressions = namespaceSelector.matchExpressions || [];

  const combinedExpressions = [...matchLabelsToExpressions, ...matchExpressions];

  return projects?.filter((project) => verifyMatchExpressions(project, combinedExpressions));
};
