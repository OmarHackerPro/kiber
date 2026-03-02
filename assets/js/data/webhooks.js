/**
 * Webhook config: storage (localStorage), event types, retry defaults.
 * Replace with API when backend is ready.
 */
(function(global) {
  var STORAGE_KEY = 'cybernews_webhooks';
  var EVENT_TYPES = [
    { id: 'digest.created', label: 'digest.created' },
    { id: 'entity.updated', label: 'entity.updated' },
    { id: 'sharelink.accessed', label: 'sharelink.accessed' },
    { id: 'feed.updated', label: 'feed.updated' },
    { id: 'alert.critical', label: 'alert.critical' }
  ];
  var RETRY_DEFAULTS = { maxAttempts: 5, backoff: 'exponential', baseMs: 1000 };

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  function generateSecret() {
    var a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var s = '';
    for (var i = 0; i < 32; i++) s += a.charAt(Math.floor(Math.random() * a.length));
    return s;
  }

  global.CyberNews = global.CyberNews || {};
  global.CyberNews.webhooks = {
    STORAGE_KEY: STORAGE_KEY,
    EVENT_TYPES: EVENT_TYPES,
    RETRY_DEFAULTS: RETRY_DEFAULTS,
    load: load,
    save: save,
    generateSecret: generateSecret
  };
})(typeof window !== 'undefined' ? window : this);
