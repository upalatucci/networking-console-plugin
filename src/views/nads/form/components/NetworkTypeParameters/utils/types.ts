import { Control, UseFormRegister } from 'react-hook-form';

import { NetworkAttachmentDefinitionFormInput } from '@views/nads/form/utils/types';

export type ParametersComponentProps = {
  control: Control<NetworkAttachmentDefinitionFormInput, any>;
  register: UseFormRegister<NetworkAttachmentDefinitionFormInput>;
};
