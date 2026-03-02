/**
 * Webhooks config page: form validation, create, list, enabled toggle, test delivery, recent attempts.
 */
(function() {
  'use strict';

  var form = document.getElementById('webhookForm');
  var urlInput = document.getElementById('webhookUrl');
  var urlError = document.getElementById('urlError');
  var secretInput = document.getElementById('webhookSecret');
  var genSecretBtn = document.getElementById('webhookGenSecret');
  var copySecretBtn = document.getElementById('webhookCopySecret');
  var eventsContainer = document.getElementById('webhookEvents');
  var listEl = document.getElementById('webhookList');

  if (!form || !listEl) return;

  var api = window.CyberNews && window.CyberNews.webhooks;
  if (!api) return;

  function t(key) {
    var dict = window.CyberNews && window.CyberNews.getDict && window.CyberNews.getDict();
    return (dict && dict[key]) || key;
  }

  function validateUrl(value) {
    if (!value || typeof value !== 'string') return false;
    var trimmed = value.trim();
    if (trimmed !== value || trimmed.indexOf(' ') >= 0) return false;
    try {
      var u = new URL(trimmed);
      return u.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function showUrlError(msg) {
    if (urlError) {
      urlError.textContent = msg || '';
      urlError.hidden = !msg;
    }
    if (urlInput) urlInput.classList.toggle('error', !!msg);
  }

  function renderEventTypes() {
    if (!eventsContainer || !api.EVENT_TYPES) return;
    eventsContainer.innerHTML = '';
    api.EVENT_TYPES.forEach(function(ev) {
      var label = document.createElement('label');
      label.innerHTML = '<input type="checkbox" name="events" value="' + ev.id + '"> ' + ev.label;
      eventsContainer.appendChild(label);
    });
  }

  function renderList() {
    var list = api.load();
    if (!list.length) {
      listEl.innerHTML = '<div class="webhook-empty">' +
        '<p class="empty-title">' + t('webhooks.emptyTitle') + '</p>' +
        '<p class="empty-desc">' + t('webhooks.emptyDesc') + '</p></div>';
      return;
    }
    listEl.innerHTML = list.map(function(wh, idx) {
      var name = wh.name || wh.url || ('Webhook #' + (idx + 1));
      var status = wh.lastDelivery;
      var statusClass = status && status.success === false ? 'fail' : 'success';
      var statusText = !status ? '—' : (status.success ? 'OK ' + (status.at || '') : 'Fail ' + (status.at || ''));
      var attempts = (wh.attempts || []).slice(-10).reverse();
      var attemptsHtml = attempts.length ? '<ul class="webhook-attempt-list">' + attempts.map(function(a) {
        return '<li>' + (a.code || '—') + ' · ' + (a.latencyMs != null ? a.latencyMs + 'ms' : '—') + ' · ' + (a.at || '') + '</li>';
      }).join('') + '</ul>' : '<p class="form-hint">No attempts yet.</p>';
      return '<div class="webhook-card" data-id="' + idx + '">' +
        '<div class="webhook-card-header">' +
          '<div><span class="webhook-card-name">' + escapeHtml(name) + '</span><br><span class="webhook-card-url">' + escapeHtml(wh.url) + '</span></div>' +
          '<div class="webhook-card-actions">' +
            '<button type="button" class="webhook-toggle ' + (wh.enabled !== false ? 'on' : '') + '" aria-label="' + t('webhooks.enabled') + '" data-idx="' + idx + '"></button>' +
            '<span class="webhook-status ' + statusClass + '">' + t('webhooks.lastDelivery') + ': ' + escapeHtml(statusText) + '</span>' +
            '<button type="button" class="btn-test webhook-test-btn" data-idx="' + idx + '">' + t('webhooks.testDelivery') + '</button>' +
            '<button type="button" class="btn-attempts webhook-attempts-btn" data-idx="' + idx + '" aria-expanded="false">' + t('webhooks.viewAttempts') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="webhook-attempts webhook-attempts-panel" id="wh-attempts-' + idx + '" hidden>' +
          '<p class="webhook-attempts-title">' + t('webhooks.viewAttempts') + '</p>' + attemptsHtml +
        '</div>' +
        '</div>';
    }).join('');
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function toggleEnabled(idx) {
    var list = api.load();
    var item = list[parseInt(idx, 10)];
    if (!item) return;
    item.enabled = item.enabled === false;
    api.save(list);
    renderList();
    bindListActions();
  }

  function testDelivery(idx) {
    var list = api.load();
    var item = list[parseInt(idx, 10)];
    if (!item) return;
    var btn = document.querySelector('.webhook-test-btn[data-idx="' + idx + '"]');
    if (btn) btn.disabled = true;
    var start = Date.now();
    var samplePayload = { event: 'test', timestamp: new Date().toISOString(), schema: 'v1' };
    fetch(item.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(samplePayload)
    }).then(function(res) {
      var latency = Date.now() - start;
      var attempt = { code: res.status, latencyMs: latency, at: new Date().toISOString(), success: res.ok };
      item.lastDelivery = attempt;
      item.attempts = item.attempts || [];
      item.attempts.push(attempt);
      api.save(list);
      renderList();
      bindListActions();
      if (window.CyberNews && window.CyberNews.showToast) window.CyberNews.showToast(t('webhooks.testSuccess'));
    }).catch(function() {
      var latency = Date.now() - start;
      var attempt = { code: 0, latencyMs: latency, at: new Date().toISOString(), success: false };
      item.lastDelivery = attempt;
      item.attempts = item.attempts || [];
      item.attempts.push(attempt);
      api.save(list);
      renderList();
      bindListActions();
      if (window.CyberNews && window.CyberNews.showToast) window.CyberNews.showToast(t('webhooks.testFail'));
    }).then(function() {
      if (btn) btn.disabled = false;
    });
  }

  function bindListActions() {
    listEl.querySelectorAll('.webhook-toggle').forEach(function(btn) {
      btn.addEventListener('click', function() { toggleEnabled(btn.getAttribute('data-idx')); });
    });
    listEl.querySelectorAll('.webhook-test-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { testDelivery(btn.getAttribute('data-idx')); });
    });
    listEl.querySelectorAll('.webhook-attempts-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = btn.getAttribute('data-idx');
        var panel = document.getElementById('wh-attempts-' + idx);
        if (!panel) return;
        var open = !panel.hidden;
        panel.hidden = open;
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    });
  }

  genSecretBtn.addEventListener('click', function() {
    var secret = api.generateSecret();
    secretInput.value = secret;
    secretInput.removeAttribute('readonly');
    copySecretBtn.disabled = false;
  });

  copySecretBtn.addEventListener('click', function() {
    if (!secretInput.value) return;
    navigator.clipboard.writeText(secretInput.value).then(function() {
      copySecretBtn.textContent = t('webhooks.copied');
      setTimeout(function() { copySecretBtn.textContent = t('webhooks.copySecret'); }, 2000);
    });
  });

  urlInput.addEventListener('input', function() { showUrlError(''); });
  urlInput.addEventListener('blur', function() {
    if (urlInput.value.trim() && !validateUrl(urlInput.value)) showUrlError(t('webhooks.urlInvalid'));
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    showUrlError('');
    var url = urlInput.value.trim();
    if (!validateUrl(url)) {
      showUrlError(t('webhooks.urlInvalid'));
      urlInput.focus();
      return;
    }
    var name = document.getElementById('webhookName').value.trim();
    var secret = secretInput.value.trim();
    var events = [];
    eventsContainer.querySelectorAll('input[name="events"]:checked').forEach(function(cb) {
      events.push(cb.value);
    });
    var list = api.load();
    list.push({
      id: 'wh_' + Date.now(),
      name: name || null,
      url: url,
      secretMasked: secret ? '••••••••' : null,
      events: events.length ? events : api.EVENT_TYPES.map(function(e) { return e.id; }),
      enabled: true,
      attempts: [],
      lastDelivery: null
    });
    api.save(list);
    form.reset();
    secretInput.value = '';
    secretInput.setAttribute('readonly', 'readonly');
    copySecretBtn.disabled = true;
    renderList();
    bindListActions();
  });

  renderEventTypes();
  renderList();
  bindListActions();

  if (document.body.addEventListener) {
    document.body.addEventListener('cybernews:languageChange', function() {
      renderList();
      bindListActions();
    });
  }
})();
