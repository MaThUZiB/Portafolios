import { translations } from './traduccion.js';

// Keep the original markup so emphasis and links survive language changes.
const originals = new Map();
document.querySelectorAll('[data-key]').forEach(el => originals.set(el, el.innerHTML));
const button = document.getElementById('translateBtn');
let language = 'es';
function applyLanguage(next) {
    language = next;
    document.documentElement.lang = language;
    originals.forEach((original, el) => {
        if (language === 'es') el.innerHTML = original;
        else if (translations.en[el.dataset.key]) el.textContent = translations.en[el.dataset.key];
    });
    button.textContent = language === 'es' ? 'English' : 'Español';
    button.setAttribute('aria-label', language === 'es' ? 'Switch to English' : 'Cambiar a español');
    document.querySelector('nav').setAttribute('aria-label', language === 'es' ? 'Principal' : 'Main');
    try { sessionStorage.setItem('portfolio-language', language); } catch {}
}
button?.addEventListener('click', () => applyLanguage(language === 'es' ? 'en' : 'es'));
try { if (sessionStorage.getItem('portfolio-language') === 'en') applyLanguage('en'); } catch {}
