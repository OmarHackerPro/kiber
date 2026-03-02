/**
 * Category filter: Updates title and shows/hides sections based on URL category parameter
 */
(function() {
  'use strict';

  // Map URL category to display title
  var categoryTitleMap = {
    'breaking': 'Breaking',
    'threat-intel': 'Threat Intel',
    'malware': 'Malware',
    'apt': 'APT',
    'breaches': 'Breaches',
    'pentest': 'Pentest',
    'bug-bounty': 'Bug Bounty'
  };

  // Map URL category to section IDs that should be visible
  // The news grid (malware section) is always shown, but other category sections are hidden
  var categorySectionsMap = {
    'breaking': ['breaking', 'malware'], // Show breaking banner and news grid
    'threat-intel': ['threat-intel', 'malware'], // Show filters and news grid
    'malware': ['malware'], // Show only news grid
    'apt': ['apt', 'malware'], // Show APT section and news grid
    'breaches': ['breaches', 'malware'], // Show breaches section and news grid
    'pentest': ['pentest', 'malware'], // Show pentest section and news grid
    'bug-bounty': ['bug-bounty', 'malware'] // Show bug bounty section and news grid
  };

  function applyCategoryFilter() {
    var params = new URLSearchParams(location.search);
    var urlCategory = params.get('category');
    
    if (!urlCategory) {
      // No category specified, show all sections
      return;
    }

    // Update title
    var titleElement = document.getElementById('categoryTitle');
    if (titleElement) {
      var titleText = categoryTitleMap[urlCategory] || 'Latest Security News';
      titleElement.textContent = titleText;
      // Remove the data-i18n-key since we're setting text directly
      titleElement.removeAttribute('data-i18n-key');
    }

    // Show/hide sections
    var sectionsToShow = categorySectionsMap[urlCategory] || [];
    var allSections = ['breaking', 'threat-intel', 'malware', 'apt', 'breaches', 'pentest', 'bug-bounty', 'more'];
    
    allSections.forEach(function(sectionId) {
      var section = document.getElementById(sectionId);
      if (section) {
        if (sectionsToShow.indexOf(sectionId) !== -1) {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      }
    });
  }

  // Export function for external calls
  window.applyCategoryFilter = applyCategoryFilter;

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCategoryFilter);
  } else {
    // DOM already loaded
    applyCategoryFilter();
  }

  // Also run after a short delay to ensure content.html is injected
  setTimeout(applyCategoryFilter, 100);
})();

