import * as yup from 'yup';
import _ from 'lodash';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';

yup.setLocale({
  mixed: {
    required: 'Required'
  }
});

const text = yup.string().nullable();

const maxChar = (number, msg) => text.max(number, msg || `Is too long (${number} characters maximum)`);

const maxCharTrimmed = number => maxChar(number).trim();

// based, but not exactly, on the one from  https://www.hanselman.com/blog/InternationalizedRegularExpressions.aspx
const nameRegex = /^$|^[A-Za-z-'.ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüçÇŒœßØøÅåÆæÞþÐð ]+$/;
const cityRegex = /^$|^[0-9A-Za-z-'.ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüçÇŒœßØøÅåÆæÞþÐð ]+$/;
const lettersOnly = maxCharTrimmed(100).matches(nameRegex, 'Letters only');
const requiredLettersAndNumbers = maxCharTrimmed(100)
  .matches(cityRegex, 'Letters and numbers only')
  .required();
const requiredLettersOnly = lettersOnly.required();

const nameValidation = field =>
  lettersOnly.test('first-or-last-name-is-optional', 'First name or Last name is required', function predicate(value) {
    const otherField = this.parent[field];
    return value.trim() || otherField;
  });

// eslint-disable-next-line max-len
const emailRegex = /^($)|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|""/;
const emailError = 'The email format is not correct';
const emailRequired = text
  .trim()
  .required()
  .matches(emailRegex, emailError);

const noNumbers = text.matches(/^([^0-9]*)$/g, 'No numbers allowed');
const stateValidation = isBilling =>
  noNumbers.when('shipping_country', sc => {
    if (['US', 'USA'].includes(sc))
      return text.required().matches(
        // eslint-disable-next-line max-len
        /^((A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/i,
        'Must be a US state'
      );

    return isBilling || ['CA', 'MX', 'IN'].includes(sc) ? maxCharTrimmed(100).required() : maxCharTrimmed(100);
  });

const getZipValidationRegex = country => {
  switch (country) {
    case 'CA':
      return { regex: /^[a-z]\d[a-z][ -]?\d[a-z]\d$/i, message: 'Invalid zip. Format: ANA NAN' };
    case 'BR':
      return { regex: /^\d{8}?$/, message: '8 digits' };
    case 'CN':
    case 'EC':
    case 'IN':
      return { regex: /^\d{6}?$/, message: '6 digits' };
    case 'MX':
      return { regex: /^\d{5}?$/, message: '5 digits' };
    case 'PT':
      return { regex: /^\d{4}(-\d{3})?$/, message: 'Invalid zip. Format: NNNN or NNNN-NNN' };
    case 'US':
      return { regex: /^\d{5}(-\d{4})?$/, message: '5 or 9 digits. Ex: 54321, 98765-4321' };
    default:
      return {};
  }
};

const zipValidation = isBilling =>
  text.when('shipping_country', (country, schema) => {
    const { regex, message } = getZipValidationRegex(country);
    if (regex) {
      return schema
        .trim()
        .required()
        .matches(regex, message);
    }
    return isBilling ? maxCharTrimmed(64).required() : maxCharTrimmed(64);
  });

const countryCodes = [...new Set(getCountries().map(country => `+${getCountryCallingCode(country)}`))].sort((a, b) =>
  a.length >= b.length ? -1 : 1
);

const phoneValidation = maxChar(50).test('is-country-code', 'Required', function isCountryCode(value) {
  const { shipping_country: shippingCountry } = this.parent;
  if (['US', 'USA'].includes(shippingCountry) || value?.length > countryCodes[0].length) return true;

  if (!value) return false;

  const matchedCode = countryCodes.find(code => code.startsWith(value) || value.startsWith(code));
  return value.length > matchedCode?.length;
});

const commonValidations = {
  first_name: nameValidation('last_name'),
  last_name: nameValidation('first_name'),
  email: yup
    .string()
    .trim()
    .matches(emailRegex, emailError),
  phone_number: phoneValidation,
  shipping_address1: maxCharTrimmed(100).required(),
  shipping_address2: maxCharTrimmed(100),
  shipping_city: requiredLettersAndNumbers,
  shipping_zip: zipValidation(),
  billing_zip: zipValidation(true),
  shipping_state: stateValidation(),
  billing_state: stateValidation(true),
  shipping_country: requiredLettersOnly,
  subject: yup
    .string()
    .trim()
    .required('Required'),
  message: yup
    .string()
    .trim()
    .required('Required')
    .min(3),
  name: requiredLettersOnly,
  name_company: requiredLettersAndNumbers
};

const getSchema = (fields = [], extraValidations = {}) =>
  yup.object().shape({ ..._.pick(commonValidations, fields), ...extraValidations });

const getErrorsDictionary = state => ({
  shipping_zip: `Invalid Zip Code for ${state || 'the state'}`,
  phone_number: 'Invalid phone number format'
});

const handleContactError = ({ data, setError, errorBehavior, state }) => {
  const possibleErrors = getErrorsDictionary(state);

  const errorsFound = Object.entries(possibleErrors).filter(([field, message]) => {
    if (data[field]) {
      setError(field, { message }, { shouldFocus: true });
    }
    return data[field];
  });

  if (errorsFound.length === 0) {
    errorBehavior();
  }
};

export {
  emailRegex,
  emailRequired,
  getSchema,
  noNumbers,
  text,
  handleContactError,
  requiredLettersOnly,
  requiredLettersAndNumbers,
  getZipValidationRegex,
  maxChar
};
