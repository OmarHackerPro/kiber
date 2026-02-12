/**
 * News grid: templates, filtering, infinite scroll (depends on data/translations, components/filters)
 */
(function() {
  'use strict';
  var translations = window.CyberNews && window.CyberNews.translations ? window.CyberNews.translations : { en: {} };

  var newsTemplates = [
    { id: 'card1', tags: ['CISA', 'Critical'], title: 'CISA Adds Critical VPN Flaw to Known Exploited Catalog', desc: 'Federal agencies must patch within two weeks as attacks escalate.', keywords: ['CVE-2026-0001', 'VPN', 'RCE', 'Zero-Day'], time: '15m', severity: 'high', type: 'advisory', category: 'research' },
    { id: 'card2', tags: ['Mandiant', 'Report'], title: 'APT41 Expands Supply Chain Attacks in 2026', desc: 'New report details evolving TTPs and infrastructure used by the group.', keywords: ['APT41', 'Supply Chain', 'Mandiant'], time: '3h 12m', severity: null, type: 'report', category: 'deep-dives' },
    { id: 'card3', tags: ['Ransomware'], title: 'New Ransomware Variant Targets Healthcare Sector', desc: 'Hospitals and clinics report encrypted systems and ransom demands.', keywords: ['Ransomware', 'Healthcare', 'Encryption'], time: '4h 25m', severity: 'high', type: 'news', category: 'research' },
    { id: 'card4', tags: ['CISA'], title: 'Emergency Directive: Patch VPN Zero-Day by Friday', desc: 'CISA orders federal agencies to apply vendor patches immediately.', keywords: ['CISA', 'Directive', 'VPN'], time: '5h', severity: null, type: 'advisory', category: 'research' },
    { id: 'card5', tags: ['Bug Bounty', 'Report'], title: 'Major Bug Bounty Program Doubles Critical Payouts', desc: 'Platform announces increased rewards for critical vulnerabilities.', keywords: ['Bug Bounty', 'Payouts', 'Critical'], time: '6h 30m', severity: null, type: 'news', category: 'beginner' },
    { id: 'card6', tags: ['APT29', 'Breaches'], title: 'APT29 Campaign Linked to Recent Government Breaches', desc: 'Intelligence agencies attribute multiple incidents to same actor.', keywords: ['APT29', 'Breach', 'Government'], time: '8h', severity: 'high', type: 'analysis', category: 'deep-dives' },
    { id: 'card7', tags: ['Malware', 'Critical'], title: 'Stealer Malware Spreads via Fake Software Updates', desc: 'Users tricked into installing trojanized installers from spoofed sites.', keywords: ['Malware', 'Stealer', 'Fake Updates'], time: '10h', severity: null, type: 'news', category: 'beginner' },
    { id: 'card8', tags: ['Pentest', 'Report'], title: 'Penetration Testing Framework Updated for Cloud', desc: 'New modules added for AWS, Azure, and GCP assessments.', keywords: ['Pentest', 'Cloud', 'AWS'], time: '12h', severity: null, type: 'report', category: 'deep-dives' },
    { id: 'card9', tags: ['Zero-Day', 'Critical'], title: 'Second Zero-Day in Same VPN Product Under Attack', desc: 'Researchers confirm exploitation of additional vulnerability.', keywords: ['Zero-Day', 'VPN', 'CVE'], time: '14h', severity: 'high', type: 'news', category: 'research' },
    { id: 'card10', tags: ['Threat Intel'], title: 'IOC Database Updated with Latest Campaign Signatures', desc: 'New indicators of compromise available for detection rules.', keywords: ['IOC', 'Threat Intel', 'Signatures'], time: '16h', severity: null, type: 'advisory', category: 'research' },
    { id: 'card11', tags: ['CISA', 'Report'], title: 'CISA Releases Advisory on RDP Hardening', desc: 'Best practices to reduce risk of RDP-based attacks.', keywords: ['CISA', 'RDP', 'Hardening'], time: '18h', severity: null, type: 'advisory', category: 'beginner' },
    { id: 'card12', tags: ['Breaches'], title: 'Retail Giant Discloses Third-Party Data Exposure', desc: 'Supplier breach may have exposed customer records.', keywords: ['Breach', 'Retail', 'Third-Party'], time: '20h', severity: 'high', type: 'news', category: 'dark-web' }
  ];

  var newsIndex = 0;
  var loadedNewsList = [];
  window.loadedNewsList = loadedNewsList;

  function getNextNewsItem() {
    var item = newsTemplates[newsIndex % newsTemplates.length];
    newsIndex++;
    return Object.assign({}, item);
  }

  function getSelectedFilterValue(dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    if (!dropdown) return null;
    var sel = dropdown.querySelector('.filter-dropdown-option.selected');
    return sel ? sel.getAttribute('data-value') : null;
  }

  var newsGrid = document.getElementById('newsGrid');
  var loadIndicator = document.getElementById('loadIndicator');

  function buildCard(data, index) {
    var lang = window.currentLanguage || document.documentElement.lang || 'en';
    var dict = translations[lang] || translations.en;
    var baseDict = translations.en;
    var title = data.title;
    var desc = data.desc;
    if (data.id) {
      var baseKey = 'news.' + data.id + '.';
      title = (dict[baseKey + 'title'] || baseDict[baseKey + 'title'] || title);
      desc = (dict[baseKey + 'desc'] || baseDict[baseKey + 'desc'] || desc);
    }
    var readLabel = (dict && dict['card.read']) || (baseDict && baseDict['card.read']) || 'Read';

    var card = document.createElement('article');
    card.className = 'news-card';
    card.setAttribute('data-news-id', data.id || '');
    card.style.animationDelay = (index % 12) * 0.03 + 's';
    var tagSpans = data.tags.map(function(t) {
      var c = t.toLowerCase().replace(/\s/g, '');
      return '<span class="card-tag ' + c + '">' + t + '</span>';
    }).join('');
    if (data.severity) tagSpans += '<span class="card-tag high"><i class="fas fa-exclamation-triangle"></i> High</span>';
    var keywordSpans = data.keywords.map(function(k, i) {
      var cl = i === 0 ? 'card-keyword highlight' : 'card-keyword';
      return '<span class="' + cl + '">' + k + '</span>';
    }).join('');
    card.innerHTML =
      '<div class="card-tags">' + tagSpans + '</div>' +
      '<h3 class="card-title">' + title + '</h3>' +
      '<p class="card-desc">' + desc + '</p>' +
      '<div class="card-keywords">' + keywordSpans + '</div>' +
      '<div class="card-meta"><span><i class="far fa-clock"></i> ' + data.time + '</span>' +
      '<button class="card-read" data-news-id="' + (data.id || '') + '">' + readLabel + '</button></div>';
    return card;
  }

  /** Map URL category param to data category or special filter. */
  function applyCategoryFromUrl() {
    var params = new URLSearchParams(location.search);
    var urlCategory = params.get('category');
    if (!urlCategory) {
      window.currentMoreCategory = null;
      window.breakingOnly = false;
      return;
    }
    if (urlCategory === 'breaking') {
      window.currentMoreCategory = null;
      window.breakingOnly = true;
      return;
    }
    window.breakingOnly = false;
    var map = {
      'threat-intel': 'deep-dives',
      'apt': 'deep-dives',
      'pentest': 'deep-dives',
      'malware': 'research',
      'breaches': 'dark-web',
      'bug-bounty': 'beginner'
    };
    window.currentMoreCategory = map[urlCategory] || null;
  }

  applyCategoryFromUrl();

  window.applyFilters = function() {
    var typeVals = window.selectedTypes && window.selectedTypes.length > 0 ? window.selectedTypes : null;
    var sourcesVal = getSelectedFilterValue('sourcesDropdown');
    var category = window.currentMoreCategory || null;
    var breakingOnly = window.breakingOnly === true;
    var filtered = loadedNewsList.filter(function(item) {
      if (breakingOnly) {
        if (item.severity !== 'high') return false;
      } else {
        if (typeVals && typeVals.length > 0) {
          if (typeVals.indexOf(item.type) === -1) return false;
        } else {
          if (item.type !== 'news') return false;
        }
        if (sourcesVal && sourcesVal !== 'all' && item.type !== sourcesVal) return false;
        if (category && item.category !== category) return false;
      }
      return true;
    });
    if (newsGrid) newsGrid.innerHTML = '';
    filtered.forEach(function(data, i) {
      if (newsGrid) newsGrid.appendChild(buildCard(data, i));
    });
    if (loadIndicator) loadIndicator.classList.toggle('hidden', filtered.length === 0);
  };

  function appendNews(count) {
    for (var i = 0; i < count; i++) loadedNewsList.push(getNextNewsItem());
    if (typeof window.applyFilters === 'function') window.applyFilters();
    else {
      loadedNewsList.forEach(function(data, i) {
        if (newsGrid) newsGrid.appendChild(buildCard(data, i));
      });
    }
  }

  appendNews(6);

  var loading = false;
  var loadMoreThreshold = 400;
  function maybeLoadMore() {
    if (loading || !loadIndicator) return;
    var rect = loadIndicator.getBoundingClientRect();
    if (rect.top < window.innerHeight + loadMoreThreshold) {
      loading = true;
      loadIndicator.classList.remove('hidden');
      setTimeout(function() {
        appendNews(3);
        loadIndicator.classList.add('hidden');
        loading = false;
      }, 800);
    }
  }
  window.addEventListener('scroll', function() { maybeLoadMore(); }, { passive: true });
  maybeLoadMore();
})();
