/**
 * My Stack & Digest preferences – persisted in localStorage.
 * Key: cybernews_preferences
 */
(function(global) {
  var STORAGE_KEY = 'cybernews_preferences';

  var DEFAULTS = {
    topics: [],
    sources: { reddit: true, twitter: true, hackernews: true, youtube: true, newsletters: true },
    contentTypes: { news: true, tutorials: true, opinions: true, research: true, tools: true },
    signalLevel: 50,
    digest: {
      frequency: 'weekly',
      delivery: ['in-app', 'email'],
      time: '08:00',
      depth: 'standard'
    }
  };

  var TOPIC_OPTIONS = [
    'AI', 'Cybersecurity', 'Startups', 'Finance',
    'DevTools', 'Cloud', 'Data', 'Design'
  ];

  var SOURCE_OPTIONS = [
    { id: 'reddit', label: 'Reddit' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'hackernews', label: 'Hacker News' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'newsletters', label: 'Newsletters' }
  ];

  var CONTENT_TYPE_OPTIONS = [
    { id: 'news', label: 'News' },
    { id: 'tutorials', label: 'Tutorials' },
    { id: 'opinions', label: 'Opinions' },
    { id: 'research', label: 'Research' },
    { id: 'tools', label: 'Tools' }
  ];

  var MAX_TOPICS = 5;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      var parsed = JSON.parse(raw);
      return merge(JSON.parse(JSON.stringify(DEFAULTS)), parsed);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  function merge(target, source) {
    for (var k in source) {
      if (source[k] !== null && typeof source[k] === 'object' && !Array.isArray(source[k])) {
        if (!target[k]) target[k] = Array.isArray(source[k]) ? [] : {};
        merge(target[k], source[k]);
      } else {
        target[k] = source[k];
      }
    }
    return target;
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  global.CyberNews = global.CyberNews || {};
  global.CyberNews.preferences = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULTS: DEFAULTS,
    TOPIC_OPTIONS: TOPIC_OPTIONS,
    SOURCE_OPTIONS: SOURCE_OPTIONS,
    CONTENT_TYPE_OPTIONS: CONTENT_TYPE_OPTIONS,
    MAX_TOPICS: MAX_TOPICS,
    load: load,
    save: save
  };
})(typeof window !== 'undefined' ? window : this);
