(function(){
  const input = document.getElementById('sqlInput');
  const output = document.getElementById('sqlOutput');
  const errorBox = document.getElementById('sqlError');
  const okBox = document.getElementById('sqlOk');
  const upperCheck = document.getElementById('sqlUpper');
  const btnFormat = document.getElementById('btnFormat');
  const btnCopy = document.getElementById('btnCopy');
  const btnClear = document.getElementById('btnClear');

  // Ordered longest-first so multi-word clauses match before their
  // single-word substrings do.
  const CLAUSES = [
    'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN', 'INNER JOIN',
    'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN', 'GROUP BY', 'ORDER BY',
    'INSERT INTO', 'DELETE FROM', 'UNION ALL', 'SELECT', 'FROM', 'WHERE',
    'JOIN', 'ON', 'HAVING', 'LIMIT', 'OFFSET', 'VALUES', 'UPDATE', 'SET',
    'UNION'
  ];
  const INDENTED = ['AND', 'OR'];

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

  function format(){
    const raw = input.value.trim();
    if (!raw) { showError('Paste a SQL query first.'); return; }

    let sql = ' ' + raw.replace(/\s+/g, ' ') + ' ';

    CLAUSES.forEach(clause => {
      const pattern = clause.split(' ').join('\\s+');
      const re = new RegExp('\\s(' + pattern + ')\\s', 'gi');
      const label = upperCheck.checked ? clause : clause.toLowerCase();
      sql = sql.replace(re, '\n' + label + ' ');
    });

    INDENTED.forEach(word => {
      const re = new RegExp('\\s(' + word + ')\\s', 'gi');
      const label = upperCheck.checked ? word : word.toLowerCase();
      sql = sql.replace(re, '\n  ' + label + ' ');
    });

    const lines = sql
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    // Break long comma-separated column lists (SELECT / GROUP BY / ORDER BY)
    // onto their own indented lines so wide queries stay readable.
    const expanded = [];
    lines.forEach(line => {
      const head = /^(SELECT|select|GROUP BY|group by|ORDER BY|order by)\b/;
      const m = head.exec(line);
      if (m && line.length > 60 && line.includes(',')) {
        const rest = line.slice(m[0].length).trim();
        expanded.push(m[0]);
        rest.split(',').forEach((col, i, arr) => {
          expanded.push('  ' + col.trim() + (i < arr.length - 1 ? ',' : ''));
        });
      } else {
        expanded.push(line);
      }
    });

    output.textContent = expanded.join('\n');
    showOk('Formatted ' + lines.length + ' clause line' + (lines.length === 1 ? '' : 's') + '.');
  }

  btnFormat.addEventListener('click', format);
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
