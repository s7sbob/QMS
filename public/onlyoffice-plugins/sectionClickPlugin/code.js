(function(window, undefined) {
  'use strict';

  // Section bookmark identifiers
  var SECTION_BOOKMARKS = [
    'section_purpose',
    'section_definitions',
    'section_scope',
    'section_procedures',
    'section_responsibilities',
    'section_safety',
    'section_critical',
    'section_references'
  ];

  // Section header patterns to detect
  var SECTION_PATTERNS = [
    { pattern: /^1\.\s*Purpose/i, bookmark: 'section_purpose' },
    { pattern: /^2\.\s*Definitions/i, bookmark: 'section_definitions' },
    { pattern: /^3\.\s*Scope/i, bookmark: 'section_scope' },
    { pattern: /^4\.\s*Procedures/i, bookmark: 'section_procedures' },
    { pattern: /^5\.\s*Responsibilities/i, bookmark: 'section_responsibilities' },
    { pattern: /^6\.\s*Safety/i, bookmark: 'section_safety' },
    { pattern: /^7\.\s*Critical/i, bookmark: 'section_critical' },
    { pattern: /^8\.\s*Reference/i, bookmark: 'section_references' },
    // Arabic patterns
    { pattern: /الغرض/i, bookmark: 'section_purpose' },
    { pattern: /التعريفات/i, bookmark: 'section_definitions' },
    { pattern: /النطاق/i, bookmark: 'section_scope' },
    { pattern: /الإجراءات/i, bookmark: 'section_procedures' },
    { pattern: /المسؤوليات/i, bookmark: 'section_responsibilities' },
    { pattern: /السلامة/i, bookmark: 'section_safety' },
    { pattern: /الحرجة/i, bookmark: 'section_critical' },
    { pattern: /المرجعية/i, bookmark: 'section_references' }
  ];

  var lastClickTime = 0;
  var lastClickText = '';
  var DOUBLE_CLICK_DELAY = 300; // ms

  window.Asc.plugin.init = function() {
    console.log('Section Click Plugin initialized');
  };

  window.Asc.plugin.button = function(id) {
    this.executeCommand('close', '');
  };

  // Detect section from selected text
  function detectSection(text) {
    if (!text) return null;

    var trimmedText = text.trim();

    for (var i = 0; i < SECTION_PATTERNS.length; i++) {
      if (SECTION_PATTERNS[i].pattern.test(trimmedText)) {
        return SECTION_PATTERNS[i].bookmark;
      }
    }

    return null;
  }

  // Send message to parent window
  function notifyParent(section) {
    try {
      window.parent.postMessage({
        type: 'SECTION_HEADER_CLICKED',
        section: section,
        timestamp: Date.now()
      }, '*');
      console.log('Section click notification sent:', section);
    } catch (e) {
      console.error('Error sending message to parent:', e);
    }
  }

  // Handle document ready
  window.Asc.plugin.onDocumentContentReady = function() {
    console.log('Document content ready');
  };

  // Handle selection change to detect double-clicks on headers
  window.Asc.plugin.attachEvent('onSelectionChanged', function() {
    var currentTime = Date.now();

    window.Asc.plugin.executeMethod('GetSelectedText', [], function(selectedText) {
      if (!selectedText) return;

      var section = detectSection(selectedText);

      if (section) {
        // Check for double-click
        if (selectedText === lastClickText &&
            (currentTime - lastClickTime) < DOUBLE_CLICK_DELAY) {
          // Double-click detected on section header
          notifyParent(section);
        }

        lastClickTime = currentTime;
        lastClickText = selectedText;
      }
    });
  });

  // Alternative: Listen for bookmark navigation
  window.Asc.plugin.attachEvent('onBookmarkClicked', function(bookmarkName) {
    if (SECTION_BOOKMARKS.indexOf(bookmarkName) !== -1) {
      notifyParent(bookmarkName);
    }
  });

})(window);
