import { FC } from 'react';

import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { UserDefinedNetworkModel } from '@utils/models';
import { getName } from '@utils/resources/shared';
import {
  UserDefinedNetworkAnnotations,
  UserDefinedNetworkKind,
  UserDefinedNetworkRole,
} from '@utils/resources/udns/types';
import { isEmpty } from '@utils/utils';

import Layer2Parameters from '../components/UDNLayer2Parameters';
import Layer3Parameters from '../components/UDNLayer3Parameters';

import { TopologyKeys, UserDefinedNetworkFormInput } from './types';

export const topologyComponentMapper: Record<TopologyKeys, FC> = {
  [TopologyKeys.Layer2]: Layer2Parameters,
  [TopologyKeys.Layer3]: Layer3Parameters,
};

export const fromUDNObjToFormData = (obj: UserDefinedNetworkKind): UserDefinedNetworkFormInput => {
  return {
    description: obj?.metadata?.annotations?.description,
    name: getName(obj),
    topology: Object.keys(TopologyKeys).find((key) => TopologyKeys[key] === obj.spec.topology),
    [TopologyKeys.Layer2]: {
      ...obj?.spec?.layer2,
      ipamLifecycle: obj?.spec?.layer2?.ipamLifecycle === 'Persistent' ? 'true' : undefined,
      role: UserDefinedNetworkRole[obj?.spec?.layer2?.role],
    },
    [TopologyKeys.Layer3]: {
      ...obj?.spec?.layer3,
      role: UserDefinedNetworkRole[obj?.spec?.layer3?.role],
    },
  };
};

export const fromDataToUDNObj = (
  formData: UserDefinedNetworkFormInput,
  namespace: string,
): UserDefinedNetworkKind => {
  const { description, Layer2, Layer3, name, topology } = formData;
  const annotations: UserDefinedNetworkAnnotations = {
    ...(!isEmpty(description) && { description: description }),
  };

  return {
    apiVersion: `${UserDefinedNetworkModel.apiGroup}/${UserDefinedNetworkModel.apiVersion}`,
    kind: UserDefinedNetworkModel.kind,
    metadata: {
      annotations,
      name,
      namespace,
    },
    spec: {
      layer2:
        topology === TopologyKeys.Layer2
          ? {
              ...Layer2,
              ipamLifecycle: Layer2?.ipamLifecycle ? 'Persistent' : undefined,
              mtu: Layer2.mtu ? Number(Layer2.mtu) : undefined,
            }
          : undefined,
      layer3:
        topology === TopologyKeys.Layer3
          ? {
              ...Layer3,
              mtu: Layer3.mtu ? Number(Layer3.mtu) : undefined,
            }
          : undefined,
      topology: TopologyKeys[topology],
    },
  };
};

export const createUDN = (formData: UserDefinedNetworkFormInput, namespace: string) =>
  k8sCreate({
    data: fromDataToUDNObj(formData, namespace),
    model: UserDefinedNetworkModel,
  });
