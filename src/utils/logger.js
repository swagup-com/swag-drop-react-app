import * as log from 'loglevel';

const isServer = typeof window === 'undefined';

log.debug('loglevel level before setDefaultLevel: ', log.getLevel());
log.setDefaultLevel(process.env.REACT_APP_LOG_LEVEL || 1);
log.debug('loglevel level after setDefaultLevel: ', log.getLevel());

if (!isServer) window.log = log;
export default log;
