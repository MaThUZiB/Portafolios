import { galleries } from './gallery-data.js';
const section = document.querySelector('[data-gallery]');
const entries = galleries[section?.dataset.gallery] || [];
if (section && entries.length) {
    const grid = section.querySelector('.gallery-grid');
    for (const entry of entries) {
        const figure = document.createElement('figure');
        const link = document.createElement('a');
        link.href = entry.src;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        const img = document.createElement('img');
        img.src = entry.src;
        img.loading = 'lazy';
        const caption = document.createElement('figcaption');
        const update = () => {
            img.alt = entry[document.documentElement.lang] || entry.es;
            caption.textContent = img.alt;
        };
        update();
        new MutationObserver(update).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
        link.append(img);
        figure.append(link, caption);
        grid.append(figure);
    }
    section.hidden = false;
}
