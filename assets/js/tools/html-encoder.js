(function(){
  const input = document.getElementById('htmlInput');
  const output = document.getElementById('htmlOutput');
  const errorBox = document.getElementById('htmlError');
  const nonAsciiCheck = document.getElementById('htmlNonAscii');
  const btnEncode = document.getElementById('btnEncode');
  const btnDecode = document.getElementById('btnDecode');
  const btnSwap = document.getElementById('btnSwap');
  const btnCopy = document.getElementById('btnCopy');
  const btnClear = document.getElementById('btnClear');

  const NAMED = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
  const NON_ASCII_RE = new RegExp('[^\\x00-\\x7F]', 'g');

  function clearError(){ errorBox.classList.remove('visible'); }
  function showError(msg){
    errorBox.textContent = msg;
    errorBox.classList.add('visible');
    output.textContent = '';
  }

  function encode(){
    clearError();
    const text = input.value;
    if (!text) { showError('Paste some text or HTML first.'); return; }
    let result = text.replace(/[&<>"']/g, ch => NAMED[ch]);
    if (nonAsciiCheck.checked) {
      result = result.replace(NON_ASCII_RE, ch => '&#' + ch.charCodeAt(0) + ';');
    }
    output.textContent = result;
  }

  function decode(){
    clearError();
    const text = input.value.trim();
    if (!text) { showError('Paste some encoded HTML first.'); return; }
    // A detached <textarea> only ever treats its innerHTML as text content on
    // read-back — it never executes scripts or renders markup — which makes
    // it the safe, standard way to resolve named and numeric entities.
    const ta = document.createElement('textarea');
    ta.innerHTML = text;
    output.textContent = ta.value;
  }

  btnEncode.addEventListener('click', encode);
  btnDecode.addEventListener('click', decode);
  btnSwap.addEventListener('click', () => {
    const tmp = input.value;
    input.value = output.textContent;
    output.textContent = tmp;
    clearError();
  });
  btnClear.addEventListener('click', () => {
    input.value = '';
    output.textContent = '';
    clearError();
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
