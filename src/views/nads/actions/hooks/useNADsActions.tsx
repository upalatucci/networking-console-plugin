import { NetworkAttachmentDefinitionModelRef } from '@kubevirt-ui/kubevirt-api/console';
import {
  Action,
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';

import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import { useHistory } from 'react-router';
import { asAccessReview, getName, getNamespace } from '@utils/resources/shared';
import NetworkAttachmentDefinitionModel from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

type NADsActionsProps = (
  obj: NetworkAttachmentDefinitionKind,
) => [actions: Action[]];

const useNADsActions: NADsActionsProps = (obj) => {
  const { t } = useNetworkingTranslation();

  const history = useHistory();
  const launchDeleteModal = useDeleteModal(obj);
  const launchLabelsModal = useLabelsModal(obj);
  const launchAnnotationsModal = useAnnotationsModal(obj);

  const objNamespace = getNamespace(obj);
  const objName = getName(obj);

  const actions = [
    {
      cta: launchLabelsModal,
      id: 'edit-labels-nads',
      label: t('Edit labels'),
      accessReview: asAccessReview(
        NetworkAttachmentDefinitionModel,
        obj,
        'update',
      ),
    },
    {
      cta: launchAnnotationsModal,
      id: 'edit-annotations-nads',
      label: t('Edit annotations'),
      accessReview: asAccessReview(
        NetworkAttachmentDefinitionModel,
        obj,
        'update',
      ),
    },
    {
      cta: () =>
        history.push(
          `/k8s/ns/${objNamespace}/${NetworkAttachmentDefinitionModelRef}/${objName}/yaml`,
        ),
      id: 'edit-nads',
      label: t('Edit NetworkAttachmentDefinition'),
      accessReview: asAccessReview(
        NetworkAttachmentDefinitionModel,
        obj,
        'update',
      ),
    },
    {
      cta: launchDeleteModal,
      id: 'delete-bootablevolume',
      label: t('Delete NetworkAttachmentDefinition'),
      accessReview: asAccessReview(
        NetworkAttachmentDefinitionModel,
        obj,
        'delete',
      ),
    },
  ];

  return [actions];
};

export default useNADsActions;
