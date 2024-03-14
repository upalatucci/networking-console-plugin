import { modelToRef, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import {
  Action,
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { asAccessReview, getName, getNamespace } from '@utils/resources/shared';
import { useNavigate } from 'react-router-dom-v5-compat';

type NetworkPolicyActionProps = (obj: IoK8sApiNetworkingV1NetworkPolicy) => [actions: Action[]];

const useNetworkPolicyActions: NetworkPolicyActionProps = (obj) => {
  const { t } = useNetworkingTranslation();

  const navigate = useNavigate();
  const launchDeleteModal = useDeleteModal(obj);
  const launchLabelsModal = useLabelsModal(obj);
  const launchAnnotationsModal = useAnnotationsModal(obj);

  const objNamespace = getNamespace(obj);
  const objName = getName(obj);

  const actions = [
    {
      accessReview: asAccessReview(NetworkPolicyModel, obj, 'update'),
      cta: launchLabelsModal,
      id: 'edit-labels-network-policies',
      label: t('Edit labels'),
    },
    {
      accessReview: asAccessReview(NetworkPolicyModel, obj, 'update'),
      cta: launchAnnotationsModal,
      id: 'edit-annotations-network-policies',
      label: t('Edit annotations'),
    },
    {
      accessReview: asAccessReview(NetworkPolicyModel, obj, 'update'),
      cta: () =>
        navigate(`/k8s/ns/${objNamespace}/${modelToRef(NetworkPolicyModel)}/${objName}/yaml`),
      id: 'edit-network-policies',
      label: t('Edit NetworkPolicy'),
    },
    {
      accessReview: asAccessReview(NetworkPolicyModel, obj, 'delete'),
      cta: launchDeleteModal,
      id: 'delete-network-policy',
      label: t('Delete NetworkPolicy'),
    },
  ];

  return [actions];
};

export default useNetworkPolicyActions;
