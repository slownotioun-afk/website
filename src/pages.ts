import { page } from './layout';

export const home = () => page('Hamit', `
<h1>Hamit</h1>
<p>Software developer. I build things, break things, and occasionally write about it.</p>
<p>This site is intentionally minimal &mdash; it loads fast and stays out of the way.</p>
`);

export const projects = () => page('Projects', `
<h1>Projects</h1>
<p>Things I've built or am currently working on.</p>
<h2>Active</h2>
<p><strong><a href="https://hamit.org">hamit.org</a></strong></p>
<p>2025 &mdash; TypeScript &middot; Node<br>
This website. Express + TypeScript, served via Cloudflare Tunnel. No framework, no build step beyond <code>tsc</code>.</p>
<hr>
<h2>Past</h2>
<p class="muted">Nothing archived yet.</p>
`);

export const resources = () => page('Resources', `
<h1>Resources</h1>
<p>Things worth reading, watching, or revisiting.</p>

<h2>Books</h2>
<p><a href="https://openlibrary.org/isbn/9780135957059" target="_blank" rel="noopener">The Pragmatic Programmer &#8599;</a><br>
David Thomas, Andrew Hunt &mdash; ISBN 978-0-13-595705-9</p>
<p><a href="https://openlibrary.org/isbn/9780262510875" target="_blank" rel="noopener">Structure and Interpretation of Computer Programs &#8599;</a><br>
Harold Abelson, Gerald Jay Sussman &mdash; ISBN 978-0-26-251087-5</p>
<hr>

<h2>Videos</h2>
<p><a href="#">Add a video here</a><br>Author / channel</p>
<hr>

<h2>Webpages</h2>
<p><a href="#">Add a webpage here</a><br>One sentence about what it is and why it matters.</p>
<hr>

<h2>Other</h2>
<p><a href="#">Add a paper, podcast, or other media here</a><br>Brief note about it.</p>
`);

export const todo = () => page('To-Do', `
<h1>To-Do</h1>
<p class="muted">Saved in your browser. Private to this device.</p>
<div class="tabs">
  <button class="tab active" data-f="all" onclick="setFilter('all')">All</button>
  <button class="tab" data-f="inbox" onclick="setFilter('inbox')">Inbox</button>
  <button class="tab" data-f="work" onclick="setFilter('work')">Work</button>
  <button class="tab" data-f="personal" onclick="setFilter('personal')">Personal</button>
  <button class="tab" data-f="someday" onclick="setFilter('someday')">Someday</button>
  <button class="tab" data-f="done" onclick="setFilter('done')">Done</button>
</div>
<div class="todo-form">
  <input id="todo-input" type="text" placeholder="New task…" autocomplete="off">
  <select id="todo-cat">
    <option value="inbox">Inbox</option>
    <option value="work">Work</option>
    <option value="personal">Personal</option>
    <option value="someday">Someday</option>
  </select>
  <button onclick="addTodo()">Add</button>
</div>
<div id="todo-list"></div>
<button class="clear-done" onclick="clearDone()">clear done</button>
`, '<script src="/todo.js"></script>');

