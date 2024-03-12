import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import NADDetailsPage from '../tabs/details/NADDetailsPage';
import NADYAMLPage from '../tabs/yaml/NADYAMLPage';

export const useNADTab = () => {
  const { t } = useNetworkingTranslation();

  return [
    {
      component: NADDetailsPage,
      href: '',
      name: t('Details'),
    },
    {
      component: NADYAMLPage,
      href: 'yaml',
      name: t('YAML'),
    },
  ];
};
