const PHONE_BRAIN_CONFIG = Object.freeze({ backendUrl: '' });
function getBackendUrl() {
  var configured = typeof globalThis !== 'undefined' && globalThis.PHONE_BRAIN_CONFIG ? globalThis.PHONE_BRAIN_CONFIG : PHONE_BRAIN_CONFIG;
  return typeof configured.backendUrl === 'string' ? configured.backendUrl.trim() : '';
}
export { getBackendUrl };