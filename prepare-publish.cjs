// Build a complete GitHub Pages upload, preserving every referenced asset path.
// Run: node prepare-publish.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const output = path.join(root, 'publish');
const files = new Set(['index.html', 'style.css', 'script.js', 'project-previews.js']);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const references = [
    ...[...html.matchAll(/(?:src|href|data-preview-src)="([^"]+)"/g)].map(match => match[1]),
    ...[...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(match => match[1])
];

for (const reference of references) {
    if (/^(?:#|[a-z]+:|\/\/)/i.test(reference)) continue;
    const relative = reference.split(/[?#]/)[0];
    if (!relative) continue;
    const absolute = path.resolve(root, relative);
    if (!absolute.startsWith(root + path.sep)) throw new Error(`Invalid asset path: ${relative}`);
    if (!fs.existsSync(absolute)) throw new Error(`Missing asset: ${relative}`);
    // GitHub Pages uses case-sensitive paths, even when the local OS does not.
    let parent = root;
    for (const segment of relative.split('/')) {
        if (!fs.readdirSync(parent).includes(segment)) throw new Error(`Wrong filename case: ${relative}`);
        parent = path.join(parent, segment);
    }
    files.add(relative);
}

for (const relative of files) {
    const destination = path.join(output, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, relative), destination);
}
console.log(`Validated and copied ${files.size} files to publish/ with images/ and videos/ intact.`);
