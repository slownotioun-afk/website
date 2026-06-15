(function () {
  const KEY     = 'hamit_notes';
  let saveTimer = null;

  function load() { try { return localStorage.getItem(KEY) || ''; } catch (_) { return ''; } }
  function save(text) {
    const s = document.getElementById('notes-status');
    try {
      localStorage.setItem(KEY, text);
      if (s) { s.textContent = 'Saved'; s.className = 'notes-status'; }
    } catch (_) {
      if (s) { s.textContent = 'Save failed'; s.className = 'notes-status err'; }
    }
  }

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function inline(s) {
    const hardBreak = s.endsWith('  ');
    s = esc(s.replace(/  $/, ''));
    s = s.replace(/\*\*\*(.+?)\*\*\*/g,  '<strong><em>$1</em></strong>');
    s = s.replace(/___(.+?)___/g,         '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.+?)\*\*/g,       '<strong>$1</strong>');
    s = s.replace(/__(.+?)__/g,           '<strong>$1</strong>');
    s = s.replace(/\*([^*\n]+)\*/g,       '<em>$1</em>');
    s = s.replace(/_([^_\n]+)_/g,         '<em>$1</em>');
    s = s.replace(/~~(.+?)~~/g,           '<del>$1</del>');
    s = s.replace(/`([^`]+)`/g,           '<code>$1</code>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    if (hardBreak) s += '<br>';
    return s;
  }

  function parseTable(lines) {
    const rows = lines.map(l =>
      l.replace(/^\||\|$/g, '').split('|').map(c => c.trim())
    );
    const isSep = r => r.every(c => /^:?-+:?$/.test(c));
    if (rows.length < 2 || !isSep(rows[1])) return null;
    const aligns = rows[1].map(c =>
      /^:-+:$/.test(c) ? 'center' : /^-+:$/.test(c) ? 'right' : 'left'
    );
    let html = '<table style="border-collapse:collapse;width:100%;margin:1em 0"><thead><tr>';
    rows[0].forEach((c, i) =>
      html += `<th style="text-align:${aligns[i]};border:1px solid #ccc;padding:.4em .6em;background:#f5f5f5">${inline(c)}</th>`
    );
    html += '</tr></thead><tbody>';
    for (let r = 2; r < rows.length; r++) {
      html += '<tr>';
      rows[r].forEach((c, i) =>
        html += `<td style="text-align:${aligns[i]||'left'};border:1px solid #ccc;padding:.4em .6em">${inline(c)}</td>`
      );
      html += '</tr>';
    }
    return html + '</tbody></table>';
  }

  function parseBlockquote(lines) {
    const inner = lines.map(l => l.replace(/^>[ ]?/, ''));
    return '<blockquote style="border-left:3px solid #ccc;margin:.5em 0;padding:.2em 1em;color:#555">'
      + renderMd(inner.join('\n'))
      + '</blockquote>';
  }

  function parseList(lines, ordered) {
    const tag    = ordered ? 'ol' : 'ul';
    const itemRe = ordered ? /^\d+\.\s+/ : /^[-*+]\s+/;
    const out    = ['<' + tag + '>'];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!itemRe.test(line)) { i++; continue; }
      const text = line.replace(itemRe, '');
      i++;
      const children = [];
      while (i < lines.length && /^[ \t]{2,}/.test(lines[i])) {
        children.push(lines[i].replace(/^[ \t]{2}/, ''));
        i++;
      }
      if (children.length) {
        const childOrdered = /^\d+\.\s/.test(children[0]);
        const childIsList  = /^[-*+]\s/.test(children[0]) || childOrdered;
        out.push('<li>' + inline(text) +
          (childIsList ? parseList(children, childOrdered) : '') +
          '</li>');
      } else {
        out.push('<li>' + inline(text) + '</li>');
      }
    }
    out.push('</' + tag + '>');
    return out.join('\n');
  }

  function renderMd(raw) {
    const lines = raw.replace(/\r\n/g, '\n').split('\n');
    const out   = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (/^```/.test(line)) {
        const lang = line.slice(3).trim();
        const codeLines = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        i++;
        const cls = lang ? ` class="language-${esc(lang)}"` : '';
        out.push(`<pre style="background:#f5f5f5;padding:1em;border-radius:4px;overflow-x:auto"><code${cls} style="background:none;color:inherit">${esc(codeLines.join('\n'))}</code></pre>`);
        continue;
      }

      if (/^>/.test(line)) {
        const block = [];
        while (i < lines.length && /^>/.test(lines[i])) { block.push(lines[i]); i++; }
        out.push(parseBlockquote(block));
        continue;
      }

      if (/^\|/.test(line)) {
        const block = [];
        while (i < lines.length && /^\|/.test(lines[i])) { block.push(lines[i]); i++; }
        const table = parseTable(block);
        out.push(table || block.map(l => '<p>' + inline(l) + '</p>').join('\n'));
        continue;
      }

      const hm = line.match(/^(#{1,6})\s+(.+)/);
      if (hm) {
        const lvl = hm[1].length;
        out.push(`<h${lvl}>${inline(hm[2])}</h${lvl}>`);
        i++; continue;
      }

      if (/^([-_*]\s*){3,}$/.test(line.trim())) {
        out.push('<hr>');
        i++; continue;
      }

      if (/^[-*+]\s/.test(line)) {
        const block = [];
        while (i < lines.length && (/^[-*+]\s/.test(lines[i]) || /^[ \t]{2,}/.test(lines[i]))) {
          block.push(lines[i]); i++;
        }
        out.push(parseList(block, false));
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        const block = [];
        while (i < lines.length && (/^\d+\.\s/.test(lines[i]) || /^[ \t]{2,}/.test(lines[i]))) {
          block.push(lines[i]); i++;
        }
        out.push(parseList(block, true));
        continue;
      }

      if (!line.trim()) { i++; continue; }

      const paraLines = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^(#{1,6}\s|>|```|[-*+]\s|\d+\.\s|\|)/.test(lines[i]) &&
        !/^([-_*]\s*){3,}$/.test(lines[i].trim())
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length) {
        out.push('<p>' + paraLines.map(inline).join('<br>') + '</p>');
      }
    }

    return out.join('\n');
  }

  function updateCount(text) {
    const el = document.getElementById('notes-count');
    if (!el) return;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    el.textContent = `${words} word${words !== 1 ? 's' : ''} · ${text.length} char${text.length !== 1 ? 's' : ''}`;
  }

  window.setNotesMode = function (m) {
    const editor  = document.getElementById('notes-editor');
    const preview = document.getElementById('notes-preview');
    document.querySelectorAll('.notes-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.m === m));
    if (m === 'preview') {
      const text = document.getElementById('notes-input').value;
      preview.innerHTML = text.trim() ? renderMd(text) : '<p class="empty-msg">Nothing to preview.</p>';
      if (editor) editor.style.display = 'none';
      preview.style.display = '';
    } else {
      if (editor) editor.style.display = '';
      preview.style.display = 'none';
      document.getElementById('notes-input').focus();
    }
  };

  window.downloadNotes = function (ext) {
    const text = document.getElementById('notes-input').value;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `notes.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  const textarea = document.getElementById('notes-input');
  if (!textarea) return;

  textarea.value = load();
  updateCount(textarea.value);

  textarea.addEventListener('input', function () {
    const s = document.getElementById('notes-status');
    if (s) { s.textContent = 'Unsaved'; s.className = 'notes-status unsaved'; }
    updateCount(this.value);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => save(this.value), 800);
  });
})();
