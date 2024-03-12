import * as React from 'react';
import * as _ from 'lodash';

import { Button } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { useClusterNetworkFeatures } from '@utils/hooks/useClusterNetworkFeatures';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkPolicyIPBlock } from '@utils/models';

export const NetworkPolicyPeerIPBlock: React.FunctionComponent<PeerIPBlockProps> = (props) => {
  const { t } = useNetworkingTranslation();
  const { direction, ipBlock, onChange } = props;
  const [networkFeatures, networkFeaturesLoaded] = useClusterNetworkFeatures();

  const handleCIDRChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ipBlock.cidr = event.currentTarget.value;
    onChange(ipBlock);
  };

  const handleExceptionsChange = (idx: number, value: string) => {
    ipBlock.except[idx].value = value;
    onChange(ipBlock);
  };

  return (
    <>
      <div className="form-group co-create-networkpolicy__ipblock">
        <label className="co-required" htmlFor="cidr">
          {t('CIDR')}
        </label>
        <input
          aria-describedby="ipblock-help"
          className="pf-v5-c-form-control"
          data-test="ipblock-cidr-input"
          id="cidr"
          name="cidr"
          onChange={handleCIDRChange}
          placeholder="10.2.1.0/16"
          required
          type="text"
          value={ipBlock.cidr}
        />
        <div className="help-block">
          <p>
            {direction === 'ingress'
              ? t('If this field is empty, traffic will be allowed from all external sources.')
              : t('If this field is empty, traffic will be allowed to all external sources.')}
          </p>
        </div>
      </div>
      {networkFeaturesLoaded && networkFeatures.PolicyPeerIPBlockExceptions !== false && (
        <div className="form-group co-create-networkpolicy__exceptions">
          <label>{t('Exceptions')}</label>
          {ipBlock.except.map((exc, idx) => (
            <div className="pf-v5-c-input-group" key={exc.key}>
              <input
                aria-describedby="ports-help"
                className="pf-v5-c-form-control"
                data-test="ipblock-exception-input"
                id={`exception-${idx}`}
                name={`exception-${idx}`}
                onChange={(event) => handleExceptionsChange(idx, event.currentTarget.value)}
                placeholder="10.2.1.0/12"
                type="text"
                value={exc.value}
              />
              <Button
                aria-label={t('Remove exception')}
                className="co-create-networkpolicy__remove-exception"
                data-test="ipblock-remove-exception"
                onClick={() => {
                  ipBlock.except = [
                    ...ipBlock.except.slice(0, idx),
                    ...ipBlock.except.slice(idx + 1),
                  ];
                  onChange(ipBlock);
                }}
                type="button"
                variant="plain"
              >
                <MinusCircleIcon />
              </Button>
            </div>
          ))}
          <div className="co-toolbar__group co-toolbar__group--left co-create-networkpolicy__add-exception">
            <Button
              className="pf-m-link--align-left"
              data-test="ipblock-add-exception"
              onClick={() => {
                ipBlock.except.push({
                  key: _.uniqueId('exception-'),
                  value: '',
                });
                onChange(ipBlock);
              }}
              type="button"
              variant="link"
            >
              <PlusCircleIcon className="co-icon-space-r" />
              {t('Add exception')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

type PeerIPBlockProps = {
  direction: 'egress' | 'ingress';
  ipBlock: NetworkPolicyIPBlock;
  onChange: (ipBlock: NetworkPolicyIPBlock) => void;
};
