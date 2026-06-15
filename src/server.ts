import express from 'express';
import path from 'path';
import { home, projects, resources, todo, calendar, notes, about, contact, notFound, bookshelf, sitemap } from './pages';
const app = express();
app.use(express.static(path.join(__dirname, '../public')));
const routes: [string, () => string][] = [
  ['/', home], ['/projects', projects], ['/resources', resources],
  ['/todo', todo], ['/calendar', calendar], ['/notes', notes],
  ['/about', about], ['/contact', contact],
];
routes.forEach(([r, fn]) => app.get(r, (_req, res) => res.send(fn())));
app.get('/bookshelf', (_req, res) => res.send(bookshelf()));
app.get('/sitemap', (_req, res) => res.send(sitemap()));
app.get('/to-do', (_req, res) => res.redirect(301, '/todo'));
app.use((_req, res) => res.status(404).send(notFound()));
const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => console.log(`hamit.org :${PORT}`));
