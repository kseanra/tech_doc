(function(){
  const input = document.getElementById('xmlInput');
  const output = document.getElementById('xmlOutput');
  const errorBox = document.getElementById('xmlError');
  const okBox = document.getElementById('xmlOk');
  const btnFormat = document.getElementById('btnFormat');
  const btnMinify = document.getElementById('btnMinify');
  const btnCopy = document.getElementById('btnCopy');
  const btnClear = document.getElementById('btnClear');

  function showError(msg){
    errorBox.textContent = msg;
    errorBox.classList.add('visible');
    okBox.classList.remove('visible');
    output.textContent = '';
  }
  function showOk(msg){
    okBox.textContent = msg;
    okBox.classList.add('visible');
    errorBox.classList.remove('visible');
  }

  function assertWellFormed(xml){
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const err = doc.querySelector('parsererror');
    if (err) {
      const firstLine = err.textContent.trim().split('\n')[0];
      throw new Error(firstLine || 'Not well-formed XML.');
    }
    return doc;
  }

  function prettyPrint(xml){
    // String-based re-indent: split on tag boundaries, then indent/outdent
    // by tracking opening vs. closing tags line by line. This preserves the
    // document's own formatting choices (self-closing tags, attribute
    // order) rather than re-serializing through the DOM.
    const withBreaks = xml.replace(/>\s*</g, '>\n<').trim();
    let pad = 0;
    const PAD = '  ';
    return withBreaks.split('\n').map(line => {
      line = line.trim();
      if (!line) return null;
      let indentThisLine = 0;
      if (/^<\?/.test(line) || /^<!--/.test(line) || /\/>\s*$/.test(line) || /^<[^>]+>.*<\/[^>]+>$/.test(line)) {
        indentThisLine = 0;
      } else if (/^<\//.test(line)) {
        pad = Math.max(0, pad - 1);
        indentThisLine = 0;
      } else if (/^<[^!?]/.test(line)) {
        indentThisLine = 1;
      }
      const out = PAD.repeat(pad) + line;
      pad += indentThisLine;
      return out;
    }).filter(l => l !== null).join('\n');
  }

  function format(){
    const raw = input.value.trim();
    if (!raw) { showError('Paste an XML document first.'); return; }
    try {
      assertWellFormed(raw);
      output.textContent = prettyPrint(raw);
      showOk('Well-formed XML.');
    } catch (err) {
      showError(err.message);
    }
  }

  function minify(){
    const raw = input.value.trim();
    if (!raw) { showError('Paste an XML document first.'); return; }
    try {
      assertWellFormed(raw);
      output.textContent = raw.replace(/>\s+</g, '><').trim();
      showOk('Well-formed XML.');
    } catch (err) {
      showError(err.message);
    }
  }

  btnFormat.addEventListener('click', format);
  btnMinify.addEventListener('click', minify);
  btnClear.addEventListener('click', () => {
    input.value = '';
    output.textContent = '';
    errorBox.classList.remove('visible');
    okBox.classList.remove('visible');
    input.focus();
  });
  btnCopy.addEventListener('click', () => {
    if (!output.textContent) return;
    navigator.clipboard.writeText(output.textContent).then(() => {
      const original = btnCopy.textContent;
      btnCopy.textContent = 'copied';
      setTimeout(() => { btnCopy.textContent = original; }, 1400);
    });
  });
})();