export const calendar = () => page('Calendar', `
<h1>Calendar</h1>
<div class="cal-header">
  <button class="cal-nav" onclick="prevMonth()">&#8592;</button>
  <span id="cal-title"></span>
  <button class="cal-nav" onclick="nextMonth()">&#8594;</button>
  <button class="cal-nav" onclick="goToday()">today</button>
  <button class="cal-add-btn" onclick="openNewEvent()">+ add</button>
</div>
<div id="cal-grid" class="cal-grid"></div>
<div class="upcoming">
  <h2>Upcoming</h2>
  <div id="upcoming-list"></div>
</div>
<div id="cal-form" class="cal-form" style="display:none">
  <h2 id="form-heading">Add event</h2>
  <div class="field"><label>Title</label><input id="form-title" type="text" placeholder="Event title" onkeydown="if(event.key==='Enter')saveEvent()"></div>
  <div class="field"><label>Date</label><input id="form-date" type="date"></div>
  <div class="field"><label>Time <span class="muted">(optional)</span></label><input id="form-time" type="time"></div>
  <div class="field"><label>Category</label>
    <select id="form-cat">
      <option value="work">Work</option>
      <option value="personal">Personal</option>
      <option value="deadline">Deadline</option>
      <option value="other">Other</option>
    </select>
  </div>
  <div class="field"><label>Note <span class="muted">(optional)</span></label><textarea id="form-note" rows="2"></textarea></div>
  <div class="actions">
    <button class="btn btn-primary" onclick="saveEvent()">Save</button>
    <button class="btn btn-ghost" onclick="closeForm()">Cancel</button>
    <button id="delete-btn" class="btn btn-danger" onclick="deleteEvent()">Delete</button>
  </div>
</div>
`, '<script src="/calendar.js"></script>');

export const notes = () => page('Notes', `
<h1>Notes</h1>
<p class="muted">Saved in your browser. Private to this device.</p>
<div class="notes-bar" style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem;">
  <button class="tab notes-tab active" data-m="edit" onclick="setNotesMode('edit')">Edit</button>
  <button class="tab notes-tab" data-m="preview" onclick="setNotesMode('preview')">Preview</button>
  <span id="notes-count" style="margin-left:auto;font-size:.85rem;opacity:.6;"></span>
  <span id="notes-status" class="notes-status">Saved</span>


  <button class="btn" onclick="downloadNotes('md')">&#8595; .md</button>
  <button class="btn" onclick="downloadNotes('txt')">&#8595; .txt</button>
</div>
<div id="notes-editor">
  <textarea id="notes-input" style="width:100%;box-sizing:border-box;resize:vertical;padding:1rem;font-family:monospace;line-height:1.6;height:60vh;min-height:200px;background:#fff;color:#000;font-size:0.85rem;" placeholder="# Title&#10;&#10;Write in **markdown** or plain text..."></textarea>
</div>
<div id="notes-preview" style="display:none;min-height:60vh;padding:1rem;border:1px solid #ccc;border-radius:6px;line-height:1.7;overflow-wrap:break-word;word-break:break-word;overflow:hidden;font-size:0.85rem;"></div>
`, '<script src="/notes.js"></script>');

export const about = () => page('About', `
<h1>About</h1>
<p>I'm Hamit, a software developer based somewhere with a good internet connection. I build tools, break them, fix them, and occasionally write about what I learned along the way.</p>
<p>I care about software that does exactly what it says, loads fast, and respects the person using it. This site is an example of that.</p>
<h2>Work</h2>
<p>I work mostly on the web &mdash; backend systems, developer tooling, and the occasional front-end when needed. I'm comfortable with Python, JavaScript, and a few others collected along the way.</p>
<h2>Contact</h2>
<p>The best way to reach me is through the <a href="/contact">contact page</a>.</p>
`);

export const contact = () => page('Contact', `
<h1>Contact</h1>
<p>The best ways to reach me:</p>
<ul>
  <li>Email &mdash; <a href="mailto:[email protected]">[email protected]</a></li>
  <li>LinkedIn &mdash; <a href="https://linkedin.com/in/REPLACE-ME" target="_blank" rel="noopener">linkedin.com/in/REPLACE-ME</a></li>
  <li>GitHub &mdash; <a href="https://github.com/REPLACE-ME" target="_blank" rel="noopener">github.com/REPLACE-ME</a></li>
  <li>Phone &mdash; <a href="tel:+44XXXXXXXXXX">+44 XXXX XXXXXX</a></li>
</ul>
`);

export const notFound = () => page('404', `
<h1>404</h1>
<p>Page not found. <a href="/">Go home.</a></p>
`);

