import { initAnimations } from "./animations.js";
import { translations } from "./traduccion.js";

// -------------------------------
// Inicializar animaciones al cargar
// -------------------------------
window.addEventListener("load", () => {
    initAnimations();
});

// -------------------------------
// Traducción
// -------------------------------
let currentLanguage = 'es';
let originalSpanishTexts = {};

function storeOriginalTexts() {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (element.tagName === 'IMG') {
            originalSpanishTexts[key] = { alt: element.alt };
        } else {
            originalSpanishTexts[key] = { text: element.textContent };
        }
    });

    const titleElements = document.querySelectorAll('[data-key-title]');
    titleElements.forEach(element => {
        const key = element.getAttribute('data-key-title');
        originalSpanishTexts[key] = { title: element.title };
    });
}

function translatePage(language) {
    const elements = document.querySelectorAll('[data-key]');
    gsap.to(elements, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        onComplete: () => {
            elements.forEach(el => {
                const key = el.getAttribute('data-key');
                if (language === 'es') {
                    if (el.tagName === 'IMG') el.alt = originalSpanishTexts[key]?.alt || el.alt;
                    else el.textContent = originalSpanishTexts[key]?.text || el.textContent;
                } else if (translations[language] && translations[language][key]) {
                    if (el.tagName === 'IMG') el.alt = translations[language][key];
                    else el.textContent = translations[language][key];
                }
            });

            const titleElements = document.querySelectorAll('[data-key-title]');
            titleElements.forEach(el => {
                const key = el.getAttribute('data-key-title');
                if (language === 'es') el.title = originalSpanishTexts[key]?.title || el.title;
                else if (translations[language] && translations[language][key]) el.title = translations[language][key];
            });

            gsap.fromTo(elements,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.2, stagger: 0.03, ease: "power2.out" }
            );
        }
    });

    const translateBtn = document.getElementById('translateBtn');
    translateBtn.innerHTML = language === 'es'
        ? '<i class="fa-solid fa-language"></i> English'
        : '<i class="fa-solid fa-language"></i> Español';
}

window.addEventListener('load', storeOriginalTexts);
document.getElementById('translateBtn').addEventListener('click', () => {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    translatePage(currentLanguage);
});

// -------------------------------
// Copiar al portapapeles
// -------------------------------
function showToastMessage(message, referenceElement) {
    const existingToast = document.getElementById('clipboardToast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'clipboardToast';
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'absolute',
        zIndex: '9999',
        padding: '10px 14px',
        borderRadius: '999px',
        backgroundColor: 'rgba(17,17,17,0.9)',
        color: '#fff',
        fontSize: '0.88rem',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 10px 22px rgba(0,0,0,0.18)',
        opacity: '0',
        transition: 'opacity 150ms ease, transform 150ms ease',
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
    });

    document.body.appendChild(toast);
    const rect = referenceElement.getBoundingClientRect();
    const top = window.scrollY + rect.top - 10;
    const left = window.scrollX + rect.left + rect.width / 2;

    toast.style.left = `${left}px`;
    toast.style.top = `${top}px`;
    toast.style.transform = 'translate(-50%, -100%) scale(0.95)';

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, -110%) scale(1)';
    });

    clearTimeout(window.clipboardToastTimeout);
    window.clipboardToastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -100%) scale(0.95)';
        setTimeout(() => toast.remove(), 160);
    }, 800);
}

['emailCopy', 'phoneCopy'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', async () => {
            const selector = id === 'emailCopy' ? '.correo' : '.tele';
            const text = el.querySelector(selector)?.textContent?.trim();
            if (!text) return;

            try {
                await navigator.clipboard.writeText(text);
                showToastMessage(id === 'emailCopy' ? 'Correo copiado' : 'Número copiado', el);
            } catch {
                showToastMessage('No se pudo copiar', el);
            }
        });
    }
});

// -------------------------------
// Botón de descarga CV
// -------------------------------
document.getElementById('downloadCvBtn')?.addEventListener('click', generateCvPdf);

// -------------------------------
// Scroll al top al recargar
// -------------------------------
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const resetScrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
['load','pageshow','beforeunload'].forEach(ev => window.addEventListener(ev, resetScrollToTop));
