(function(){
  const input = document.getElementById('reInput');
  const output = document.getElementById('reOutput');
  const errorBox = document.getElementById('reError');
  const slashCheck = document.getElementById('reEscapeSlash');
  const btnEscape = document.getElementById('btnEscape');
  const btnCopy = document.getElementById('btnCopy');
  const btnClear = document.getElementById('btnClear');

  function clearError(){ errorBox.classList.remove('visible'); }
  function showError(msg){
    errorBox.textContent = msg;
    errorBox.classList.add('visible');
    output.textContent = '';
  }

  function escapeForRegex(str){
    let escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (slashCheck.checked) escaped = escaped.replace(/\//g, '\\/');
    return escaped;
  }

  function escapeNow(){
    clearError();
    const text = input.value;
    if (!text) { showError('Paste a literal string first.'); return; }
    const escaped = escapeForRegex(text);
    output.textContent = escaped;
  }

  btnEscape.addEventListener('click', escapeNow);
  slashCheck.addEventListener('change', () => { if (input.value) escapeNow(); });
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
