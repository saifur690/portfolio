const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const jobs = ['personal-portfolio', 'landing-page', 'todo-list', 'product-page'];

(async () => {
    const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1000, height: 650 }, deviceScaleFactor: 1 });
        for (const [index, name] of jobs.entries()) {
            const frames = path.join(__dirname, 'frames-' + name);
            fs.mkdirSync(frames, { recursive: true });
            const svg = fs.readFileSync(path.join(root, `images/project-${index + 1}.svg`), 'utf8');
            await page.setContent('<html><body style="margin:0;overflow:hidden"></body></html>');
            await page.evaluate(({ svg, kind }) => {
                const ns = 'http://www.w3.org/2000/svg';
                document.body.innerHTML = svg;
                const original = document.querySelector('svg').innerHTML;
                window.renderFrame = (t) => {
                    const scene = document.querySelector('svg');
                    scene.innerHTML = original;
                    const add = markup => { const g = document.createElementNS(ns, 'g'); g.setAttribute('font-family', 'Arial, sans-serif'); g.innerHTML = markup; scene.appendChild(g); };
                    const text = (x, y, value, size = 14, color = '#254e45', weight = 400) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${value}</text>`;
                    const rect = (x, y, w, h, fill, r = 10) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="${r}"/>`;
                    let cursor = [280, 460], caption = '';
                    if (kind === 0) {
                        cursor = t < 2 ? [450 - t * 115, 485 - t * 22] : [244, 440];
                        caption = 'A portfolio made to explore';
                        if (t >= 2.7) {
                            add(rect(96, 131, 808, 433, '#fff', 0) + text(140, 177, 'SAIF.', 21, '#20251d', 700) + text(658, 175, 'About     Work     Contact', 12, '#666') + text(140, 238, 'Selected work', 34, '#20251d', 700) + text(140, 266, 'A few things I have designed and built.', 14, '#777'));
                            ['Landing page', 'Task manager', 'Product experience'].forEach((label, i) => {
                                const x = 140 + i * 242, active = t > 4.3 && i === 1;
                                add(rect(x, active ? 300 : 308, 218, 161, ['#e6dfef', '#dce9df', '#f0e3d6'][i]) + text(x + 23, active ? 365 : 373, ['orbit', 'Today / 03', 'FORM'][i], 25, '#28372f', 700) + text(x, 502, label, 16, '#20251d', 700));
                            });
                            cursor = [490, 380]; caption = 'Explore projects and responsive interfaces';
                            if (t > 6.1) add(rect(579, 194, 280, 65, '#20251d') + text(598, 221, 'Built for every screen', 16, '#fff', 700) + text(598, 244, 'HTML  /  CSS  /  JavaScript', 12, '#dce5c5'));
                        }
                    } else if (kind === 1) {
                        caption = 'A landing page that brings ideas to life'; cursor = [265, 443];
                        if (t < 2.5) {
                            const dot = 7 * Math.sin(t * 2);
                            add(`<circle cx="${804 + dot}" cy="244" r="12" fill="#b59bdc"/>`);
                        } else {
                            add(rect(96, 131, 808, 433, '#fff', 0) + text(140, 175, 'orbit', 23, '#6550aa', 700) + text(541, 174, 'Features      About      Pricing', 12, '#716b80') + text(140, 237, 'Everything you need to grow.', 31, '#302444', 700));
                            ['Create', 'Connect', 'Grow'].forEach((label, i) => { const x = 140 + 241 * i; add(rect(x, 270, 219, 129, '#f5f2fc') + text(x + 20, 306, '0' + (i + 1), 13, '#7155bf') + text(x + 20, 344, label, 23, '#302444', 700) + text(x + 20, 374, ['Make your next idea real.', 'Bring your team together.', 'See your progress clearly.'][i], 12, '#81758e')); });
                            const yearly = t > 5.5;
                            add(rect(140, 422, 700, 106, '#7155bf') + text(164, 458, 'One simple plan.', 24, '#fff', 700) + text(164, 490, yearly ? '$12 / month, billed yearly' : '$15 / month, billed monthly', 16, '#fff') + rect(636, 447, 178, 48, '#fff', 24) + text(660, 477, yearly ? 'Yearly  -20%' : 'Switch to yearly', 14, '#7155bf', 700));
                            cursor = [730, 475]; caption = yearly ? 'Switch plans with a click' : 'Features, benefits and simple pricing';
                        }
                    } else if (kind === 2) {
                        const adding = t < 3, completed = t >= 5.5;
                        const typed = 'Review mobile layout'.slice(0, Math.floor(Math.max(0, t - .5) * 13));
                        add(rect(280, 216, 512, 343, '#fff', 0) + rect(296, 224, 482, 44, '#f0f5f3') + text(313, 252, adding ? typed || 'Add a new task...' : 'Add a new task...', 13, '#38564a') + rect(699, 229, 73, 34, '#397560', 7) + text(714, 251, '+ Add', 12, '#fff') + text(297, 302, 'Today', 14, '#315e4f', 700) + text(700, 302, adding ? '3 tasks' : '4 tasks', 12, '#8c9e97'));
                        const tasks = ['Plan the project layout', 'Build the responsive components', 'Add the finishing touches'];
                        if (!adding) tasks.push('Review mobile layout');
                        tasks.forEach((label, i) => { const y = 319 + i * 51, checked = i === 0 || (completed && i === 1); add(rect(297, y, 482, 44, checked ? '#edf4ef' : '#f7f9f8') + rect(313, y + 13, 19, 19, checked ? '#59937c' : '#d9e5de', 5) + text(348, y + 28, label, 14, checked ? '#80988b' : '#38564a')); if (checked) add(`<path d="M317 ${y + 22}l5 5 8-10" stroke="white" fill="none" stroke-width="2"/><path d="M348 ${y + 24}h${label.length * 7}" stroke="#80988b"/>`); });
                        add(rect(298, 538, 480, 5, '#e9f0ec', 2) + rect(298, 538, completed ? 240 : 120, 5, '#59937c', 2));
                        cursor = t < 3 ? [737, 249] : [324, 392]; caption = completed ? 'Complete tasks. See your progress.' : adding ? 'Capture a new task in seconds' : 'Your new task, added instantly';
                    } else {
                        const black = t >= 2.5 && t < 5, cream = t >= 5;
                        if (black || cream) {
                            scene.querySelectorAll('[fill="#665344"], [stroke="#57473a"]').forEach(el => { if (el.hasAttribute('fill')) el.setAttribute('fill', black ? '#303635' : '#beb8aa'); else el.setAttribute('stroke', black ? '#303635' : '#beb8aa'); });
                            scene.querySelectorAll('[fill="#bca184"], [stroke="#b59b7f"]').forEach(el => { if (el.hasAttribute('fill')) el.setAttribute('fill', black ? '#606763' : '#e5dfd2'); else el.setAttribute('stroke', black ? '#606763' : '#e5dfd2'); });
                            add(`<circle cx="${black ? 569 : 603}" cy="422" r="15" fill="none" stroke="#56483c" stroke-width="2"/>`);
                        }
                        cursor = t < 2.5 ? [535, 422] : t < 5 ? [569, 422] : t < 6.7 ? [603, 422] : [695, 480];
                        caption = 'Explore finishes. Find your favourite.';
                        if (t > 7) {
                            add(rect(522, 457, 326, 43, '#397560', 7) + text(625, 484, 'Added to bag ✓', 13, '#fff') + rect(583, 149, 273, 39, '#fff', 0) + text(594, 173, 'Shop      Collection      Bag (1)', 12, '#827368'));
                            caption = 'From product discovery to add-to-bag';
                        }
                    }
                    const pulse = Math.max(0, 1 - ((t % 2.5) / .5));
                    if (pulse > 0) add(`<circle cx="${cursor[0]}" cy="${cursor[1]}" r="${10 + 18 * (1 - pulse)}" fill="none" stroke="#555" stroke-opacity="${pulse * .3}" stroke-width="2"/>`);
                    add(`<path d="M${cursor[0]} ${cursor[1]}l0 21 6-5 5 10 5-3-5-9 8-1Z" fill="#252525" stroke="white" stroke-width="1.5"/>` + text(500, 614, caption, 17, '#525953'));
                    scene.lastElementChild.querySelector('text').setAttribute('text-anchor', 'middle');
                };
            }, { svg, kind: index });
            for (let frame = 0; frame < 135; frame++) {
                await page.evaluate(t => window.renderFrame(t), frame / 15);
                await page.screenshot({ path: path.join(frames, String(frame).padStart(4, '0') + '.png') });
            }
            const output = path.join(root, 'videos', name + '-demo.mp4');
            const ffmpeg = path.join(__dirname, 'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
            const result = spawnSync(ffmpeg, ['-y', '-framerate', '15', '-i', path.join(frames, '%04d.png'), '-t', '9', '-r', '30', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output], { windowsHide: true, encoding: 'utf8' });
            if (result.status !== 0) throw new Error(result.stderr);
            console.log(JSON.stringify({ name, bytes: fs.statSync(output).size, seconds: 9 }));
        }
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
