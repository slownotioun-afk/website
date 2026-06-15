import express from 'express';
import path from 'path';
import { execSync } from 'child_process';
import { home, projects, resources, todo, calendar, notes, about, contact, notFound, bookshelf, sitemap, hobbies, search, dayPlanner, tools, me } from './pages';

const app = express();
app.use(express.static(path.join(__dirname, '../public')));

// ── Single source of truth — all pages ────────────────────────────────────
const PAGES: { path: string; title: string; fn: () => string }[] = [
  { path: '/',            title: 'Home',        fn: home },
  { path: '/projects',    title: 'Projects',    fn: projects },
  { path: '/resources',   title: 'Resources',   fn: resources },
  { path: '/todo',        title: 'To-Do',       fn: todo },
  { path: '/calendar',    title: 'Calendar',    fn: calendar },
  { path: '/notes',       title: 'Notes',       fn: notes },
  { path: '/about',       title: 'About',       fn: about },
  { path: '/contact',     title: 'Contact',     fn: contact },
  { path: '/hobbies',     title: 'Hobbies',     fn: hobbies },
  { path: '/bookshelf',   title: 'Bookshelf',   fn: bookshelf },
  { path: '/day-planner', title: 'Day Planner', fn: dayPlanner },
  { path: '/tools',       title: 'Tools',       fn: tools },
  { path: '/me',          title: 'Me',          fn: me },
  { path: '/sitemap',     title: 'Sitemap',     fn: sitemap },
  { path: '/search',      title: 'Search',      fn: search },
];

// Register all page routes from PAGES automatically
PAGES.forEach(({ path: p, fn }) => {
  app.get(p, (_req, res) => res.send(fn()));
});

app.get('/to-do', (_req, res) => res.redirect(301, '/todo'));

// ── Search helpers ─────────────────────────────────────────────────────────
function extractMain(html: string): string {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : html;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&mdash;/g, '—')
    .replace(/&middot;/g, '·')
    .replace(/&#\d+;/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSnippets(text: string, q: string): string[] {
  // Use grep -oP for extended regex with word context
  try {
    const escaped = q.replace(/'/g, "'\\''");
    const grep = execSync(
      `echo '${text.replace(/'/g, "'\\''")}' | grep -oiP '.{0,30}(${escaped}).{0,30}'`,
      { timeout: 2000 }
    ).toString().trim();
    if (grep) {
      return grep.split('\n').slice(0, 3).map(s => s.trim()).filter(Boolean);
    }
  } catch (_) {}

  // Fallback: JS word-based context
  const words   = text.split(' ');
  const ql      = q.toLowerCase();
  const snippets: string[] = [];
  const seen    = new Set<number>();
  for (let i = 0; i < words.length; i++) {
    if (words[i].toLowerCase().includes(ql)) {
      const start = Math.max(0, i - 2);
      const end   = Math.min(words.length - 1, i + 2);
      if (seen.has(start)) continue;
      seen.add(start);
      snippets.push(
        (start > 0 ? '…' : '') +
        words.slice(start, end + 1).join(' ') +
        (end < words.length - 1 ? '…' : '')
      );
      if (snippets.length >= 3) break;
    }
  }
  return snippets;
}

// ── /api/search ────────────────────────────────────────────────────────────
app.get('/api/search', (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q || q.length < 2) { res.json({ results: [] }); return; }

  let re: RegExp;
  try {
    re = new RegExp(q, 'gi');
  } catch (_) {
    res.json({ error: 'Invalid regex', results: [] });
    return;
  }

  const results = PAGES
    .map(p => {
      const text     = stripTags(extractMain(p.fn()));
      const matches  = (text.match(re) || []).length;
      const snippets = matches > 0 ? getSnippets(text, q) : [];
      return { path: p.path, title: p.title, snippets, matches };
    })
    .filter(r => r.matches > 0)
    .sort((a, b) => b.matches - a.matches);

  res.json({ results });
});

// ── 404 ────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).send(notFound()));

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => console.log(`hamit.org :${PORT}`));
