(function () {
  const KEY = 'hamit_events';
  let events = [];
  let cur = new Date(); cur.setDate(1);
  let editing = null;

  try { events = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (_) { events = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(events)); } catch (_) {} }

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_LABELS = '<div class="day-label">Sun</div><div class="day-label">Mon</div><div class="day-label">Tue</div><div class="day-label">Wed</div><div class="day-label">Thu</div><div class="day-label">Fri</div><div class="day-label">Sat</div>';

  function pad(n) { return String(n).padStart(2, '0'); }
  function ds(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
  function today() { const n = new Date(); return ds(n.getFullYear(), n.getMonth(), n.getDate()); }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderCalendar() {
    const y = cur.getFullYear(), m = cur.getMonth();
    document.getElementById('cal-title').textContent = `${MONTHS[m]} ${y}`;
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevLast = new Date(y, m, 0).getDate();
    const t = today();
    const grid = document.getElementById('cal-grid');
    let html = DAY_LABELS;

    // prev-month padding
    for (let i = firstDay - 1; i >= 0; i--)
      html += `<div class="day other"><div class="num">${prevLast - i}</div></div>`;

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = ds(y, m, d);
      const evs = events.filter(e => e.date === dateStr);
      html += `<div class="day${dateStr === t ? ' today' : ''}" data-date="${dateStr}">
  <div class="num">${d}</div>
  ${evs.map(e => `<span class="cal-event" data-id="${esc(e.id)}"><span class="event-dot ${esc(e.cat)}"></span>${esc(e.title)}</span>`).join('')}
</div>`;
    }

    // next-month padding
    const filled = firstDay + daysInMonth;
    const rem = filled % 7 === 0 ? 0 : 7 - (filled % 7);
    for (let i = 1; i <= rem; i++)
      html += `<div class="day other"><div class="num">${i}</div></div>`;

    grid.innerHTML = html;

    // attach click handlers (event delegation)
    grid.addEventListener('click', function handler(e) {
      grid.removeEventListener('click', handler);
      // re-attached on next renderCalendar
    }, { once: true });
    grid.onclick = function (e) {
      const evSpan = e.target.closest('.cal-event');
      if (evSpan) { editEvent(evSpan.dataset.id); return; }
      const day = e.target.closest('.day:not(.other)');
      if (day) openForm(day.dataset.date);
    };
  }

  function renderUpcoming() {
    const t = today();
    const list = events.filter(e => e.date >= t)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
      .slice(0, 7);
    document.getElementById('upcoming-list').innerHTML = list.length
      ? list.map(e => `<div class="upcoming-item"><span class="ev-title"><span class="event-dot ${esc(e.cat)}"></span>${esc(e.title)}${e.time ? ` <span style="color:#999">${esc(e.time)}</span>` : ''}</span><span class="ev-date">${esc(e.date)}</span></div>`).join('')
      : '<p class="empty-msg">No upcoming events.</p>';
  }

  function render() { renderCalendar(); renderUpcoming(); }

  function openForm(date, ev) {
    editing = ev || null;
    document.getElementById('form-title').value = ev ? ev.title : '';
    document.getElementById('form-date').value  = date || (ev ? ev.date : '');
    document.getElementById('form-time').value  = ev ? (ev.time || '') : '';
    document.getElementById('form-cat').value   = ev ? ev.cat : 'work';
    document.getElementById('form-note').value  = ev ? (ev.note || '') : '';
    document.getElementById('form-heading').textContent = ev ? 'Edit event' : 'Add event';
    document.getElementById('delete-btn').style.display = ev ? '' : 'none';
    document.getElementById('cal-form').style.display = '';
    document.getElementById('form-title').focus();
  }

  function editEvent(id) {
    const ev = events.find(e => e.id === id);
    if (ev) openForm(ev.date, ev);
  }

  window.prevMonth   = () => { cur.setMonth(cur.getMonth() - 1); renderCalendar(); };
  window.nextMonth   = () => { cur.setMonth(cur.getMonth() + 1); renderCalendar(); };
  window.goToday     = () => { cur = new Date(); cur.setDate(1); renderCalendar(); };
  window.openNewEvent = () => openForm(today());

  window.saveEvent = function () {
    const title = document.getElementById('form-title').value.trim();
    const date  = document.getElementById('form-date').value;
    if (!title || !date) { alert('Title and date are required.'); return; }
    const ev = {
      id:    editing ? editing.id : String(Date.now()),
      title, date,
      time:  document.getElementById('form-time').value,
      cat:   document.getElementById('form-cat').value,
      note:  document.getElementById('form-note').value.trim(),
    };
    if (editing) { const i = events.findIndex(e => e.id === editing.id); if (i !== -1) events[i] = ev; }
    else events.push(ev);
    save(); closeForm(); render();
  };

  window.deleteEvent = function () {
    if (!editing) return;
    events = events.filter(e => e.id !== editing.id);
    save(); closeForm(); render();
  };

  window.closeForm = function () {
    document.getElementById('cal-form').style.display = 'none';
    editing = null;
  };

  render();
})();
