# hamit.org

Express + TypeScript personal site. No framework, no build step beyond `tsc`.

## Setup

```bash
npm install
npm run build
npm start       # runs on :3000
```

Set `PORT` env var to change the port.

## Structure

```
src/            TypeScript source (compiled → dist/)
  server.ts     Express routes
  layout.ts     Shared HTML wrapper
  pages.ts      Per-page HTML generators
public/         Static assets (served as-is)
  style.css
  todo.js       localStorage todo logic
  calendar.js   localStorage calendar logic
```

## Update content

All page content lives in `src/pages.ts`. Edit, rebuild, restart.
