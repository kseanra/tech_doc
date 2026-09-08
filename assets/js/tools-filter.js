(function(){
  // Live filter for the /tools/ listing grid — mirrors the pattern used by
  // guide-filter.js on individual guide pages, generalized for grid-cards
  // and enriched with the same keyword synonyms the header search uses
  // (via window.SITE_INDEX from site-search.js), so "encode" also surfaces
  // "Base64 Encoder" even though that word isn't in the card's own text.
  var input = document.getElementById('toolsFilter');
  var resultCount = document.getElementById('toolsResultCount');
  var emptyState = document.getElementById('toolsEmptyState');
  var grid = document.getElementById('toolsGrid');
  if (!input || !grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.grid-card'));
  if (!cards.length) return;

  var keywordsByHref = {};
  if (window.SITE_INDEX){
    window.SITE_INDEX.forEach(function(item){ keywordsByHref[item.url] = item.keywords || ''; });
  }

  function stripHighlights(el){
    Array.prototype.slice.call(el.querySelectorAll('mark')).forEach(function(m){
      m.replaceWith(document.createTextNode(m.textContent));
    });
  }

  function highlight(el, term){
    if (!term) return;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);
    var re = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    nodes.forEach(function(node){
      if (!re.test(node.nodeValue)) return;
      re.lastIndex = 0;
      var span = document.createElement('span');
      span.innerHTML = node.nodeValue.replace(re, '<mark>$1</mark>');
      node.replaceWith(span);
    });
  }

  function applyFilter(){
    var term = input.value.trim().toLowerCase();
    var visible = 0;

    cards.forEach(function(card){
      stripHighlights(card);
      var href = card.getAttribute('href') || '';
      var haystack = (card.textContent + ' ' + (keywordsByHref[href] || '')).toLowerCase();
      var matches = !term || haystack.indexOf(term) !== -1;
      card.classList.toggle('hidden', !matches);
      if (matches){
        visible++;
        if (term) highlight(card, term);
      }
    });

    if (emptyState) emptyState.classList.toggle('hidden', !(term && visible === 0));
    if (resultCount) resultCount.textContent = term ? (visible + ' match' + (visible === 1 ? '' : 'es')) : '';
  }

  input.addEventListener('input', applyFilter);

  // keyboard shortcut: "/" focuses this filter, like the per-guide search does
  document.addEventListener('keydown', function(e){
    if (e.key === '/' && document.activeElement !== input){
      e.preventDefault();
      input.focus();
    }
  });

  applyFilter();
})();
