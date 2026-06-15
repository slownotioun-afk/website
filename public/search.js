(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function highlight(text, q) {
    var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
    return esc(text).replace(re, '<mark style="background:rgba(255,200,0,.4);border-radius:2px;padding:0 1px">$1</mark>');
  }

  function context(text, q) {
    var words = text.replace(/\s+/g,' ').split(' ');
    var ql    = q.toLowerCase();
    var out   = [];
    var seen  = {};
    for (var i = 0; i < words.length; i++) {
      if (words[i].toLowerCase().indexOf(ql) !== -1) {
        var s = Math.max(0, i - 2);
        var e = Math.min(words.length - 1, i + 2);
        if (seen[s]) continue;
        seen[s] = true;
        out.push((s > 0 ? '…' : '') + words.slice(s, e + 1).join(' ') + (e < words.length - 1 ? '…' : ''));
        if (out.length >= 3) break;
      }
    }
    return out;
  }

  function localResults(q) {
    var out = [];
    var ql  = q.toLowerCase();

    try {
      var books = JSON.parse(localStorage.getItem('bookshelf') || '[]');
      books.forEach(function (b) {
        var hay = ((b.title||'') + ' ' + (b.author||'') + ' ' + (b.note||'') + ' ' + (b.shelf||'')).toLowerCase();
        if (hay.indexOf(ql) !== -1) {
          var full = [b.title, 'by', b.author, b.note].filter(Boolean).join(' ');
          var snips = context(full, q);
          out.push({ path: '/bookshelf', label: 'Bookshelf', snippets: snips.length ? snips : [full.slice(0,80)] });
        }
      });
    } catch(e) {}

    try {
      var todos = JSON.parse(localStorage.getItem('todos') || '[]');
      todos.forEach(function (t) {
        var hay = ((t.text||'') + ' ' + (t.cat||'')).toLowerCase();
        if (hay.indexOf(ql) !== -1) {
          var full = t.text + (t.cat ? ' [' + t.cat + ']' : '');
          var snips = context(full, q);
          out.push({ path: '/todo', label: 'To-Do', snippets: snips.length ? snips : [full.slice(0,80)] });
        }
      });
    } catch(e) {}

    try {
      var noteText = localStorage.getItem('notes') || '';
      if (noteText.toLowerCase().indexOf(ql) !== -1) {
        var snips = context(noteText.replace(/\n/g,' '), q);
        out.push({ path: '/notes', label: 'Notes', snippets: snips.length ? snips : [noteText.slice(0,80)] });
      }
    } catch(e) {}

    return out;
  }

  function setHTML(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function renderList(items, q, isLocal) {
    if (!items.length) {
      return '<p style="color:var(--muted);font-size:.875rem">' +
        (isLocal ? 'Nothing found in your bookshelf, tasks, or notes.' : 'No pages matched.') + '</p>';
    }
    var html = '<ul style="list-style:none;padding:0;margin:0 0 2rem">';
    items.forEach(function (r) {
      html += '<li style="padding:.6rem 0;border-bottom:1px solid var(--border)">';
      html += '<a href="' + esc(r.path) + '" style="font-weight:600">'
            + highlight(isLocal ? r.label : r.title, q) + '</a>';
      var snips = r.snippets || [];
      if (snips.length) {
        html += '<div style="margin-top:.25rem">';
        snips.forEach(function (s) {
          html += '<div style="font-size:.8rem;color:var(--muted);line-height:1.5">'
                + highlight(s, q) + '</div>';
        });
        html += '</div>';
      }
      html += '</li>';
    });
    html += '</ul>';
    return html;
  }

  var currentQ = '';
  var debounceTimer;

  function doSearch(q) {
    q = q.trim();
    if (q === currentQ) return;
    currentQ = q;

    if (!q || q.length < 2) {
      setHTML('sr-static', '');
      setHTML('sr-local', '');
      return;
    }

    var heading = '<h2 style="font-size:.875rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:.75rem">';

    // Local immediately
    setHTML('sr-local', heading + 'Your data</h2>' + renderList(localResults(q), q, true));

    // Server
    setHTML('sr-static', heading + 'Pages</h2><p style="color:var(--muted);font-size:.875rem">Searching…</p>');
    fetch('/api/search?q=' + encodeURIComponent(q))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        setHTML('sr-static', heading + 'Pages</h2>' + renderList(data.results || [], q, false));
      })
      .catch(function () {
        setHTML('sr-static', heading + 'Pages</h2><p style="color:var(--muted);font-size:.875rem">Search unavailable.</p>');
      });
  }

  window.doSearch = function () {
    doSearch(document.getElementById('q').value);
  };

  document.addEventListener('DOMContentLoaded', function () {
    var inp = document.getElementById('q');
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch(inp.value);
    });
    inp.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () { doSearch(inp.value); }, 250);
    });
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    if (q) { inp.value = q; doSearch(q); }
    inp.focus();
  });
})();
