const NAV = `<nav><a href="/">home</a> | <a href="/projects">projects</a> | <a href="/resources">resources</a> | <a href="/todo">to-do</a> | <a href="/calendar">calendar</a> | <a href="/notes">notes</a> | <a href="/bookshelf">bookshelf</a> | <a href="/about">about</a> | <a href="/contact">contact</a> | <a href="/hobbies">hobbies</a> | <a href="/search">search</a> | <a href="/sitemap">sitemap</a> | <button id="dm-toggle" onclick="toggleDark()" style="background:none;border:none;cursor:pointer;font:inherit;font-size:.875rem;color:var(--fg);padding:0">dark</button></nav>`;
const FOOTER = `<footer>&copy; 2026 Hamit &mdash; <a href="/">home</a> | <a href="/about">about</a> | <a href="/contact">contact</a> | <a href="/search">search</a> | <a href="/sitemap">sitemap</a></footer>`;
const DARK_SCRIPT = `<script>
(function(){
  var d = localStorage.getItem('dark');
  if(d === '1') document.documentElement.setAttribute('data-dark','1');
})();
function toggleDark(){
  var on = document.documentElement.getAttribute('data-dark') === '1';
  if(on){
    document.documentElement.removeAttribute('data-dark');
    localStorage.setItem('dark','0');
    document.getElementById('dm-toggle').textContent='dark';
  } else {
    document.documentElement.setAttribute('data-dark','1');
    localStorage.setItem('dark','1');
    document.getElementById('dm-toggle').textContent='light';
  }
}
(function(){
  var d = localStorage.getItem('dark');
  var btn = document.getElementById('dm-toggle');
  if(btn) btn.textContent = d === '1' ? 'light' : 'dark';
})();
</script>`;
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
${DARK_SCRIPT}
${scripts}
</body>
</html>`;
}
