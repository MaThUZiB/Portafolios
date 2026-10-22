// Manual carousel. Native scrolling remains available without JavaScript.
(() => {
    const track = document.getElementById('projectTrack');
    if (!track) return;
    const cards = [...track.querySelectorAll('.proyecto-card')];
    const previous = document.getElementById('projectPrev');
    const next = document.getElementById('projectNext');
    const count = document.getElementById('projectCount');
    let active = 0;
    function sync() {
        const left = track.getBoundingClientRect().left;
        active = cards.reduce((best, card, index) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? index : best, 0);
        previous.disabled = active === 0;
        next.disabled = active === cards.length - 1;
        count.textContent = `${active + 1} / ${cards.length}`;
        const english = document.documentElement.lang === 'en';
        previous.setAttribute('aria-label', english ? 'Previous project' : 'Proyecto anterior');
        next.setAttribute('aria-label', english ? 'Next project' : 'Proyecto siguiente');
        track.setAttribute('aria-label', english ? 'Featured projects' : 'Proyectos destacados');
    }
    function go(index) {
        const target = Math.max(0, Math.min(cards.length - 1, index));
        const offset = cards[target].getBoundingClientRect().left - track.getBoundingClientRect().left;
        track.scrollBy({left: offset, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    }
    previous.addEventListener('click', () => go(active - 1));
    next.addEventListener('click', () => go(active + 1));
    track.addEventListener('keydown', event => {
        if (event.target !== track) return;
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            go(event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1));
        }
    });
    track.addEventListener('scroll', sync, {passive: true});
    new ResizeObserver(sync).observe(track);
    new MutationObserver(sync).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
    sync();
})();
