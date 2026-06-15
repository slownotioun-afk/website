(function () {
  'use strict';

  var KEY = 'bookshelf';
  var books = [];

  function load() {
    var raw = localStorage.getItem(KEY);
    try { books = raw ? JSON.parse(raw) : []; } catch (e) { books = []; }
    render();
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(books));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function stars(rating, bookId) {
    return [1, 2, 3, 4, 5].map(function (n) {
      var filled = n <= (rating || 0);
      return '<span class="star" data-book="' + esc(bookId) + '" data-n="' + n + '" '
        + 'style="cursor:pointer;font-size:1rem;color:' + (filled ? 'inherit' : 'var(--border)') + '">'
        + (filled ? '★' : '☆') + '</span>';
    }).join('');
  }

  var SHELF_LABELS = { reading: 'Reading', read: 'Read', want: 'Want to read' };
  var SHELF_ORDER  = ['reading', 'read', 'want'];

  function render() {
    var counts = { reading: 0, read: 0, want: 0 };
    books.forEach(function (b) { if (counts[b.shelf] !== undefined) counts[b.shelf]++; });
    var statsEl = document.getElementById('bs-stats');
    if (statsEl) {
      statsEl.textContent = counts.read + ' read · ' + counts.reading + ' reading · ' + counts.want + ' want to read';
    }

    var html = '';
    SHELF_ORDER.forEach(function (shelf) {
      var list = books.filter(function (b) { return b.shelf === shelf; });
      if (shelf === 'read') {
        list = list.slice().sort(function (a, b) { return b.addedAt - a.addedAt; });
      }
      html += '<section style="margin-bottom:2rem">';
      html += '<h2 style="font-size:1rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);margin-bottom:0.75rem">'
            + esc(SHELF_LABELS[shelf]) + ' (' + list.length + ')</h2>';
      if (!list.length) {
        html += '<p style="color:var(--muted);font-size:0.875rem">Nothing here yet.</p>';
      }
      list.forEach(function (b) {
        html += '<div class="book-row" data-id="' + esc(b.id) + '" style="padding:0.6rem 0;border-bottom:1px solid var(--border)">';
        html += '<div style="display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap">';
        html += '<strong>' + esc(b.title) + '</strong>';
        html += '<span style="color:var(--muted);font-size:0.875rem">by ' + esc(b.author) + '</span>';
        if (b.year) html += '<span style="color:var(--muted);font-size:0.8rem">(' + esc(String(b.year)) + ')</span>';
        html += '<span class="rating-stars">' + stars(b.rating, b.id) + '</span>';
        html += '</div>';
        if (b.note) html += '<div style="margin-top:0.3rem;font-size:0.875rem;color:var(--muted)">' + esc(b.note) + '</div>';
        html += '<div style="margin-top:0.4rem;display:flex;gap:0.5rem;flex-wrap:wrap">';
        SHELF_ORDER.filter(function (s) { return s !== shelf; }).forEach(function (s) {
          html += '<button class="move-btn" data-id="' + esc(b.id) + '" data-shelf="' + esc(s) + '" style="font-size:0.8rem">→ ' + esc(SHELF_LABELS[s]) + '</button>';
        });
        html += '<button class="edit-btn" data-id="' + esc(b.id) + '" style="font-size:0.8rem">Edit</button>';
        html += '<button class="del-btn" data-id="' + esc(b.id) + '" style="font-size:0.8rem;color:var(--muted)">Delete</button>';
        html += '</div>';
        html += '<div class="edit-form" data-id="' + esc(b.id) + '" style="display:none;margin-top:0.6rem;background:var(--input-bg);border:1px solid var(--border);border-radius:4px;padding:0.75rem">'
              + '<div style="display:flex;flex-direction:column;gap:0.4rem;max-width:420px">'
              + '<input class="ef-title" type="text" value="' + esc(b.title) + '" style="width:100%">'
              + '<input class="ef-author" type="text" value="' + esc(b.author) + '" style="width:100%">'
              + '<input class="ef-year" type="number" value="' + esc(b.year || '') + '" placeholder="Year finished" style="width:100%" min="1000" max="2100">'
              + '<textarea class="ef-note" style="width:100%;min-height:48px;resize:vertical">' + esc(b.note || '') + '</textarea>'
              + '<div style="display:flex;gap:0.5rem">'
              + '<button class="ef-save" data-id="' + esc(b.id) + '" style="font-size:0.85rem">Save</button>'
              + '<button class="ef-cancel" data-id="' + esc(b.id) + '" style="font-size:0.85rem">Cancel</button>'
              + '</div></div></div>';
        html += '</div>';
      });
      html += '</section>';
    });

    var shelvesEl = document.getElementById('bs-shelves');
    if (shelvesEl) shelvesEl.innerHTML = html;
    bindEvents();
  }

  function bindEvents() {
    document.querySelectorAll('.star').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.getAttribute('data-book');
        var n  = parseInt(el.getAttribute('data-n'), 10);
        var b  = books.find(function (x) { return x.id === id; });
        if (!b) return;
        b.rating = (b.rating === n) ? 0 : n;
        save(); render();
      });
    });

    document.querySelectorAll('.move-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id    = btn.getAttribute('data-id');
        var shelf = btn.getAttribute('data-shelf');
        var b     = books.find(function (x) { return x.id === id; });
        if (b) { b.shelf = shelf; save(); render(); }
      });
    });

    document.querySelectorAll('.del-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        if (!confirm('Delete this book?')) return;
        books = books.filter(function (x) { return x.id !== id; });
        save(); render();
      });
    });

    document.querySelectorAll('.edit-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id   = btn.getAttribute('data-id');
        var form = document.querySelector('.edit-form[data-id="' + id + '"]');
        if (!form) return;
        form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
      });
    });

    document.querySelectorAll('.ef-save').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id     = btn.getAttribute('data-id');
        var form   = document.querySelector('.edit-form[data-id="' + id + '"]');
        var title  = form.querySelector('.ef-title').value.trim();
        var author = form.querySelector('.ef-author').value.trim();
        var year   = form.querySelector('.ef-year').value.trim();
        var note   = form.querySelector('.ef-note').value.trim();
        if (!title || !author) { alert('Title and author are required.'); return; }
        var b = books.find(function (x) { return x.id === id; });
        if (b) { b.title = title; b.author = author; b.year = year || null; b.note = note || null; }
        save(); render();
      });
    });

    document.querySelectorAll('.ef-cancel').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id   = btn.getAttribute('data-id');
        var form = document.querySelector('.edit-form[data-id="' + id + '"]');
        if (form) form.style.display = 'none';
      });
    });
  }

  function initAddForm() {
    var addBtn = document.getElementById('b-add');
    if (!addBtn) return;
    addBtn.addEventListener('click', function () {
      var title  = document.getElementById('b-title').value.trim();
      var author = document.getElementById('b-author').value.trim();
      if (!title || !author) { alert('Title and author are required.'); return; }
      var shelf = document.getElementById('b-shelf').value;
      var year  = document.getElementById('b-year').value.trim() || null;
      var note  = document.getElementById('b-note').value.trim() || null;
      books.push({ id: uid(), title: title, author: author, shelf: shelf,
                   year: year, note: note, rating: 0, addedAt: Date.now() });
      save(); render();
      ['b-title', 'b-author', 'b-year', 'b-note'].forEach(function (id) {
        document.getElementById(id).value = '';
      });
      var addSection = document.getElementById('bs-add-section');
      if (addSection) addSection.open = false;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAddForm(); load(); });
  } else {
    initAddForm(); load();
  }
})();
