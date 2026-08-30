function unavailable() {
  return { supported: false, message: 'Unavailable in this browser' };
}

let installPrompt = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    installPrompt = event;
  });
}

const Device = {
  getBatteryStatus: async function () {
    if (typeof navigator === 'undefined' || typeof navigator.getBattery !== 'function') return unavailable();
    try {
      var battery = await navigator.getBattery();
      return { supported: true, level: battery.level * 100, charging: battery.charging };
    } catch (error) {
      return unavailable();
    }
  },
  watchBattery: async function (callback) {
    if (typeof navigator === 'undefined' || typeof navigator.getBattery !== 'function') return null;
    try {
      var battery = await navigator.getBattery();
      var update = function () { callback({ supported: true, level: battery.level * 100, charging: battery.charging }); };
      battery.addEventListener('levelchange', update);
      battery.addEventListener('chargingchange', update);
      update();
      return function () {
        battery.removeEventListener('levelchange', update);
        battery.removeEventListener('chargingchange', update);
      };
    } catch (error) {
      return null;
    }
  },
  vibrate: function (pattern) {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return unavailable();
    return { supported: navigator.vibrate(pattern || 'short'), success: true };
  },
  copyText: async function (text) {
    if (typeof navigator === 'undefined' || !navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') return unavailable();
    try {
      await navigator.clipboard.writeText(String(text));
      return { supported: true, success: true };
    } catch (error) {
      return { supported: true, success: false, message: 'Clipboard permission was denied' };
    }
  },
  share: async function (data) {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return unavailable();
    try {
      await navigator.share(data || {});
      return { supported: true, success: true };
    } catch (error) {
      return { supported: true, success: false, message: 'Share was cancelled or unavailable' };
    }
  },
  requestFullscreen: async function (element) {
    var target = element || (typeof document !== 'undefined' ? document.documentElement : null);
    if (!target || typeof target.requestFullscreen !== 'function') return unavailable();
    try {
      await target.requestFullscreen();
      return { supported: true, success: true };
    } catch (error) {
      return { supported: true, success: false, message: 'Fullscreen permission was denied' };
    }
  },
  exitFullscreen: async function () {
    if (typeof document === 'undefined' || typeof document.exitFullscreen !== 'function') return unavailable();
    try {
      await document.exitFullscreen();
      return { supported: true, success: true };
    } catch (error) {
      return { supported: true, success: false, message: 'Fullscreen could not be exited' };
    }
  },
  getOnlineStatus: function () { return typeof navigator === 'undefined' ? unavailable() : { supported: true, online: navigator.onLine }; },
  onConnectivityChange: function (callback) {
    if (typeof window === 'undefined') return function () {};
    var online = function () { callback({ supported: true, online: true }); };
    var offline = function () { callback({ supported: true, online: false }); };
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return function () {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  },
  canInstallPWA: function () { return Boolean(installPrompt); },
  installPWA: async function () {
    if (!installPrompt) return unavailable();
    var prompt = installPrompt;
    installPrompt = null;
    await prompt.prompt();
    var choice = await prompt.userChoice;
    return { supported: true, accepted: choice.outcome === 'accepted', outcome: choice.outcome };
  },
  getOrientation: function () {
    if (typeof screen === 'undefined' || !screen.orientation) return unavailable();
    return { supported: true, type: screen.orientation.type, angle: screen.orientation.angle };
  },
  lockOrientation: async function (orientation) {
    if (typeof screen === 'undefined' || !screen.orientation || typeof screen.orientation.lock !== 'function') return unavailable();
    try {
      await screen.orientation.lock(orientation || 'portrait');
      return { supported: true, success: true };
    } catch (error) {
      return { supported: true, success: false, message: 'Screen orientation lock was denied' };
    }
  },
  unlockOrientation: function () {
    if (typeof screen === 'undefined' || !screen.orientation || typeof screen.orientation.unlock !== 'function') return unavailable();
    screen.orientation.unlock();
    return { supported: true, success: true };
  }
};

export { Device };