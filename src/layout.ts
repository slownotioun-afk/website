const NAV = `<nav><a href="/">home</a> | <a href="/projects">projects</a> | <a href="/resources">resources</a> | <a href="/todo">to-do</a> | <a href="/calendar">calendar</a> | <a href="/notes">notes</a> | <a href="/bookshelf">bookshelf</a> | <a href="/about">about</a> | <a href="/contact">contact</a> | <a href="/hobbies">hobbies</a> | <a href="/sitemap">sitemap</a></nav>`;
const FOOTER = `<footer>&copy; 2026 Hamit &mdash; <a href="/">home</a> | <a href="/about">about</a> | <a href="/contact">contact</a> | <a href="/sitemap">sitemap</a></footer>`;
export function page(title: string, body: string, scripts = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title === 'Hamit' ? title : `${title} \u2026 Hamit`}</title>
<link rel="stylesheet" href="/style.css">
</head>
<body>
${NAV}
<main id="main">
${body}
</main>
${FOOTER}
${scripts}
</body>
</html>`;
}
