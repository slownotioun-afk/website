(function () {
  'use strict';

  // ── Static page index (grep equivalent, client-side) ──────────────────────
  var PAGES = [
    { path: '/',           title: 'Home',       text: 'software developer build things break things write about it intentionally minimal loads fast' },
    { path: '/projects',   title: 'Projects',   text: 'projects built working on active past hamit.org typescript node express cloudflare tunnel tsc' },
    { path: '/resources',  title: 'Resources',  text: 'resources books videos webpages pragmatic programmer sicp structure interpretation computer programs abelson sussman thomas hunt' },
    { path: '/about',      title: 'About',      text: 'about hamit software developer web backend systems developer tooling python javascript' },
    { path: '/contact',    title: 'Contact',    text: 'contact email linkedin github phone' },
    { path: '/hobbies',    title: 'Hobbies',    text: 'hobbies things outside code' },
    { path: '/todo',       title: 'To-Do',      text: 'todo tasks inbox work personal someday done' },
    { path: '/calendar',   title: 'Calendar',   text: 'calendar events schedule upcoming work personal deadline' },
    { path: '/notes',      title: 'Notes',      text: 'notes markdown plain text editor preview download' },
    { path: '/bookshelf',  title: 'Bookshelf',  text: 'bookshelf books reading read want to read rating shelf author title year' },
    { path: '/sitemap',    title: 'Sitemap',    text: 'sitemap index all pages navigation tools meta' },
    { path: '/search',     title: 'Search',     text: 'search find grep across site' },
  ];

  // ── localStorage keys and how to extract searchable text ─────────────────
  function localResults(q) {
    var out = [];
    var ql = q.toLowerCase();

    // Bookshelf
    try {
      var books = JSON.parse(localStorage.getItem('bookshelf') || '[]');
      books.forEach(function (b) {
        var hay = ((b.title || '') + ' ' + (b.author || '') + ' ' + (b.note || '') + ' ' + (b.shelf || '')).toLowerCase();
        if (hay.indexOf(ql) !== -1) {
          out.push({
            path: '/bookshelf',
            label: 'Bookshelf',
            snippet: '\u201c' + b.title + '\u201d by ' + b.author + (b.note ? ' \u2014 ' + b.note : '')
          });
        }
      });
    } catch(e) {}

    // Todo
    try {
      var todos = JSON.parse(localStorage.getItem('todos') || '[]');
      todos.forEach(function (t) {
        var hay = ((t.text || '') + ' ' + (t.cat || '')).toLowerCase();
        if (hay.indexOf(ql) !== -1) {
          out.push({
            path: '/todo',
            label: 'To-Do',
            snippet: t.text + (t.cat ? ' [' + t.cat + ']' : '') + (t.done ? ' \u2714' : '')
          });
        }
      });
    } catch(e) {}

    // Notes (plain text search)
    try {
      var noteText = localStorage.getItem('notes') || '';
      if (noteText.toLowerCase().indexOf(ql) !== -1) {
        // Find surrounding context
        var idx = noteText.toLowerCase().indexOf(ql);
        var start = Math.max(0, idx - 60);
        var end   = Math.min(noteText.length, idx + q.length + 60);
        var snippet = (start > 0 ? '…' : '') + noteText.slice(start, end).replace(/\n/g, ' ') + (end < noteText.length ? '…' : '');
        out.push({ path: '/notes', label: 'Notes', snippet: snippet });
      }
    } catch(e) {}

    return out;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function highlight(text, q) {
    var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
    return esc(text).replace(re, '<mark style="background:rgba(255,200,0,.4);border-radius:2px">$1</mark>');
  }

  function render(q) {
    var ql = q.toLowerCase().trim();
    if (!ql) {
      document.getElementById('sr-static').innerHTML = '';
      document.getElementById('sr-local').innerHTML  = '';
      return;
    }

    // Static pages
    var staticHits = PAGES.filter(function (p) {
      return (p.title + ' ' + p.text).toLowerCase().indexOf(ql) !== -1;
    });

    var sh = '<h2 style="font-size:.875rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:.75rem">Pages</h2>';
    if (!staticHits.length) {
      sh += '<p style="color:var(--muted);font-size:.875rem">No pages matched.</p>';
    } else {
      sh += '<ul style="list-style:none;padding:0;margin:0 0 2rem">';
      staticHits.forEach(function (p) {
        sh += '<li style="padding:.4rem 0;border-bottom:1px solid var(--border)">'
            + '<a href="' + esc(p.path) + '">' + highlight(p.title, q) + '</a>'
            + '</li>';
      });
      sh += '</ul>';
    }
    document.getElementById('sr-static').innerHTML = sh;

    // Local data
    var localHits = localResults(q);
    var lh = '<h2 style="font-size:.875rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:.75rem">Your data</h2>';
    if (!localHits.length) {
      lh += '<p style="color:var(--muted);font-size:.875rem">Nothing found in your bookshelf, tasks, or notes.</p>';
    } else {
      lh += '<ul style="list-style:none;padding:0;margin:0">';
      localHits.forEach(function (r) {
        lh += '<li style="padding:.4rem 0;border-bottom:1px solid var(--border)">'
            + '<a href="' + esc(r.path) + '" style="font-size:.8rem;color:var(--muted);text-decoration:none">' + esc(r.label) + '</a><br>'
            + '<span style="font-size:.875rem">' + highlight(r.snippet, q) + '</span>'
            + '</li>';
      });
      lh += '</ul>';
    }
    document.getElementById('sr-local').innerHTML = lh;
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  window.doSearch = function () {
    render(document.getElementById('q').value);
  };

  document.addEventListener('DOMContentLoaded', function () {
    var inp = document.getElementById('q');

    // Run search on Enter
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') render(inp.value);
    });

    // Live search as you type (debounced)
    var timer;
    inp.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { render(inp.value); }, 200);
    });

    // If arriving with ?q= in URL
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    if (q) { inp.value = q; render(q); }

    inp.focus();
  });
})();
