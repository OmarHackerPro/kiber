/**
 * Mock data for Search and Entity pages (Week 3).
 * Replace with API calls when backend is ready.
 */
(function(global) {
  var ENTITY_TYPES = { actor: 'Threat Actor', malware: 'Malware', cve: 'CVE', ioc: 'IOC', org: 'Organization', tool: 'Tool' };

  var clusters = [
    { id: 'c1', name: 'APT29', slug: 'apt', summary: 'Advanced persistent threat group linked to Russian intelligence. Focus on government and healthcare targets.', category: 'apt' },
    { id: 'c2', name: 'Ransomware Operations', slug: 'malware', summary: 'Ransomware families, TTPs, and mitigation guidance.', category: 'malware' },
    { id: 'c3', name: 'Zero-Day & CVEs', slug: 'threat-intel', summary: 'Critical vulnerabilities and zero-day exploitation in the wild.', category: 'threat-intel' },
    { id: 'c4', name: 'Supply Chain', slug: 'threat-intel', summary: 'Supply chain attacks and software compromise campaigns.', category: 'threat-intel' },
    { id: 'c5', name: 'Bug Bounty & Disclosures', slug: 'bug-bounty', summary: 'Program updates and coordinated disclosure.', category: 'bug-bounty' }
  ];

  var entities = [
    { id: 'e1', name: 'APT29', type: 'actor', slug: 'apt29', description: 'Nation-state threat group attributed to Russia. Known for targeting government, healthcare, and research with spear-phishing and supply chain attacks.', clusterIds: ['c1', 'c3'], relatedEntityIds: ['e2', 'e3'] },
    { id: 'e2', name: 'Cozy Bear', type: 'actor', slug: 'cozy-bear', description: 'Alternative name for APT29. Associated with SVR and numerous high-profile campaigns.', clusterIds: ['c1'], relatedEntityIds: ['e1', 'e4'] },
    { id: 'e3', name: 'CVE-2026-0001', type: 'cve', slug: 'cve-2026-0001', description: 'Critical zero-day in a widely used VPN client. Actively exploited in the wild. Patch available.', clusterIds: ['c3'], relatedEntityIds: ['e1', 'e5'] },
    { id: 'e4', name: 'LockBit 3.0', type: 'malware', slug: 'lockbit-3', description: 'Ransomware-as-a-service variant targeting enterprises. Known for double extortion and leak sites.', clusterIds: ['c2'], relatedEntityIds: ['e2', 'e6'] },
    { id: 'e5', name: 'Citrix Bleed', type: 'cve', slug: 'citrix-bleed', description: 'Critical vulnerability in Citrix NetScaler ADC/Gateway allowing session hijacking without credentials.', clusterIds: ['c3', 'c4'], relatedEntityIds: ['e3', 'e6'] },
    { id: 'e6', name: 'Black Basta', type: 'malware', slug: 'black-basta', description: 'Ransomware group targeting healthcare and critical infrastructure. Often follows initial access brokers.', clusterIds: ['c2'], relatedEntityIds: ['e4', 'e5'] },
    { id: 'e7', name: 'CISA Known Exploited', type: 'org', slug: 'cisa-kev', description: 'CISA Known Exploited Vulnerabilities catalog. Authoritative list of flaws that must be patched by federal agencies.', clusterIds: ['c3', 'c5'], relatedEntityIds: ['e3', 'e5'] },
    { id: 'e8', name: 'Mimikatz', type: 'tool', slug: 'mimikatz', description: 'Credential extraction tool widely used by red teams and threat actors for lateral movement.', clusterIds: ['c1', 'c2'], relatedEntityIds: ['e1', 'e4'] }
  ];

  function getEntityById(id) {
    return entities.find(function(e) { return e.id === id; });
  }

  function getClusterById(id) {
    return clusters.find(function(c) { return c.id === id; });
  }

  function getEntityBySlug(slug) {
    return entities.find(function(e) { return e.slug === slug; });
  }

  /** Simulated search: filters entities by name/description; supports delay and optional error. */
  function searchEntities(query, options) {
    options = options || {};
    var delay = options.delay !== undefined ? options.delay : 400;
    var fail = options.fail === true;

    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        if (fail) {
          reject(new Error('Search temporarily unavailable.'));
          return;
        }
        var q = (query || '').toLowerCase().trim();
        if (!q) {
          resolve({ results: [], query: query });
          return;
        }
        var results = entities.filter(function(e) {
          return e.name.toLowerCase().indexOf(q) >= 0 ||
            (e.description && e.description.toLowerCase().indexOf(q) >= 0) ||
            (e.type && e.type.toLowerCase().indexOf(q) >= 0);
        });
        resolve({ results: results, query: query });
      }, delay);
    });
  }

  function getEntityTypeLabel(type) {
    return ENTITY_TYPES[type] || type || 'Entity';
  }

  global.CyberNews = global.CyberNews || {};
  global.CyberNews.mockEntities = {
    entities: entities,
    clusters: clusters,
    getEntityById: getEntityById,
    getEntityBySlug: getEntityBySlug,
    getClusterById: getClusterById,
    searchEntities: searchEntities,
    getEntityTypeLabel: getEntityTypeLabel
  };
})(typeof window !== 'undefined' ? window : this);
