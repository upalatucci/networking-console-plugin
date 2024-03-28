import { MultiNetworkPolicyModel } from '@utils/models';

import { TAB_INDEXES } from './constants';

export const getActiveKeyFromPathname = (pathname: string) => {
  if (pathname.endsWith(MultiNetworkPolicyModel.kind)) return TAB_INDEXES.MULTI_NETWORK;

  if (pathname.includes('enable-multi')) return TAB_INDEXES.ENABLE_MULTI;

  return TAB_INDEXES.NETWORK;
};
