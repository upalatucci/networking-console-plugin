import { useHistory } from 'react-router';

import { modelToRef, ServiceModel } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import {
  Action,
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { asAccessReview, getName, getNamespace } from '@utils/resources/shared';

type ServiceActionProps = (obj: IoK8sApiCoreV1Service) => [actions: Action[]];

const useServiceActions: ServiceActionProps = (obj) => {
  const { t } = useNetworkingTranslation();

  const history = useHistory();
  const launchDeleteModal = useDeleteModal(obj);
  const launchLabelsModal = useLabelsModal(obj);
  const launchAnnotationsModal = useAnnotationsModal(obj);

  const objNamespace = getNamespace(obj);
  const objName = getName(obj);

  const actions = [
    {
      accessReview: asAccessReview(ServiceModel, obj, 'update'),
      cta: launchLabelsModal,
      id: 'edit-labels-network-policies',
      label: t('Edit labels'),
    },
    {
      accessReview: asAccessReview(ServiceModel, obj, 'update'),
      cta: launchAnnotationsModal,
      id: 'edit-annotations-network-policies',
      label: t('Edit annotations'),
    },
    {
      accessReview: asAccessReview(ServiceModel, obj, 'update'),
      cta: () =>
        history.push(`/k8s/ns/${objNamespace}/${modelToRef(ServiceModel)}/${objName}/yaml`),
      id: 'edit-network-policies',
      label: t('Edit Service'),
    },
    {
      accessReview: asAccessReview(ServiceModel, obj, 'delete'),
      cta: launchDeleteModal,
      id: 'delete-network-policy',
      label: t('Delete Service'),
    },
  ];

  return [actions];
};

export default useServiceActions;
