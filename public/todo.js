(function () {
  const KEY = 'hamit_todos';
  let todos = [];
  let filter = 'all';

  try { todos = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (_) { todos = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(todos)); } catch (_) {} }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function render() {
    const list = document.getElementById('todo-list');
    const items = filter === 'all' ? todos.filter(t => !t.done)
      : filter === 'done' ? todos.filter(t => t.done)
      : todos.filter(t => t.cat === filter && !t.done);

    if (!items.length) { list.innerHTML = '<p class="empty-msg">Nothing here.</p>'; return; }

    list.innerHTML = items.map(t => {
      const i = todos.indexOf(t);
      return `<div class="todo-item${t.done ? ' done' : ''}">
  <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTodo(${i})">
  <span class="todo-text">${esc(t.text)}</span>
  <span class="badge">${esc(t.cat)}</span>
  <button class="del" onclick="deleteTodo(${i})" title="Delete">&times;</button>
</div>`;
    }).join('');
  }

  window.toggleTodo = function (i) { todos[i].done = !todos[i].done; save(); render(); };
  window.deleteTodo = function (i) { todos.splice(i, 1); save(); render(); };
  window.clearDone  = function ()  { todos = todos.filter(t => !t.done); save(); render(); };

  window.setFilter = function (f) {
    filter = f;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.f === f));
    render();
  };

  window.addTodo = function () {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) return;
    todos.push({ id: Date.now(), text, cat: document.getElementById('todo-cat').value, done: false });
    input.value = '';
    save(); render();
  };

  document.getElementById('todo-input').addEventListener('keydown', e => { if (e.key === 'Enter') window.addTodo(); });
  render();
})();
