/**
 * Preferences page: My Stack (topics, sources, content types, signal) + Digest settings.
 * Persists via CyberNews.preferences; shows confirmation on save.
 */
(function() {
  var TOPIC_MAX = 5;
  var data = null;

  function get(id) { return document.getElementById(id); }

  function getDict() {
    var lang = window.currentLanguage || document.documentElement.lang || 'en';
    var t = window.CyberNews && window.CyberNews.translations;
    return (t && t[lang]) ? t[lang] : (t && t.en) ? t.en : {};
  }

  function topicKey(t) {
    return t.toLowerCase().replace(/\s+/g, '');
  }

  function loadFromStorage() {
    var prefs = window.CyberNews && window.CyberNews.preferences;
    if (!prefs) return;
    data = prefs.load();
  }

  function renderTopics() {
    var container = get('prefTopicsGrid');
    if (!container || !data) return;
    var dict = getDict();
    var opts = (window.CyberNews && window.CyberNews.preferences.TOPIC_OPTIONS) || [];
    var selected = data.topics || [];
    var atMax = selected.length >= (window.CyberNews && window.CyberNews.preferences.MAX_TOPICS) || selected.length >= TOPIC_MAX;
    container.innerHTML = opts.map(function(t) {
      var sel = selected.indexOf(t) >= 0;
      var disabled = !sel && atMax;
      var label = dict['pref.topic.' + topicKey(t)] || t;
      return '<button type="button" class="pref-chip' + (sel ? ' selected' : '') + (disabled ? ' disabled' : '') + '" data-topic="' + escapeAttr(t) + '">' + escapeHtml(label) + '</button>';
    }).join('');
    var hint = get('prefTopicsHint');
    if (hint) {
      var n = selected.length;
      var hintKey = n === 0 ? 'pref.topicsHint' : 'pref.topicsHintSelected';
      var hintStr = dict[hintKey];
      if (hintStr) hint.textContent = n > 0 ? hintStr.replace('{n}', n) : hintStr;
      else hint.textContent = n === 0 ? 'Select up to 5 topics. Click to toggle.' : (n + ' of 5 selected. Click to toggle.');
    }
  }

  function bindTopicsClick() {
    var container = get('prefTopicsGrid');
    if (!container || !data) return;
    container.addEventListener('click', function(e) {
      var chip = e.target.closest('.pref-chip');
      if (!chip || chip.classList.contains('disabled')) return;
      var t = chip.getAttribute('data-topic');
      var idx = (data.topics || []).indexOf(t);
      if (idx >= 0) {
        data.topics.splice(idx, 1);
      } else {
        if ((data.topics || []).length >= TOPIC_MAX) return;
        data.topics = data.topics || [];
        data.topics.push(t);
      }
      renderTopics();
    });
  }

  function escapeAttr(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML.replace(/"/g, '&quot;');
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function renderSources() {
    var container = get('prefSourcesList');
    if (!container || !data) return;
    var dict = getDict();
    var opts = (window.CyberNews && window.CyberNews.preferences.SOURCE_OPTIONS) || [];
    var sources = data.sources || {};
    container.innerHTML = opts.map(function(o) {
      var on = sources[o.id] !== false;
      var label = dict['pref.source.' + o.id] || o.label;
      return '<div class="pref-toggle-row"><span class="pref-toggle-label">' + escapeHtml(label) + '</span><button type="button" class="pref-toggle' + (on ? ' on' : '') + '" data-source="' + escapeAttr(o.id) + '" aria-pressed="' + on + '"></button></div>';
    }).join('');
  }

  function bindSourcesClick() {
    var container = get('prefSourcesList');
    if (!container || !data) return;
    container.addEventListener('click', function(e) {
      var btn = e.target.closest('.pref-toggle');
      if (!btn) return;
      var id = btn.getAttribute('data-source');
      data.sources = data.sources || {};
      data.sources[id] = !data.sources[id];
      btn.classList.toggle('on', data.sources[id]);
      btn.setAttribute('aria-pressed', data.sources[id]);
    });
  }

  function renderContentTypes() {
    var container = get('prefContentTypesList');
    if (!container || !data) return;
    var dict = getDict();
    var opts = (window.CyberNews && window.CyberNews.preferences.CONTENT_TYPE_OPTIONS) || [];
    var ct = data.contentTypes || {};
    container.innerHTML = opts.map(function(o) {
      var checked = ct[o.id] !== false;
      var label = dict['pref.ct.' + o.id] || o.label;
      return '<label class="pref-checkbox-row"><input type="checkbox" class="pref-ct-check" data-ct="' + escapeAttr(o.id) + '"' + (checked ? ' checked' : '') + '><span>' + escapeHtml(label) + '</span></label>';
    }).join('');
  }

  function bindContentTypesChange() {
    var container = get('prefContentTypesList');
    if (!container || !data) return;
    container.addEventListener('change', function(e) {
      var cb = e.target.closest('.pref-ct-check');
      if (!cb) return;
      var id = cb.getAttribute('data-ct');
      data.contentTypes = data.contentTypes || {};
      data.contentTypes[id] = cb.checked;
    });
  }

  function renderSignal() {
    var slider = get('prefSignalSlider');
    if (!slider || !data) return;
    var v = data.signalLevel != null ? data.signalLevel : 50;
    slider.value = v;
    slider.addEventListener('input', function() {
      data.signalLevel = parseInt(slider.value, 10);
    });
  }

  function renderDigest() {
    var freq = (data.digest || {}).frequency || 'weekly';
    var delivery = (data.digest || {}).delivery || ['in-app', 'email'];
    var time = (data.digest || {}).time || '08:00';
    var depth = (data.digest || {}).depth || 'standard';

    var freqBtns = document.querySelectorAll('.pref-frequency-btn');
    freqBtns.forEach(function(btn) {
      var v = btn.getAttribute('data-frequency');
      btn.classList.toggle('active', v === freq);
      btn.addEventListener('click', function() {
        data.digest = data.digest || {};
        data.digest.frequency = v;
        renderDigest();
        toggleDigestDependent(v !== 'off');
      });
    });

    var inApp = get('prefDeliveryInApp');
    var email = get('prefDeliveryEmail');
    function updateDelivery() {
      data.digest = data.digest || {};
      data.digest.delivery = [];
      if (inApp && inApp.checked) data.digest.delivery.push('in-app');
      if (email && email.checked) data.digest.delivery.push('email');
    }
    if (inApp) {
      inApp.checked = delivery.indexOf('in-app') >= 0;
      inApp.addEventListener('change', updateDelivery);
    }
    if (email) {
      email.checked = delivery.indexOf('email') >= 0;
      email.addEventListener('change', updateDelivery);
    }

    var timeInput = get('prefDigestTime');
    if (timeInput) {
      timeInput.value = time;
      timeInput.addEventListener('change', function() {
        data.digest = data.digest || {};
        data.digest.time = timeInput.value || '08:00';
      });
    }

    var depthOpts = document.querySelectorAll('.pref-depth-option');
    depthOpts.forEach(function(el) {
      var d = el.getAttribute('data-depth');
      el.classList.toggle('selected', d === depth);
      el.addEventListener('click', function() {
        data.digest = data.digest || {};
        data.digest.depth = d;
        depthOpts.forEach(function(o) { o.classList.remove('selected'); });
        el.classList.add('selected');
      });
    });

    toggleDigestDependent(freq !== 'off');
  }

  function toggleDigestDependent(enabled) {
    var wrap = document.getElementById('prefDigestDependent');
    if (wrap) {
      wrap.classList.toggle('disabled', !enabled);
    }
  }

  function bindSave() {
    var btn = get('prefSaveBtn');
    var confirm = get('prefConfirm');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var prefs = window.CyberNews && window.CyberNews.preferences;
      if (!prefs || !data) return;
      if (prefs.save(data)) {
        if (confirm) {
          confirm.classList.add('visible');
          confirm.textContent = getDict()['pref.updated'] || 'Preferences updated';
          setTimeout(function() {
            confirm.classList.remove('visible');
          }, 3000);
        }
      }
    });
  }

  function init() {
    loadFromStorage();
    renderTopics();
    bindTopicsClick();
    renderSources();
    bindSourcesClick();
    renderContentTypes();
    bindContentTypesChange();
    renderSignal();
    renderDigest();
    bindSave();
    window.addEventListener('cybernews:languageChange', function() {
      renderTopics();
      renderSources();
      renderContentTypes();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
