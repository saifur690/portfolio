const { chromium } = require('playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html')));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, data) => {
        if (error) { res.writeHead(404).end(); return; }
        res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
        res.end(data);
    });
});
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 832 }, deviceScaleFactor: 1 });
        await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' });
        if (process.argv.includes('--verify-tilt')) {
            const assert = require('node:assert/strict');
            const target = page.locator('.profile-tilt');
            await target.waitFor({ state: 'visible' });
            const before = await target.boundingBox();
            for (const [x, y, signX, signY] of [[.85,.15,1,1],[.15,.15,1,-1],[.85,.85,-1,1],[.15,.85,-1,-1]]) {
                await target.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: before.x + before.width * x, clientY: before.y + before.height * y });
                await page.waitForFunction(([sx,sy]) => {
                    const el = document.querySelector('.profile-tilt');
                    return Math.sign(parseFloat(el.style.getPropertyValue('--tilt-x'))) === sx && Math.sign(parseFloat(el.style.getPropertyValue('--tilt-y'))) === sy;
                }, [signX, signY]);
            }
            const after = await target.boundingBox();
            assert.equal(before.width, after.width);
            assert.equal(before.height, after.height);
            await target.dispatchEvent('pointerleave', { pointerType: 'mouse' });
            assert.equal(await target.evaluate(el => el.style.getPropertyValue('--tilt-x')), '');
            await page.waitForFunction(() => {
                const matrix = new DOMMatrix(getComputedStyle(document.querySelector('.image-circle')).transform);
                return Math.abs(matrix.m11 - 1) < .0001 && Math.abs(matrix.m22 - 1) < .0001 && Math.abs(matrix.m13) < .0001 && Math.abs(matrix.m23) < .0001;
            });
            await target.dispatchEvent('pointermove', { pointerType: 'touch', clientX: before.x, clientY: before.y });
            assert.equal(await target.evaluate(el => el.classList.contains('is-tilting')), false);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await target.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: before.x, clientY: before.y });
            assert.equal(await target.evaluate(el => el.classList.contains('is-tilting')), false);
            assert.equal(await page.locator('.image-circle').evaluate(el => getComputedStyle(el).transform), 'none');
            console.log('Profile tilt passed: all four cursor quadrants, stable layout, smooth neutral reset, touch ignored, reduced motion respected.');
            return;
        }
        if (process.argv.includes('--verify-title')) {
            const assert = require('node:assert/strict');
            const title = page.locator('.hero-content h2');
            assert.equal(await title.textContent(), 'Frontend Developer');
            assert.equal(await title.getAttribute('aria-label'), 'Frontend Developer');
            for (const width of [1280, 390]) {
                await page.setViewportSize({ width, height: 832 });
                const result = await title.evaluate(el => {
                    const spans = [...el.querySelectorAll('.hero-title-letter')];
                    const animations = spans.flatMap(span => span.getAnimations());
                    animations.forEach(animation => { animation.pause(); animation.currentTime = 700; });
                    const visible = spans.map(span => getComputedStyle(span).opacity === '1');
                    const fading = Number(getComputedStyle(spans[1]).opacity);
                    const delays = spans.map(span => parseFloat(getComputedStyle(span).animationDelay));
                    const before = el.getBoundingClientRect().height;
                    animations.forEach(animation => animation.currentTime = 4000);
                    return { visible, fading, delays, complete: spans.every(span => getComputedStyle(span).opacity === '1'), stable: before === el.getBoundingClientRect().height };
                });
                assert.deepEqual(result.visible, Array.from({ length: 17 }, (_, i) => i < 1));
                assert(result.fading > 0 && result.fading < 1);
                result.delays.slice(1).forEach((delay, i) => assert(Math.abs(delay - result.delays[i] - .2) < .001));
                assert.equal(result.complete, true);
                assert.equal(result.stable, true);
            }
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.reload();
            assert.equal(await title.locator('span').count(), 0);
            assert.equal(await title.textContent(), 'Frontend Developer');
            console.log('Letter reveal passed: left-to-right order, complete text, stable height at desktop/mobile, accessible name, reduced motion.');
            return;
        }
        if (process.argv.includes('--verify-top')) {
            const assert = require('node:assert/strict');
            const link = page.locator('.back-to-top');
            for (const width of [1280, 390]) {
                await page.setViewportSize({ width, height: 832 });
                await link.scrollIntoViewIfNeeded();
                assert(await page.evaluate(() => window.scrollY > 500));
                await link.click();
                await page.waitForFunction(() => window.scrollY === 0);
            }
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await link.scrollIntoViewIfNeeded();
            await link.focus();
            await page.keyboard.press('Enter');
            await page.waitForFunction(() => window.scrollY === 0);
            console.log('Back to Top passed: desktop click, mobile click, keyboard, reduced motion; scrollY = 0.');
            return;
        }
        if (process.argv.includes('--verify')) {
            const assert = require('node:assert/strict');
            for (let i = 0; i < 4; i++) {
                const item = page.locator('.project-card').nth(i);
                const clip = item.locator('video');
                await clip.evaluate(v => v.readyState >= 1 ? null : new Promise(resolve => v.addEventListener('loadedmetadata', resolve, { once: true })));
                assert(Math.abs(await clip.evaluate(v => v.duration) - 9) < .1);
                await item.hover();
                await page.waitForFunction(index => document.querySelectorAll('.project-card')[index].classList.contains('preview-playing'), i);
                assert.equal(await page.locator('.preview-playing').count(), 1);
                await page.mouse.move(1, 1);
                assert.equal(await clip.evaluate(v => v.paused && v.currentTime === 0), true);
            }
            console.log('All four project clips: nine seconds, hover play, single active video, and leave reset verified.');
            const card = page.locator('.project-card').first();
            const video = card.locator('video');
            await video.evaluate(v => v.readyState >= 1 ? null : new Promise(resolve => v.addEventListener('loadedmetadata', resolve, { once: true })));
            const metadata = await video.evaluate(v => ({ duration: v.duration, muted: v.muted, width: v.videoWidth, height: v.videoHeight }));
            assert(Math.abs(metadata.duration - 9) < 0.1);
            assert.equal(metadata.muted, true);
            await card.hover();
            await page.waitForFunction(() => document.querySelector('.project-card').classList.contains('preview-playing'));
            await card.screenshot({ path: path.join(__dirname, 'hover-preview.png') });
            await video.evaluate(v => v.currentTime = 8.8);
            await page.waitForFunction(() => document.querySelector('.project-preview').currentTime < 1);
            await page.mouse.move(1, 1);
            assert.equal(await video.evaluate(v => v.paused && v.currentTime === 0), true);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await card.hover();
            assert.equal(await video.evaluate(v => v.paused), true);
            const toggle = card.locator('.preview-toggle');
            await toggle.focus();
            await page.keyboard.press('Enter');
            await page.waitForFunction(() => document.querySelector('.project-card').classList.contains('preview-playing'));
            await page.keyboard.press('Escape');
            assert.equal(await video.evaluate(v => v.paused), true);
            await video.dispatchEvent('error');
            assert.equal(await toggle.isHidden(), true);
            assert.equal(await card.evaluate(el => el.classList.contains('preview-playing')), false);
            console.log(JSON.stringify({ metadata, checks: 'hover, nine-second loop, leave reset, reduced motion, keyboard play/stop, error fallback passed' }));
            return;
        }
        await page.addStyleTag({ content: '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; } html { scroll-behavior: auto !important; }' });
        await page.locator('img').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
        await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => {}))));
        const endY = await page.locator('#projects').evaluate(el => Math.round(el.offsetTop + el.offsetHeight - 832));
        const screenshot = path.join(__dirname, 'portfolio-page.png');
        await page.screenshot({ path: screenshot, fullPage: true });
        fs.mkdirSync(path.join(root, 'videos'), { recursive: true });
        const ffmpeg = path.join(__dirname, 'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
        const output = path.join(root, 'videos/portfolio-preview.mp4');
        const result = spawnSync(ffmpeg, ['-y', '-loop', '1', '-framerate', '30', '-i', screenshot,
            '-vf', `crop=1280:832:0:'${endY}*(0.5-0.5*cos(PI*min(max((t-1)/7,0),1)))',scale=1000:650`,
            '-t', '9', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output],
            { windowsHide: true, encoding: 'utf8' });
        if (result.status !== 0) throw new Error(result.stderr);
        console.log(JSON.stringify({ output, bytes: fs.statSync(output).size, endY }));
    } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
