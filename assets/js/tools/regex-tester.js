(function(){
  var patternInput = document.getElementById('regexPattern');
  var testInput = document.getElementById('regexTestString');
  var flagG = document.getElementById('flagG');
  var flagI = document.getElementById('flagI');
  var flagM = document.getElementById('flagM');
  var flagS = document.getElementById('flagS');
  var flagU = document.getElementById('flagU');
  var errorBox = document.getElementById('regexError');
  var highlighted = document.getElementById('regexHighlighted');
  var matchList = document.getElementById('regexMatchList');
  var countTop = document.getElementById('regexMatchCount');
  var countBottom = document.getElementById('regexMatchListCount');
  var btnClear = document.getElementById('btnClear');
  var btnCopyMatches = document.getElementById('btnCopyMatches');

  if (!patternInput || !testInput) return;

  var MAX_TEXT_LENGTH = 500000; // characters actually run through the engine
  var TIMEOUT_MS = 1500;        // worker is killed if it hasn't answered by then
  var DEBOUNCE_MS = 150;

  // Self-contained on purpose (no references to outer closure variables) so it
  // can be shipped into a Worker via Function.prototype.toString() below, and
  // reused directly as the no-Worker fallback.
  function runMatches(pattern, flags, text){
    var MAX_MATCHES = 2000; // hard cap so a pathological pattern can't OOM the tab
    var re;
    try { re = new RegExp(pattern, flags); }
    catch (err){ return {error: err.message}; }

    var matches = [];
    var truncated = false;

    function pack(m){
      var groups = [];
      for (var i = 1; i < m.length; i++) groups.push(m[i] === undefined ? null : m[i]);
      var named = null;
      if (m.groups){
        named = {};
        for (var k in m.groups) named[k] = m.groups[k] === undefined ? null : m.groups[k];
      }
      return {index: m.index, match: m[0], groups: groups, named: named};
    }

    if (flags.indexOf('g') === -1){
      var single = re.exec(text);
      if (single) matches.push(pack(single));
    } else {
      var m, guard = 0;
      while ((m = re.exec(text)) !== null){
        matches.push(pack(m));
        if (m[0].length === 0) re.lastIndex++; // avoid an infinite loop on zero-length matches
        guard++;
        if (matches.length >= MAX_MATCHES || guard > 500000){ truncated = true; break; }
      }
    }
    return {matches: matches, truncated: truncated};
  }

  var worker = null;
  var workerUrl = null;
  var workerBroken = (typeof Worker === 'undefined');

  if (!workerBroken){
    try {
      var src = 'var runMatches = ' + runMatches.toString() + ';\n' +
        'self.onmessage = function(e){ self.postMessage(runMatches(e.data.pattern, e.data.flags, e.data.text)); };';
      workerUrl = URL.createObjectURL(new Blob([src], {type: 'application/javascript'}));
    } catch (err){
      workerBroken = true;
    }
  }

  var timeoutId = null;
  var debounceId = null;
  var lastMatches = [];
  var currentText = '';

  function showError(msg){
    errorBox.textContent = msg;
    errorBox.classList.add('visible');
  }
  function clearError(){
    errorBox.textContent = '';
    errorBox.classList.remove('visible');
  }

  function currentFlags(){
    var f = '';
    if (flagG.checked) f += 'g';
    if (flagI.checked) f += 'i';
    if (flagM.checked) f += 'm';
    if (flagS.checked) f += 's';
    if (flagU.checked) f += 'u';
    return f;
  }

  function escapeHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function renderHighlight(text, matches){
    if (!matches.length){ highlighted.textContent = text; return; }
    var html = '';
    var pos = 0;
    matches.forEach(function(m){
      if (m.index < pos) return; // safety: ignore anything out of order
      html += escapeHtml(text.slice(pos, m.index));
      html += m.match.length ? ('<mark>' + escapeHtml(m.match) + '</mark>') : '<mark>&nbsp;</mark>';
      pos = m.index + m.match.length;
    });
    html += escapeHtml(text.slice(pos));
    highlighted.innerHTML = html;
  }

  function renderMatchList(matches, truncated){
    if (!matches.length){
      matchList.innerHTML = '<div class="match-empty">No matches.</div>';
      return;
    }
    var shown = matches.slice(0, 500);
    matchList.innerHTML = shown.map(function(m, i){
      var groupsHtml = '';
      if (m.groups.length){
        groupsHtml = '<div class="match-groups">' + m.groups.map(function(g, gi){
          return 'group ' + (gi + 1) + ': <code>' + (g === null ? '(no match)' : escapeHtml(g)) + '</code>';
        }).join(' &middot; ') + '</div>';
      }
      if (m.named){
        var namedParts = Object.keys(m.named).map(function(k){
          return escapeHtml(k) + ': <code>' + (m.named[k] === null ? '(no match)' : escapeHtml(m.named[k])) + '</code>';
        });
        if (namedParts.length){
          groupsHtml += '<div class="match-groups">' + namedParts.join(' &middot; ') + '</div>';
        }
      }
      return (
        '<div class="match-item">' +
          '<span class="match-idx">#' + (i + 1) + '</span>' +
          '<code class="match-text">' + (m.match.length ? escapeHtml(m.match) : '(empty match)') + '</code>' +
          '<span class="match-pos">at index ' + m.index + '</span>' +
          groupsHtml +
        '</div>'
      );
    }).join('');
    if (matches.length > shown.length || truncated){
      matchList.innerHTML += '<div class="match-empty">Showing the first ' + shown.length + ' matches' +
        (truncated ? ' (the engine stopped early — refine your pattern)' : ' of ' + matches.length) + '.</div>';
    }
  }

  function setCount(matches, truncated){
    var text = !patternInput.value ? '' :
      (matches.length ? (matches.length + (truncated ? '+' : '') + ' match' + (matches.length === 1 && !truncated ? '' : 'es')) : 'no matches');
    countTop.textContent = text;
    if (countBottom) countBottom.textContent = text;
  }

  function handleResult(result){
    if (result.error){
      showError('Invalid regular expression: ' + result.error);
      highlighted.textContent = currentText;
      matchList.innerHTML = '';
      setCount([], false);
      lastMatches = [];
      return;
    }
    clearError();
    lastMatches = result.matches;
    renderHighlight(currentText, result.matches);
    renderMatchList(result.matches, result.truncated);
    setCount(result.matches, result.truncated);
  }

  function runNow(){
    clearTimeout(timeoutId);
    var pattern = patternInput.value;
    var rawText = testInput.value;
    currentText = rawText.length > MAX_TEXT_LENGTH ? rawText.slice(0, MAX_TEXT_LENGTH) : rawText;

    if (!pattern){
      clearError();
      highlighted.textContent = currentText;
      matchList.innerHTML = '';
      setCount([], false);
      lastMatches = [];
      return;
    }
    if (!currentText){
      clearError();
      highlighted.textContent = '';
      matchList.innerHTML = '<div class="match-empty">Nothing to match against yet — paste some text above.</div>';
      setCount([], false);
      lastMatches = [];
      return;
    }

    var flags = currentFlags();

    if (workerBroken){
      handleResult(runMatches(pattern, flags, currentText));
      return;
    }

    if (worker) worker.terminate();
    worker = new Worker(workerUrl);
    worker.onmessage = function(e){
      clearTimeout(timeoutId);
      handleResult(e.data);
    };
    worker.onerror = function(){
      clearTimeout(timeoutId);
      workerBroken = true;
      handleResult(runMatches(pattern, flags, currentText));
    };
    timeoutId = setTimeout(function(){
      if (worker) worker.terminate();
      worker = null;
      showError('This pattern took too long to evaluate against the current text (possible catastrophic backtracking). Try simplifying it.');
      matchList.innerHTML = '';
      setCount([], false);
    }, TIMEOUT_MS);
    worker.postMessage({pattern: pattern, flags: flags, text: currentText});
  }

  function scheduleRun(){
    clearTimeout(debounceId);
    debounceId = setTimeout(runNow, DEBOUNCE_MS);
  }

  patternInput.addEventListener('input', scheduleRun);
  testInput.addEventListener('input', scheduleRun);
  [flagG, flagI, flagM, flagS, flagU].forEach(function(cb){
    cb.addEventListener('change', runNow);
  });

  if (btnClear) btnClear.addEventListener('click', function(){
    patternInput.value = '';
    testInput.value = '';
    flagG.checked = true;
    flagI.checked = false;
    flagM.checked = false;
    flagS.checked = false;
    flagU.checked = false;
    clearError();
    highlighted.textContent = '';
    matchList.innerHTML = '';
    setCount([], false);
    lastMatches = [];
    patternInput.focus();
  });

  if (btnCopyMatches) btnCopyMatches.addEventListener('click', function(){
    if (!lastMatches.length) return;
    navigator.clipboard.writeText(JSON.stringify(lastMatches, null, 2)).then(function(){
      var original = btnCopyMatches.textContent;
      btnCopyMatches.textContent = 'copied';
      setTimeout(function(){ btnCopyMatches.textContent = original; }, 1400);
    });
  });

  runNow();
})();
