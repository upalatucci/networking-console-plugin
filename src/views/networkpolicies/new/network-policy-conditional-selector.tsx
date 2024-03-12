import * as React from 'react';

import { Button } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import LabelSelectorEditor from '@utils/components/LabelSelectorEditor/LabelSelectorEditor';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

type NetworkPolicyConditionalSelectorProps = {
  dataTest?: string;
  helpText: string;
  onChange: (pairs: string[][]) => void;
  selectorType: 'namespace' | 'pod';
  values: string[][];
};

export const NetworkPolicyConditionalSelector: React.FunctionComponent<
  NetworkPolicyConditionalSelectorProps
> = (props) => {
  const { t } = useNetworkingTranslation();
  const { dataTest, helpText, onChange, selectorType, values } = props;
  const [isVisible, setVisible] = React.useState(values.length > 0);

  const handleSelectorChange = (nameValuePairs: string[][]) => {
    onChange(nameValuePairs);
  };

  const title = selectorType === 'pod' ? t('Pod selector') : t('Namespace selector');
  const addSelectorText =
    selectorType === 'pod' ? t('Add pod selector') : t('Add namespace selector');
  const secondHelpText =
    selectorType === 'pod'
      ? t('Pods having all the supplied key/value pairs as labels will be selected.')
      : t('Namespaces having all the supplied key/value pairs as labels will be selected.');

  return (
    <>
      <span>
        <label>{title}</label>
      </span>
      <div className="help-block">
        <p className="co-create-networkpolicy__paragraph">{helpText}</p>
      </div>
      {isVisible ? (
        <>
          <div className="help-block">
            <p className="co-create-networkpolicy__paragraph">{secondHelpText}</p>
          </div>

          <LabelSelectorEditor
            labelSelectorPairs={values.length > 0 ? values : [['', '']]}
            onLastItemRemoved={() => setVisible(false)}
            updateParentData={handleSelectorChange}
          />
        </>
      ) : (
        <div className="co-toolbar__group co-toolbar__group--left co-create-networkpolicy__show-selector">
          <Button
            className="pf-m-link--align-left"
            data-test={dataTest ? `add-${dataTest}` : 'add-labels-selector'}
            onClick={() => setVisible(true)}
            type="button"
            variant="link"
          >
            <PlusCircleIcon className="co-icon-space-r" />
            {addSelectorText}
          </Button>
        </div>
      )}
    </>
  );
};