export const bookshelf = () => page('Bookshelf', `
<h1 style="margin-bottom:0.25rem">Bookshelf</h1>
<p id="bs-stats" style="color:var(--muted);font-size:0.875rem;margin-bottom:1.5rem"></p>

<details id="bs-add-section" style="margin-bottom:2rem;border:1px solid var(--border);border-radius:4px;padding:0.75rem">
  <summary style="cursor:pointer;font-weight:600;user-select:none">+ Add a book</summary>
  <div style="margin-top:1rem;display:flex;flex-direction:column;gap:0.6rem;max-width:480px">
    <input id="b-title"  type="text"   placeholder="Title *"  style="width:100%">
    <input id="b-author" type="text"   placeholder="Author *" style="width:100%">
    <select id="b-shelf" style="width:100%">
      <option value="reading">Reading</option>
      <option value="read">Read</option>
      <option value="want">Want to read</option>
    </select>
    <input id="b-year" type="number" placeholder="Year finished (optional)" min="1000" max="2100" style="width:100%">
    <textarea id="b-note" placeholder="Short note (optional)" style="width:100%;min-height:60px;resize:vertical"></textarea>
    <button id="b-add" style="align-self:flex-start;padding:0.35rem 1rem">Add book</button>
  </div>
</details>

<div id="bs-shelves"></div>
`, '<script src="/bookshelf.js"></script>');

export const sitemap = () => page('Sitemap', `
<h1 style="margin-bottom:1.5rem">Sitemap</h1>

<section style="margin-bottom:2rem">
  <h2 style="font-size:1rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);margin-bottom:0.75rem">Main</h2>
  <ul style="list-style:none;padding:0;margin:0">
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/">Home</a> <span style="color:var(--muted);font-size:0.875rem">— Landing page.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/tools">Tools</a> <span style="color:var(--muted);font-size:0.875rem">— All browser-based utilities.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/me">Me</a> <span style="color:var(--muted);font-size:0.875rem">— About, contact, hobbies, projects, resources.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/search">Search</a> <span style="color:var(--muted);font-size:0.875rem">— Search across all pages and your saved data.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/sitemap">Sitemap</a> <span style="color:var(--muted);font-size:0.875rem">— This page.</span></li>
  </ul>
</section>

<section style="margin-bottom:2rem">
  <h2 style="font-size:1rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);margin-bottom:0.75rem">Tools</h2>
  <ul style="list-style:none;padding:0;margin:0">
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/todo">To-do</a> <span style="color:var(--muted);font-size:0.875rem">— Personal task list.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/calendar">Calendar</a> <span style="color:var(--muted);font-size:0.875rem">— Event management and scheduling.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/notes">Notes</a> <span style="color:var(--muted);font-size:0.875rem">— Distraction-free markdown notes.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/bookshelf">Bookshelf</a> <span style="color:var(--muted);font-size:0.875rem">— Track books across Reading, Read, and Want to read.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/day-planner">Day Planner</a> <span style="color:var(--muted);font-size:0.875rem">— Plan your 24-hour day in colour-coded blocks.</span></li>
  </ul>
</section>

<section style="margin-bottom:2rem">
  <h2 style="font-size:1rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);margin-bottom:0.75rem">Me</h2>
  <ul style="list-style:none;padding:0;margin:0">
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/about">About</a> <span style="color:var(--muted);font-size:0.875rem">— Who I am and what I do.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/contact">Contact</a> <span style="color:var(--muted);font-size:0.875rem">— Get in touch.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/hobbies">Hobbies</a> <span style="color:var(--muted);font-size:0.875rem">— Things I do outside of work.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/projects">Projects</a> <span style="color:var(--muted);font-size:0.875rem">— Things I have built or am working on.</span></li>
    <li style="padding:0.4rem 0;border-bottom:1px solid var(--border)"><a href="/resources">Resources</a> <span style="color:var(--muted);font-size:0.875rem">— Books, videos, and other references.</span></li>
  </ul>
</section>
`);

