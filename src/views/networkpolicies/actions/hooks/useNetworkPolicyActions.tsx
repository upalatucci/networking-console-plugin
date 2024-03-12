import { useHistory } from 'react-router';

import { modelToRef, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import {
  Action,
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';
import { asAccessReview, getName, getNamespace } from '@utils/resources/shared';

type NetworkPolicyActionProps = (obj: NetworkPolicyKind) => [actions: Action[]];

const useNetworkPolicyActions: NetworkPolicyActionProps = (obj) => {
  const { t } = useNetworkingTranslation();

  const history = useHistory();
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
        history.push(`/k8s/ns/${objNamespace}/${modelToRef(NetworkPolicyModel)}/${objName}/yaml`),
      id: 'edit-network-policies',
      label: t('Edit NetworkAttachmentDefinition'),
    },
    {
      accessReview: asAccessReview(NetworkPolicyModel, obj, 'delete'),
      cta: launchDeleteModal,
      id: 'delete-network-policy',
      label: t('Delete NetworkAttachmentDefinition'),
    },
  ];

  return [actions];
};

export default useNetworkPolicyActions;
