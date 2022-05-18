
const shipmentStatus = {
  pendingProduction: 'Pending Production',
  scheduled: 'Scheduled',
  onItsWay: 'On Its Way',
  delivered: 'Delivered',
  failure: 'Failure',
  cancelled: 'Cancelled',
  invalidAddress: 'Invalid Address',
  returnToSender: 'Return To Sender'
};

const pendingMockup = 'Pending Mockup';
const inProgress = 'In Progress';
const designReady = 'Design Ready';
const changesRequested = 'Changes Requested';
const productionRequest = 'Production Request';
const productionReady = 'Production Ready';
const approved = 'Approved';

const productStatus = {
  pendingMockup,
  inProgress,
  designReady,
  changesRequested,
  productionRequest,
  productionReady,
  approved,
  inactive: 'Inactive'
};

const redactedText = '** redacted **';


export { shipmentStatus, productStatus, redactedText };