export const hobbies = () => page('Hobbies', `
<h1>Hobbies</h1>
<p>Things I do when I'm not writing code.</p>
`);

export const search = () => page('Search', `
<h1>Search</h1>
<div style="display:flex;gap:.5rem;margin-bottom:1.5rem;flex-wrap:wrap">
  <input id="q" type="text" placeholder="Search…" autocomplete="off" style="flex:1;min-width:180px;padding:.35rem .6rem;border:1px solid var(--border);font:inherit;font-size:.9rem;border-radius:3px">
  <button onclick="doSearch()" style="padding:.35rem .8rem;background:var(--fg);color:var(--bg);border:none;border-radius:3px;cursor:pointer;font:inherit">Search</button>
</div>
<div id="sr-static"></div>
<div id="sr-local"></div>
`, '<script src="/search.js"></script>');

export const dayPlanner = () => page('Day Planner', `
<h1 style="margin-bottom:0.25rem">Timer</h1>
<p class="muted" style="margin-bottom:1.5rem">Plan your 24-hour day in colour-coded blocks. All data saved locally.</p>

<div id="timer-app">

  <!-- Settings bar -->
  <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;margin-bottom:1.25rem">
    <label style="font-size:.875rem;color:var(--muted)">Interval (min)
      <input id="t-interval" type="number" value="30" min="1" max="120"
        style="width:70px;margin-left:.35rem;padding:.25rem .4rem;border:1px solid var(--border);border-radius:3px;font:inherit;font-size:.875rem">
    </label>
    <button onclick="applyInterval()" style="padding:.25rem .7rem;font:inherit;font-size:.875rem;border:1px solid var(--border);border-radius:3px;cursor:pointer">Apply</button>
    <button onclick="clearAll()" style="padding:.25rem .7rem;font:inherit;font-size:.875rem;border:1px solid var(--border);border-radius:3px;cursor:pointer;color:var(--muted)">Clear all</button>
  </div>

  <!-- Activity definitions -->
  <div style="margin-bottom:1.25rem">
    <div style="font-size:.875rem;color:var(--muted);margin-bottom:.5rem">Activities</div>
    <div id="act-list" style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.5rem"></div>
    <div style="display:flex;gap:.4rem;flex-wrap:wrap;align-items:center">
      <input id="act-name" type="text" placeholder="Activity name" style="padding:.25rem .5rem;border:1px solid var(--border);border-radius:3px;font:inherit;font-size:.875rem;width:150px">
      <select id="act-type" style="padding:.25rem .4rem;border:1px solid var(--border);border-radius:3px;font:inherit;font-size:.875rem">
        <option value="work">Work</option>
        <option value="leisure">Leisure</option>
        <option value="pause">Pause</option>
        <option value="custom">Custom</option>
      </select>
      <input id="act-color" type="color" value="#3b82f6" style="width:32px;height:28px;padding:1px;border:1px solid var(--border);border-radius:3px;cursor:pointer">
      <button onclick="addActivity()" style="padding:.25rem .7rem;font:inherit;font-size:.875rem;background:var(--fg);color:var(--bg);border:none;border-radius:3px;cursor:pointer">+ Add</button>
    </div>
  </div>

  <!-- 24h strip -->
  <div style="margin-bottom:.4rem;display:flex;justify-content:space-between;font-size:.75rem;color:var(--muted)">
    <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
  </div>
  <div id="day-strip" style="display:flex;height:48px;border:1px solid var(--border);border-radius:4px;overflow:hidden;margin-bottom:.25rem;cursor:crosshair"></div>
  <div id="strip-labels" style="display:flex;margin-bottom:1.5rem;font-size:.7rem;color:var(--muted);overflow:hidden"></div>

  <!-- Legend / summary -->
  <div id="summary" style="margin-bottom:1.5rem"></div>

  <!-- Selected slot editor -->
  <div id="slot-editor" style="display:none;border:1px solid var(--border);border-radius:4px;padding:.75rem;margin-bottom:1.5rem;max-width:420px">
    <div style="font-size:.875rem;font-weight:600;margin-bottom:.5rem" id="slot-heading"></div>
    <div style="display:flex;gap:.4rem;flex-wrap:wrap;align-items:center">
      <label style="font-size:.8rem;color:var(--muted)">Assign activity:</label>
      <select id="slot-act-select" style="padding:.25rem .4rem;border:1px solid var(--border);border-radius:3px;font:inherit;font-size:.875rem"></select>
      <button onclick="assignSlot()" style="padding:.25rem .6rem;font:inherit;font-size:.875rem;background:var(--fg);color:var(--bg);border:none;border-radius:3px;cursor:pointer">Set</button>
      <button onclick="clearSlot()" style="padding:.25rem .6rem;font:inherit;font-size:.875rem;border:1px solid var(--border);border-radius:3px;cursor:pointer;color:var(--muted)">Clear</button>
      <button onclick="closeEditor()" style="padding:.25rem .6rem;font:inherit;font-size:.875rem;border:none;background:none;cursor:pointer;color:var(--muted)">✕</button>
    </div>
  </div>

  <!-- Range assign -->
  <div style="border:1px solid var(--border);border-radius:4px;padding:.75rem;max-width:420px">
    <div style="font-size:.875rem;font-weight:600;margin-bottom:.5rem">Assign a range</div>
    <div style="display:flex;gap:.4rem;flex-wrap:wrap;align-items:center">
      <input id="r-from" type="time" value="09:00" style="padding:.25rem .4rem;border:1px solid var(--border);border-radius:3px;font:inherit;font-size:.875rem">
      <span style="font-size:.8rem;color:var(--muted)">to</span>
      <input id="r-to"   type="time" value="17:00" style="padding:.25rem .4rem;border:1px solid var(--border);border-radius:3px;font:inherit;font-size:.875rem">
      <select id="r-act" style="padding:.25rem .4rem;border:1px solid var(--border);border-radius:3px;font:inherit;font-size:.875rem"></select>
      <button onclick="assignRange()" style="padding:.25rem .6rem;font:inherit;font-size:.875rem;background:var(--fg);color:var(--bg);border:none;border-radius:3px;cursor:pointer">Assign</button>
    </div>
  </div>

</div>
`, '<script src="/day-planner.js"></script>');

