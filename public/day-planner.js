(function () {
  'use strict';

  var STORE_KEY = 'dayplanner';
  var state = {
    interval: 30,       // minutes per slot
    activities: [
      { id: 'pause',   name: 'Pause',   type: 'pause',   color: '#94a3b8' },
      { id: 'work',    name: 'Work',    type: 'work',    color: '#3b82f6' },
      { id: 'leisure', name: 'Leisure', type: 'leisure', color: '#10b981' },
    ],
    slots: {}           // slotIndex -> activityId
  };
  var selectedSlot = null;

  // ── persistence ────────────────────────────────────────────────────────────
  function save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) state = JSON.parse(raw);
    } catch(e) {}
  }

  // ── helpers ────────────────────────────────────────────────────────────────
  function numSlots() { return Math.floor(24 * 60 / state.interval); }

  function slotToTime(i) {
    var mins = i * state.interval;
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    return pad(h) + ':' + pad(m);
  }

  function timeToSlot(hhmm) {
    var parts = hhmm.split(':');
    var mins  = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    return Math.floor(mins / state.interval);
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function actById(id) {
    return state.activities.find(function (a) { return a.id === id; }) || null;
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  // ── render strip ───────────────────────────────────────────────────────────
  function renderStrip() {
    var strip  = document.getElementById('day-strip');
    var labels = document.getElementById('strip-labels');
    if (!strip || !labels) return;

    var n   = numSlots();
    var pct = (100 / n).toFixed(4) + '%';
    var sh  = '';
    var lh  = '';

    for (var i = 0; i < n; i++) {
      var act   = actById(state.slots[i]);
      var color = act ? act.color : 'var(--border)';
      var title = (act ? act.name : 'Unassigned') + ' ' + slotToTime(i) + '–' + slotToTime(i + 1);
      var sel   = selectedSlot === i ? 'outline:2px solid var(--fg);outline-offset:-2px;' : '';
      sh += '<div data-slot="' + i + '" title="' + esc(title) + '" '
          + 'style="flex:0 0 ' + pct + ';height:100%;background:' + color + ';' + sel + '" '
          + 'onclick="selectSlot(' + i + ')"></div>';

      // Label every slot that lands on a whole hour
      var mins = i * state.interval;
      if (mins % 60 === 0 && mins > 0 && mins < 24 * 60) {
        lh += '<div style="flex:0 0 ' + pct + ';white-space:nowrap">' + pad(mins / 60) + ':00</div>';
      } else {
        lh += '<div style="flex:0 0 ' + pct + '"></div>';
      }
    }

    strip.innerHTML  = sh;
    labels.innerHTML = lh;
  }

  // ── render activity pills ──────────────────────────────────────────────────
  function renderActivities() {
    var el = document.getElementById('act-list');
    if (!el) return;
    var html = '';
    state.activities.forEach(function (a) {
      html += '<span style="display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .55rem;border-radius:3px;font-size:.8rem;background:' + esc(a.color) + ';color:#fff">'
            + esc(a.name)
            + ' <button data-del="' + esc(a.id) + '" onclick="delActivity(\'' + esc(a.id) + '\')" '
            + 'style="background:none;border:none;color:#fff;cursor:pointer;font-size:.8rem;padding:0;line-height:1">✕</button>'
            + '</span>';
    });
    el.innerHTML = html;
    renderActivitySelects();
  }

  function renderActivitySelects() {
    ['slot-act-select', 'r-act'].forEach(function (id) {
      var sel = document.getElementById(id);
      if (!sel) return;
      var html = '<option value="">— unassign —</option>';
      state.activities.forEach(function (a) {
        html += '<option value="' + esc(a.id) + '">' + esc(a.name) + '</option>';
      });
      sel.innerHTML = html;
    });
  }

  // ── render summary ─────────────────────────────────────────────────────────
  function renderSummary() {
    var el = document.getElementById('summary');
    if (!el) return;
    var totals = {};
    state.activities.forEach(function (a) { totals[a.id] = 0; });
    var unassigned = 0;
    var n = numSlots();
    for (var i = 0; i < n; i++) {
      var aid = state.slots[i];
      if (aid && totals[aid] !== undefined) totals[aid]++;
      else unassigned++;
    }
    var html = '<div style="display:flex;flex-wrap:wrap;gap:.5rem;font-size:.8rem">';
    state.activities.forEach(function (a) {
      var mins = totals[a.id] * state.interval;
      var h = Math.floor(mins / 60), m = mins % 60;
      html += '<span style="padding:.2rem .55rem;border-radius:3px;background:' + esc(a.color) + ';color:#fff">'
            + esc(a.name) + ' ' + h + 'h' + (m ? pad(m) + 'm' : '') + '</span>';
    });
    var um = unassigned * state.interval;
    html += '<span style="padding:.2rem .55rem;border-radius:3px;background:var(--border);color:var(--muted)">'
          + 'Unassigned ' + Math.floor(um/60) + 'h' + (um%60 ? pad(um%60)+'m' : '') + '</span>';
    html += '</div>';
    el.innerHTML = html;
  }

  // ── full render ────────────────────────────────────────────────────────────
  function render() {
    renderStrip();
    renderActivities();
    renderSummary();
  }

  // ── slot editor ────────────────────────────────────────────────────────────
  window.selectSlot = function (i) {
    selectedSlot = i;
    var ed = document.getElementById('slot-editor');
    var hd = document.getElementById('slot-heading');
    if (!ed || !hd) return;
    hd.textContent = slotToTime(i) + ' – ' + slotToTime(i + 1);
    var sel = document.getElementById('slot-act-select');
    if (sel) sel.value = state.slots[i] || '';
    ed.style.display = 'block';
    renderStrip();
  };

  window.assignSlot = function () {
    if (selectedSlot === null) return;
    var val = document.getElementById('slot-act-select').value;
    if (val) state.slots[selectedSlot] = val;
    else delete state.slots[selectedSlot];
    save(); render();
  };

  window.clearSlot = function () {
    if (selectedSlot === null) return;
    delete state.slots[selectedSlot];
    save(); render();
  };

  window.closeEditor = function () {
    selectedSlot = null;
    var ed = document.getElementById('slot-editor');
    if (ed) ed.style.display = 'none';
    renderStrip();
  };

  // ── range assign ───────────────────────────────────────────────────────────
  window.assignRange = function () {
    var from = document.getElementById('r-from').value;
    var to   = document.getElementById('r-to').value;
    var act  = document.getElementById('r-act').value;
    if (!from || !to) return;
    var s = timeToSlot(from);
    var e = timeToSlot(to);
    if (e <= s) { alert('End time must be after start time.'); return; }
    for (var i = s; i < e; i++) {
      if (act) state.slots[i] = act;
      else delete state.slots[i];
    }
    save(); render();
  };

  // ── interval ───────────────────────────────────────────────────────────────
  window.applyInterval = function () {
    var v = parseInt(document.getElementById('t-interval').value, 10);
    if (!v || v < 1 || v > 120) { alert('Interval must be 1–120 minutes.'); return; }
    if (24 * 60 % v !== 0) { alert('Interval must divide evenly into 1440 minutes (24h). Try: 1,2,3,4,5,6,8,9,10,12,15,16,18,20,24,30,36,40,45,48,60,72,80,90,120'); return; }
    state.interval = v;
    state.slots    = {};   // reset slots when interval changes
    selectedSlot   = null;
    save(); render();
  };

  // ── activities ─────────────────────────────────────────────────────────────
  window.addActivity = function () {
    var name  = document.getElementById('act-name').value.trim();
    var type  = document.getElementById('act-type').value;
    var color = document.getElementById('act-color').value;
    if (!name) { alert('Activity name required.'); return; }
    state.activities.push({ id: uid(), name: name, type: type, color: color });
    document.getElementById('act-name').value = '';
    save(); render();
  };

  window.delActivity = function (id) {
    state.activities = state.activities.filter(function (a) { return a.id !== id; });
    // clear slots using this activity
    Object.keys(state.slots).forEach(function (k) {
      if (state.slots[k] === id) delete state.slots[k];
    });
    save(); render();
  };

  // ── clear all ──────────────────────────────────────────────────────────────
  window.clearAll = function () {
    if (!confirm('Clear all slot assignments?')) return;
    state.slots = {};
    selectedSlot = null;
    save(); render();
  };

  // ── init ───────────────────────────────────────────────────────────────────
  load();
  document.addEventListener('DOMContentLoaded', function () {
    var inp = document.getElementById('t-interval');
    if (inp) inp.value = state.interval;
    render();
  });

})();
