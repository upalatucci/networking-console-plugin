import React, { FC, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
import { FormGroup, SelectOption } from '@patternfly/react-core';
import Loading from '@utils/components/Loading/Loading';
import SelectTypeahead from '@utils/components/SelectTypeahead/SelectTypeahead';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { getName } from '@utils/resources/shared';

import { ProjectGroupVersionKind } from '../constants';
import useProjects from '../hooks/useProjects';

import { UDNForm } from './constants';

const SelectProject: FC = () => {
  const { t } = useNetworkingTranslation();

  const { control } = useFormContext<UDNForm>();

  const [projects, loaded] = useProjects();

  const projectsOptions = useMemo(
    () =>
      projects.map((project) => ({
        children: (
          <>
            {' '}
            <ResourceIcon groupVersionKind={ProjectGroupVersionKind} /> {getName(project)}{' '}
          </>
        ),
        key: getName(project),
        value: getName(project),
      })),
    [projects],
  );

  if (!loaded) return <Loading />;

  return (
    <FormGroup fieldId="input-project-name" isRequired label={t('Project name')}>
      <Controller
        control={control}
        name="metadata.namespace"
        render={({ field: { onChange, value: selectedProjectName } }) => (
          <SelectTypeahead
            id="select-project"
            options={projectsOptions}
            placeholder={t('Select a Project')}
            selected={selectedProjectName}
            setSelected={(newSelection) => onChange(newSelection)}
          >
            <>
              {projects?.map((project) => {
                const projectName = getName(project);
                return (
                  <SelectOption
                    key={projectName}
                    onClick={() => onChange(projectName)}
                    value={projectName}
                  >
                    <ResourceIcon groupVersionKind={ProjectGroupVersionKind} />

                    {projectName}
                  </SelectOption>
                );
              })}
            </>
          </SelectTypeahead>
        )}
        rules={{ required: true }}
      />
    </FormGroup>
  );
};

export default SelectProject;
