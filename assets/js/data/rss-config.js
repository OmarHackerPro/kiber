/**
 * RSS feed config: private token, URL generation. Token rotation invalidates old link.
 */
(function(global) {
  var STORAGE_KEY = 'cybernews_rss_feed';
  var TOKEN_LENGTH = 24;

  function randomToken() {
    var a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var s = '';
    for (var i = 0; i < TOKEN_LENGTH; i++) s += a.charAt(Math.floor(Math.random() * a.length));
    return s;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { token: null, include: ['myStack', 'digest', 'saved'], filters: {} };
      return JSON.parse(raw);
    } catch (e) {
      return { token: null, include: ['myStack', 'digest', 'saved'], filters: {} };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getOrCreateToken() {
    var data = load();
    if (!data.token) {
      data.token = randomToken();
      save(data);
    }
    return data.token;
  }

  function regenerateToken() {
    var data = load();
    data.token = randomToken();
    save(data);
    return data.token;
  }

  function getFeedBaseUrl() {
    if (typeof window === 'undefined' || !window.location) return '';
    var origin = window.location.origin;
    var path = (window.location.pathname || '').replace(/\/[^/]*$/, '');
    return origin + (path || '') + '/feed/rss.xml';
  }

  function buildFeedUrl(token, params) {
    var base = getFeedBaseUrl();
    if (!base) return '';
    var q = new URLSearchParams();
    q.set('token', token);
    if (params && params.tags) q.set('tags', params.tags);
    if (params && params.sources) q.set('sources', params.sources);
    if (params && params.frequency) q.set('frequency', params.frequency);
    if (params && params.lang) q.set('lang', params.lang);
    return base + '?' + q.toString();
  }

  global.CyberNews = global.CyberNews || {};
  global.CyberNews.rssConfig = {
    load: load,
    save: save,
    getOrCreateToken: getOrCreateToken,
    regenerateToken: regenerateToken,
    buildFeedUrl: buildFeedUrl,
    getFeedBaseUrl: getFeedBaseUrl
  };
})(typeof window !== 'undefined' ? window : this);
