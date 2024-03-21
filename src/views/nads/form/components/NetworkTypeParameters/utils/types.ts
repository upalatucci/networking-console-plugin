import { NetworkAttachmentDefinitionFormInput } from '@views/nads/form/utils/types';
import { UseFormRegister, Control } from 'react-hook-form';

export type ParametersComponentProps = {
  register: UseFormRegister<NetworkAttachmentDefinitionFormInput>;
  control: Control<NetworkAttachmentDefinitionFormInput, any>;
};
