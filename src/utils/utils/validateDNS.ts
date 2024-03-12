export enum ValidationErrorType {
  Error = 'error',
  Info = 'info',
  TrivialError = 'trivial-error', // should not be visible but affects data validation
  Warn = 'warning',
}

export type ValidationObject = {
  messageKey: string;
  type?: ValidationErrorType;
};

export const asValidationObject = (
  messageKey: string,
  type: ValidationErrorType = ValidationErrorType.Error,
): ValidationObject => ({
  messageKey,
  type,
});

type DNSValidationMsgs = {
  emptyMsg: string;
  errorMsg: string;
  longMsg: string;
  shortMsg: string;
  startEndAlphanumbericMsg: string;
  uppercaseMsg: string;
};

const alphanumericRegex = '[a-zA-Z0-9]';
const alphanumericRegexWithDash = '[-a-zA-Z0-9]';
const DNS1123_MAX_LENGTH = 253;

// DNS-1123 subdomain
export const validateDNS1123SubdomainValue = (
  value: string,
  {
    emptyMsg,
    errorMsg,
    longMsg,
    shortMsg,
    startEndAlphanumbericMsg,
    uppercaseMsg,
  }: DNSValidationMsgs,
  { max, min }: { max?: number; min?: number } = {
    max: DNS1123_MAX_LENGTH,
    min: undefined,
  },
): ValidationObject => {
  const maxLength = max || DNS1123_MAX_LENGTH;

  if (!value) {
    return asValidationObject(emptyMsg, ValidationErrorType.TrivialError);
  }

  if (value.match(/^\$\{[A-Z_]+\}$/)) {
    return asValidationObject('template parameter', ValidationErrorType.Warn);
  }

  if (min && value.length < min) {
    return asValidationObject(shortMsg);
  }
  if (value.length > maxLength) {
    return asValidationObject(longMsg);
  }

  const startsWithAlphaNumeric = value.charAt(0).match(alphanumericRegex);
  const endsWithAlphaNumeric = value.charAt(value.length - 1).match(alphanumericRegex);

  if (!startsWithAlphaNumeric || !endsWithAlphaNumeric) {
    return asValidationObject(startEndAlphanumbericMsg);
  }

  for (const c of value) {
    if (c.toLowerCase() !== c) {
      return asValidationObject(uppercaseMsg);
    }

    if (!c.match(alphanumericRegexWithDash)) {
      return asValidationObject(errorMsg);
    }
  }
  return null;
};
