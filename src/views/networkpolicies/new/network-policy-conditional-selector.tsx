import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import LabelSelectorEditor from '@utils/components/LabelSelectorEditor/LabelSelectorEditor';

type NetworkPolicyConditionalSelectorProps = {
  selectorType: 'pod' | 'namespace';
  helpText: string;
  values: string[][];
  onChange: (pairs: string[][]) => void;
  dataTest?: string;
};

export const NetworkPolicyConditionalSelector: React.FunctionComponent<
  NetworkPolicyConditionalSelectorProps
> = (props) => {
  const { t } = useNetworkingTranslation();
  const { selectorType, helpText, values, onChange, dataTest } = props;
  const [isVisible, setVisible] = React.useState(values.length > 0);

  const handleSelectorChange = (nameValuePairs: string[][]) => {
    onChange(nameValuePairs);
  };

  const title =
    selectorType === 'pod' ? t('Pod selector') : t('Namespace selector');
  const addSelectorText =
    selectorType === 'pod'
      ? t('Add pod selector')
      : t('Add namespace selector');
  const secondHelpText =
    selectorType === 'pod'
      ? t(
          'Pods having all the supplied key/value pairs as labels will be selected.',
        )
      : t(
          'Namespaces having all the supplied key/value pairs as labels will be selected.',
        );

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
            <p className="co-create-networkpolicy__paragraph">
              {secondHelpText}
            </p>
          </div>

          <LabelSelectorEditor
            labelSelectorPairs={values.length > 0 ? values : [['', '']]}
            updateParentData={handleSelectorChange}
            onLastItemRemoved={() => setVisible(false)}
          />
        </>
      ) : (
        <div className="co-toolbar__group co-toolbar__group--left co-create-networkpolicy__show-selector">
          <Button
            className="pf-m-link--align-left"
            onClick={() => setVisible(true)}
            type="button"
            variant="link"
            data-test={dataTest ? `add-${dataTest}` : 'add-labels-selector'}
          >
            <PlusCircleIcon className="co-icon-space-r" />
            {addSelectorText}
          </Button>
        </div>
      )}
    </>
  );
};