export const tools = () => page('Tools', `
<h1>Tools</h1>
<p class="muted">Browser-based utilities. All data stays on your device.</p>
<ul style="list-style:none;padding:0;margin-top:1.5rem">
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/todo">To-do</a> <span class="muted">— Personal task list with categories.</span></li>
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/calendar">Calendar</a> <span class="muted">— Event management and scheduling.</span></li>
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/notes">Notes</a> <span class="muted">— Distraction-free markdown notes.</span></li>
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/bookshelf">Bookshelf</a> <span class="muted">— Track books across Reading, Read, and Want to read.</span></li>
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/day-planner">Day Planner</a> <span class="muted">— Plan your 24-hour day in colour-coded blocks.</span></li>
</ul>
`);

export const me = () => page('Me', `
<h1>Me</h1>
<p class="muted">A few pages about who I am and what I'm interested in.</p>
<ul style="list-style:none;padding:0;margin-top:1.5rem">
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/about">About</a> <span class="muted">— Who I am and what I do.</span></li>
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/contact">Contact</a> <span class="muted">— Get in touch.</span></li>
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/hobbies">Hobbies</a> <span class="muted">— Things I do outside of work.</span></li>
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/projects">Projects</a> <span class="muted">— Things I've built or am working on.</span></li>
  <li style="padding:0.5rem 0;border-bottom:1px solid var(--border)"><a href="/resources">Resources</a> <span class="muted">— Books, videos, and other references.</span></li>
</ul>
`);
