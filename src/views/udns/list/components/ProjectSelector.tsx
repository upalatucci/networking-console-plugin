import React, { FC } from 'react';

import { ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
import { DropdownItem, FormGroup } from '@patternfly/react-core';
import Loading from '@utils/components/Loading/Loading';
import Select from '@utils/components/Select/Select';
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

  if (!loaded) return <Loading />;

  return (
    <FormGroup fieldId="input-project-name" isRequired label={t('Project name')}>
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
                onClick={() => setSelectedProjectName(projectName)}
                value={projectName}
              >
                <ResourceIcon groupVersionKind={ProjectGroupVersionKind} />

                {projectName}
              </DropdownItem>
            );
          })}
        </>
      </Select>
    </FormGroup>
  );
};

export default ProjectSelector;
