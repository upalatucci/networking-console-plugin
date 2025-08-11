import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Button, ButtonVariant, Checkbox, FormSection } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import LabelSelectorEditor from '@utils/components/LabelSelectorEditor/LabelSelectorEditor';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { isEmpty } from '@utils/utils';

import { VMNetworkForm } from '../constants';

import SelectedProjects from './SelectedProjects';

const ProjectNamespaceSelector: FC = () => {
  const { t } = useNetworkingTranslation();
  const { control } = useFormContext<VMNetworkForm>();

  return (
    <FormSection title={t('Projects')} titleElement="h2">
      <Controller
        control={control}
        name="network.spec.namespaceSelector.matchLabels"
        render={({ field: { onChange, value } }) =>
          isEmpty(value) ? (
            <div>
              <Button
                icon={<PlusCircleIcon />}
                onClick={() => onChange({ ['']: '' })}
                variant={ButtonVariant.link}
              >
                {t('Add a label to specify qualifying projects')}
              </Button>
              <Controller
                control={control}
                name="matchLabelCheck"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    isChecked={value}
                    id="check-empty-matchlabel"
                    label={t(
                      "I'm aware that if no label is specified, all current and future projects will have access to this network. To prevent this, add labels to the network",
                    )}
                    onChange={(_, checked) => onChange(checked)}
                  />
                )}
              />
            </div>
          ) : (
            <LabelSelectorEditor
              labelSelectorPairs={Object.entries(value || {})}
              onLastItemRemoved={() => onChange({})}
              updateParentData={(newLabels) => onChange(Object.fromEntries(newLabels))}
            />
          )
        }
      />

      <SelectedProjects />
    </FormSection>
  );
};

export default ProjectNamespaceSelector;
