(function(){
  const nowSeconds = document.getElementById('tsNowSeconds');
  const nowMillis = document.getElementById('tsNowMillis');
  const nowIso = document.getElementById('tsNowIso');
  const btnCopySeconds = document.getElementById('btnCopySeconds');
  const btnCopyMillis = document.getElementById('btnCopyMillis');
  const btnCopyIso = document.getElementById('btnCopyIso');
  const btnFreeze = document.getElementById('btnFreeze');

  let frozen = false;
  let timer = null;

  function render(){
    const now = new Date();
    nowSeconds.textContent = Math.floor(now.getTime() / 1000);
    nowMillis.textContent = now.getTime();
    nowIso.textContent = now.toISOString();
  }

  function copy(el, btn){
    if (!el.textContent) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
      const original = btn.textContent;
      btn.textContent = 'copied';
      setTimeout(() => { btn.textContent = original; }, 1400);
    });
  }

  btnCopySeconds.addEventListener('click', () => copy(nowSeconds, btnCopySeconds));
  btnCopyMillis.addEventListener('click', () => copy(nowMillis, btnCopyMillis));
  btnCopyIso.addEventListener('click', () => copy(nowIso, btnCopyIso));

  btnFreeze.addEventListener('click', () => {
    frozen = !frozen;
    if (frozen) {
      clearInterval(timer);
      btnFreeze.textContent = 'Resume';
    } else {
      render();
      timer = setInterval(render, 1000);
      btnFreeze.textContent = 'Freeze';
    }
  });

  render();
  timer = setInterval(render, 1000);
})();
