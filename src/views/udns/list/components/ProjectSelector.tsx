import React, { FC, useMemo } from 'react';

import { ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
import { FormGroup, SelectOption } from '@patternfly/react-core';
import Loading from '@utils/components/Loading/Loading';
import SelectTypeahead from '@utils/components/SelectTypeahead/SelectTypeahead';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { getName } from '@utils/resources/shared';

import { ProjectGroupVersionKind } from '../constants';
import useProjects from '../hooks/useProjects';

type ProjectSelectorProps = {
  selectedProjectName: string;
  setSelectedProjectName: (newProjectName: string) => void;
};

const ProjectSelector: FC<ProjectSelectorProps> = ({
  selectedProjectName,
  setSelectedProjectName,
}) => {
  const { t } = useNetworkingTranslation();

  const [projects, loaded] = useProjects();

  const handleChange = (value: string) => {
    event.preventDefault();
    setSelectedProjectName(value);
  };

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
      <SelectTypeahead
        id="select-project"
        options={projectsOptions}
        placeholder={t('Select a Project')}
        selected={selectedProjectName}
        setSelected={handleChange}
      >
        <>
          {projects?.map((project) => {
            const projectName = getName(project);
            return (
              <SelectOption
                key={projectName}
                onClick={() => setSelectedProjectName(projectName)}
                value={projectName}
              >
                <ResourceIcon groupVersionKind={ProjectGroupVersionKind} />

                {projectName}
              </SelectOption>
            );
          })}
        </>
      </SelectTypeahead>
    </FormGroup>
  );
};

export default ProjectSelector;
