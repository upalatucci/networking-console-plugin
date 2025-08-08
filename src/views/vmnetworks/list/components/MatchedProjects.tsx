import React, { FC, useState } from 'react';

import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { Button, ButtonVariant, Skeleton } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { ProjectGroupVersionKind } from '@utils/hooks/useProjects/constants';
import { getName } from '@utils/resources/shared';
import { ClusterUserDefinedNetworkKind } from '@utils/resources/udns/types';
import { isEmpty } from '@utils/utils';
import useVMNetworkMatchedProjects from '@views/vmnetworks/hooks/useVMNetworkMatchedProjects';

import { SHOW_MAX_ITEMS } from './constants';

type MatchedProjectsProps = {
  obj: ClusterUserDefinedNetworkKind;
};

const MatchedProjects: FC<MatchedProjectsProps> = ({ obj }) => {
  const [expand, setExpand] = useState(false);
  const { t } = useNetworkingTranslation();
  const [matchingProjects, loaded] = useVMNetworkMatchedProjects(obj);

  if (!loaded) return <Skeleton />;

  if (isEmpty(matchingProjects)) return <span>{t('No projects matched')}</span>;

  return (
    <>
      {matchingProjects
        .slice(0, expand ? matchingProjects.length : SHOW_MAX_ITEMS)
        .map((project) => (
          <ResourceLink
            groupVersionKind={ProjectGroupVersionKind}
            key={getName(project)}
            name={getName(project)}
          />
        ))}
      {matchingProjects.length > SHOW_MAX_ITEMS && (
        <Button onClick={() => setExpand(!expand)} variant={ButtonVariant.link}>
          {expand
            ? t('Show less')
            : t('+{{count}} more', { count: matchingProjects.length - SHOW_MAX_ITEMS })}
        </Button>
      )}
    </>
  );
};

export default MatchedProjects;
