// Set each video's data-preview-src in index.html to its project clip path.
// Empty sources keep the existing thumbnail without requesting missing files.
(() => {
    const previewSeconds = 9;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverAvailable = window.matchMedia('(hover: hover)');
    const stopAll = [];

    document.querySelectorAll('.project-card').forEach((card) => {
        const video = card.querySelector('.project-preview');
        const button = card.querySelector('.preview-toggle');
        const source = video?.dataset.previewSrc;
        if (!source || !button) return;

        const title = card.querySelector('h3').textContent;
        let requested = false;
        let revision = 0;
        let timer;
        video.muted = true;
        video.src = source;
        button.hidden = false;

        function updateButton(playing) {
            button.textContent = playing ? 'Stop preview' : 'Play preview';
            button.setAttribute('aria-label', `${playing ? 'Stop' : 'Play'} ${title} preview`);
            button.setAttribute('aria-pressed', String(playing));
        }

        function stop() {
            requested = false;
            revision++;
            clearTimeout(timer);
            video.pause();
            if (video.readyState > 0) video.currentTime = 0;
            card.classList.remove('preview-playing');
            updateButton(false);
        }
        stopAll.push(stop);

        async function start() {
            if (requested) return;
            stopAll.forEach((stopPreview) => stopPreview());
            requested = true;
            const attempt = ++revision;
            if (video.readyState > 0) video.currentTime = 0;
            try {
                await video.play();
                if (!requested || attempt !== revision) return;
                card.classList.add('preview-playing');
                updateButton(true);
            } catch {
                if (attempt === revision) stop();
            }
        }

        function repeat() {
            if (!requested) return;
            clearTimeout(timer);
            video.currentTime = 0;
            video.play().catch(stop);
        }

        video.addEventListener('playing', () => {
            if (!requested) { video.pause(); return; }
            clearTimeout(timer);
            timer = setTimeout(repeat, Math.max(0, previewSeconds - video.currentTime) * 1000);
        });
        video.addEventListener('waiting', () => clearTimeout(timer));
        video.addEventListener('timeupdate', () => {
            if (requested && video.currentTime >= previewSeconds) repeat();
        });
        video.addEventListener('ended', repeat);
        video.addEventListener('error', () => { stop(); button.hidden = true; });
        card.addEventListener('pointerenter', (event) => {
            if (event.pointerType !== 'touch' && hoverAvailable.matches && !reducedMotion.matches) start();
        });
        card.addEventListener('pointerleave', (event) => {
            if (event.pointerType !== 'touch') stop();
        });
        button.addEventListener('click', () => requested ? stop() : start());
        card.addEventListener('focusout', (event) => {
            if (!card.contains(event.relatedTarget)) stop();
        });
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') stop();
        });
        new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) stop();
        }).observe(card);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAll.forEach((stop) => stop());
    });
    reducedMotion.addEventListener('change', () => stopAll.forEach((stop) => stop()));
})();
