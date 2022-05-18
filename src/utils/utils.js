import { S3 } from '@aws-sdk/client-s3';
import { dayjs } from './dayjs';
import log from './logger';

const addBusinessDays = (date, days) => dayjs(date).addBusinessDays(days);

const addBusinessDaysToDate = (date, days) => addBusinessDays(date, days).toDate();

const dateAfterBusinessDays = (date, days, format = 'MM-DD-YYYY') => addBusinessDays(date, days).format(format);

const normalizeUSZip = value => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  if (onlyNums.length <= 5) {
    return onlyNums;
  }
  if (onlyNums.length <= 9) {
    return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5)}`;
  }
  return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 9)}`;
};

const zipCodeText = isInternational => (isInternational ? 'Postal Code' : 'Zip code');


const contentAppJSON = { 'Content-Type': 'application/json' };

const okAndLog = (actionName, okStatus, data) => {
  log.debug(`${actionName} Action - Exiting`);
  return { result: 'ok', status: okStatus, data };
};

const errorAndLog = (actionName, errorStatus, data) => {
  log.debug(`${actionName} Action - error: ${errorStatus}, data:`, data);
  return { result: 'error', status: errorStatus, data };
};

const joinFields = (fields, separator) => fields.filter(Boolean).join(separator);

const getMatchAddress = (address, recipient) => {
  switch (address) {
    case 'domestic':
      return recipient.shipping_country === 'US';
    case 'international':
      return recipient.shipping_country !== 'US';
    default:
      return true;
  }
};

const s3 = new S3({
  params: {
    Bucket: process.env.REACT_APP_AWS_UPLOAD_RESOURCES_BUCKET
  }
});

const lowerWithoutSpace = (text, divider = '-') => text.toLowerCase().replace(/ /g, divider);

const imageSrcSet = (imagePath, imageName, extension) => {
  const imgName = imageName
    ? imagePath + lowerWithoutSpace(imageName)
    : imagePath.substring(0, imagePath.lastIndexOf('/')) +
      lowerWithoutSpace(imagePath.substring(imagePath.lastIndexOf('/'), imagePath.lastIndexOf('.')));

  const extFromPath = imagePath.lastIndexOf('.') > 0 ? imagePath.substring(imagePath.lastIndexOf('.') + 1) : undefined;
  const extFromName =
    imageName && imageName.lastIndexOf('.') > 0 ? imageName.substring(imageName.lastIndexOf('.') + 1) : undefined;
  const ext = extension || extFromName || extFromPath || 'png';
  return `${imgName}.${ext} 1x, ${imgName}@2x.${ext} 2x, ${imgName}@3x.${ext} 3x`; // images can also be jpg: TODO
};

export {
  addBusinessDaysToDate,
  dateAfterBusinessDays,
  errorAndLog,
  getMatchAddress,
  contentAppJSON,
  s3,
  joinFields,
  normalizeUSZip,
  okAndLog,
  zipCodeText,
  imageSrcSet
};
