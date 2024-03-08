import {
  BlueInfoCircleIcon,
  Selector as K8sSelector,
} from '@openshift-console/dynamic-plugin-sdk';
import { Tooltip } from '@patternfly/react-core';
import { Selector } from '@utils/components/Selector/Selector';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkPolicyPort } from '@utils/resources/networkpolicies/types';
import { Link } from 'react-router-dom-v5-compat';
import { ConsolidatedRow } from './utils';
import * as _ from 'lodash';
import React, { FC } from 'react';

type PeerRowProps = {
  row: ConsolidatedRow;
  ports: NetworkPolicyPort[];
  namespace: string;
  mainPodSelector: K8sSelector;
};

const PeerRow: FC<PeerRowProps> = ({
  row,
  ports,
  namespace,
  mainPodSelector,
}) => {
  const { t } = useNetworkingTranslation();
  const style = { margin: '5px 0' };

  return (
    <div className="row co-resource-list__item">
      <div className="col-xs-4">
        <div>
          <span className="text-muted">{t('Pod selector')}:</span>
        </div>
        <div style={style}>
          {_.isEmpty(mainPodSelector) ? (
            <Link
              to={`/search/ns/${namespace}?kind=Pod`}
            >{`All pods within ${namespace}`}</Link>
          ) : (
            <Selector selector={mainPodSelector} namespace={namespace} />
          )}
        </div>
      </div>
      <div className="col-xs-5">
        <div>
          {!row.namespaceSelector && !row.podSelector && !row.ipBlocks ? (
            <div>{t('Any peer')}</div>
          ) : (
            <>
              {row.namespaceSelector ? (
                <div>
                  <span className="text-muted">{t('NS selector')}:</span>
                  <div style={style}>
                    {_.isEmpty(row.namespaceSelector) ? (
                      <span>{t('Any namespace')}</span>
                    ) : (
                      <Selector
                        selector={row.namespaceSelector}
                        kind="Namespace"
                      />
                    )}
                  </div>
                </div>
              ) : (
                row.podSelector && (
                  <div>
                    <span className="text-muted">{t('Namespace')}:</span>
                    <div style={style}>{namespace}</div>
                  </div>
                )
              )}
              {row.podSelector && (
                <div style={{ paddingTop: 10 }}>
                  <span className="text-muted">{t('Pod selector')}:</span>
                  <div style={style}>
                    {_.isEmpty(row.podSelector) ? (
                      <span>{t('Any pod')}</span>
                    ) : (
                      <Selector
                        selector={row.podSelector}
                        namespace={
                          row.namespaceSelector ? undefined : namespace
                        }
                      />
                    )}
                  </div>
                </div>
              )}
              {row.ipBlocks && (
                <div>
                  <span className="text-muted">{t('IP blocks')}:</span>
                  {row.ipBlocks.map((ipblock, idx) => (
                    <div style={style} key={`ipblock_${idx}`}>
                      {ipblock.cidr}
                      {ipblock.except && ipblock.except.length > 0 && (
                        <>
                          <Tooltip
                            content={
                              <div>
                                {t('Exceptions')}
                                {': '}
                                {ipblock.except.join(', ')}
                              </div>
                            }
                          >
                            <span>
                              {` (${t('with exceptions')}) `}
                              <BlueInfoCircleIcon />
                            </span>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="col-xs-3">
        {ports && ports.length > 0 ? (
          <>
            {_.map(ports, (port, k) => (
              <p key={k}>
                {port.protocol}/{port.port}
              </p>
            ))}
          </>
        ) : (
          <div>{t('Any port')}</div>
        )}
      </div>
    </div>
  );
};

export default PeerRow;
