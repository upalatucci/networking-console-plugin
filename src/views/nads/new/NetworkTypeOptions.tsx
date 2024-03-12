/* eslint-disable react/prop-types */
import * as React from 'react';
import classNames from 'classnames';

import { RedExclamationCircleIcon } from '@openshift-console/dynamic-plugin-sdk';
import {
  Dropdown,
  DropdownItem,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  Popover,
  PopoverPosition,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { ELEMENT_TYPES, NetworkTypeParams, networkTypeParams } from '@utils/constants';
import { isEmpty } from '@utils/utils';

const handleTypeParamChange = (
  paramKey,
  event,
  elemType,
  networkType,
  setTypeParamsData,
  typeParamsData,
) => {
  const paramsUpdate = { ...typeParamsData };

  if (elemType === ELEMENT_TYPES.CHECKBOX) {
    paramsUpdate[paramKey] = { value: event.target.checked };
  } else if (event.target) {
    paramsUpdate[paramKey] = { value: event.target.value };
  } else {
    paramsUpdate[paramKey] = { value: event };
  }

  const validation = networkTypeParams?.[networkType]?.[paramKey]?.validation;
  paramsUpdate[paramKey].validationMsg = validation ? validation(paramsUpdate) : null;
  setTypeParamsData(paramsUpdate);
};

const getSriovNetNodePolicyResourceNames = (sriovNetNodePoliciesData) => {
  const resourceNames = {};

  sriovNetNodePoliciesData.forEach((policy) => {
    const resourceName = policy?.spec?.resourceName || '';
    if (resourceName !== '') {
      resourceNames[resourceName] = resourceName;
    }
  });

  return resourceNames;
};

const NetworkTypeOptions = (props) => {
  const { networkType, setTypeParamsData, sriovNetNodePoliciesData, typeParamsData } = props;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const params: NetworkTypeParams = networkType && networkTypeParams[networkType];

  if (isEmpty(params)) {
    return null;
  }

  if (networkType === 'sriov') {
    params.resourceName.values = getSriovNetNodePolicyResourceNames(sriovNetNodePoliciesData);
  }

  const dynamicContent = Object.entries(params).map(([key, parameter]) => {
    const typeParamsDataValue = typeParamsData?.[key]?.value;
    const typeParamsDataValidationMsg = typeParamsData?.[key]?.validationMsg;
    const { name, type } = parameter;
    const value = typeParamsDataValue ?? parameter?.initValue;

    let children;
    switch (type) {
      case ELEMENT_TYPES.TEXTAREA:
        children = (
          <div className="kv-nad-form-field--spacer">
            <label
              className={classNames('control-label', {
                'co-required': parameter.required,
              })}
              id={`network-type-params-${key}-label`}
            >
              {name}
            </label>
            <TextArea
              id={`network-type-params-${key}-textarea`}
              onChange={(event) =>
                handleTypeParamChange(
                  key,
                  event,
                  ELEMENT_TYPES.TEXTAREA,
                  networkType,
                  setTypeParamsData,
                  typeParamsData,
                )
              }
              value={value}
            />
            {typeParamsDataValidationMsg && (
              <div className="text-secondary">{typeParamsDataValidationMsg}</div>
            )}
          </div>
        );
        break;
      case ELEMENT_TYPES.CHECKBOX:
        children = (
          <div className="kv-nad-form-field--spacer">
            <div className="checkbox">
              <label id={`network-type-params-${key}-label`}>
                <input
                  checked={value}
                  className="create-storage-class-form__checkbox kv-nad-form-checkbox--alignment"
                  id={`network-type-params-${key}-checkbox`}
                  onChange={(event) =>
                    handleTypeParamChange(
                      key,
                      event,
                      ELEMENT_TYPES.CHECKBOX,
                      networkType,
                      setTypeParamsData,
                      typeParamsData,
                    )
                  }
                  type="checkbox"
                />
                {name}
              </label>
            </div>
            {typeParamsDataValidationMsg && (
              <div className="text-secondary">{typeParamsDataValidationMsg}</div>
            )}
          </div>
        );
        break;
      case ELEMENT_TYPES.DROPDOWN:
        children = (
          <div className="kv-nad-form-field--spacer">
            <label
              className={classNames('control-label', {
                'co-required': parameter.required,
              })}
              id={`network-type-params-${key}-label`}
            >
              {name}
            </label>
            <Dropdown
              id={`network-type-params-${key}-dropdown`}
              isOpen={isDropdownOpen}
              onChange={(event) =>
                handleTypeParamChange(
                  key,
                  event,
                  ELEMENT_TYPES.DROPDOWN,
                  networkType,
                  setTypeParamsData,
                  typeParamsData,
                )
              }
              onSelect={() => setIsDropdownOpen(false)}
              selected={value}
              title={parameter.hintText}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  id="toggle-networktype"
                  isExpanded={isDropdownOpen}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  ref={toggleRef}
                >
                  {parameter?.values[value] || parameter.hintText}
                </MenuToggle>
              )}
            >
              {Object.keys(parameter?.values).map((valueKey) => (
                <DropdownItem key={valueKey} value={valueKey}>
                  {parameter.values[valueKey]}
                </DropdownItem>
              ))}
            </Dropdown>
            {typeParamsDataValidationMsg && (
              <div className="text-secondary">{typeParamsDataValidationMsg}</div>
            )}
          </div>
        );
        break;
      case ELEMENT_TYPES.TEXT:
      default:
        children = (
          <div className="kv-nad-form-field--spacer">
            <label
              className={classNames('control-label', {
                'co-required': parameter.required,
              })}
              id={`network-type-params-${key}-label`}
            >
              {name}{' '}
              {parameter?.hintText && (
                <Popover bodyContent={parameter.hintText} position={PopoverPosition.right}>
                  <HelpIcon className="network-type-options--help-icon" />
                </Popover>
              )}
            </label>
            <TextInput
              id={`network-type-params-${key}-text`}
              onChange={(event) =>
                handleTypeParamChange(
                  key,
                  event,
                  ELEMENT_TYPES.TEXT,
                  networkType,
                  setTypeParamsData,
                  typeParamsData,
                )
              }
              type="text"
              value={value}
            />
            {typeParamsDataValidationMsg && (
              <div className="text-secondary">{typeParamsDataValidationMsg}</div>
            )}
          </div>
        );
    }

    return (
      <FormGroup fieldId={`network-type-parameters-${key}`} key={key}>
        {children}

        {typeParamsData?.[key]?.validationMsg && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem icon={<RedExclamationCircleIcon />} variant="error">
                {typeParamsData?.[key]?.validationMsg}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
      </FormGroup>
    );
  });

  return <>{dynamicContent}</>;
};

export default NetworkTypeOptions;
