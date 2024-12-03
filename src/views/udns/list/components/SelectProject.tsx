import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
import { DropdownItem, FormGroup } from '@patternfly/react-core';
import Loading from '@utils/components/Loading/Loading';
import Select from '@utils/components/Select/Select';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { getName } from '@utils/resources/shared';

import { ProjectGroupVersionKind } from '../constants';
import useProjects from '../hooks/useProjects';

import { UDNForm } from './constants';

const SelectProject: FC = () => {
  const { t } = useNetworkingTranslation();

  const { control, setValue } = useFormContext<UDNForm>();

  const [projects, loaded] = useProjects();

  if (!loaded) return <Loading />;

  return (
    <FormGroup fieldId="input-project-name" isRequired label={t('Project name')}>
      <Controller
        control={control}
        name="metadata.namespace"
        render={({ field: { value: selectedProjectName } }) => (
          <Select
            id="input-project-name"
            selected={selectedProjectName}
            toggleContent={
              selectedProjectName ? (
                <>
                  <ResourceIcon groupVersionKind={ProjectGroupVersionKind} /> {selectedProjectName}
                </>
              ) : (
                t('Select project')
              )
            }
          >
            <>
              {projects?.map((project) => {
                const projectName = getName(project);
                return (
                  <DropdownItem
                    key={projectName}
                    onClick={() => setValue('metadata.namespace', projectName)}
                    value={projectName}
                  >
                    <ResourceIcon groupVersionKind={ProjectGroupVersionKind} />

                    {projectName}
                  </DropdownItem>
                );
              })}
            </>
          </Select>
        )}
        rules={{ required: true }}
      />
    </FormGroup>
  );
};

export default SelectProject;
