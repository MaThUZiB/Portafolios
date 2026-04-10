import { initAnimations } from "./animations.js";
import { translations } from "./traduccion.js";
import { generateCvPdf } from "./cvGenerator.js";

// -------------------------------
// Estado global traducción
// -------------------------------
let currentLanguage = 'es';
let originalSpanishTexts = {};

// -------------------------------
// INICIALIZACIÓN SEGURA
// -------------------------------
window.addEventListener("DOMContentLoaded", () => {

    // Animaciones
    initAnimations();

    // Guardar textos originales
    storeOriginalTexts();

    // Botón traducción
    const translateBtn = document.getElementById("translateBtn");
    if (translateBtn) {
        translateBtn.addEventListener("click", () => {
            currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
            translatePage(currentLanguage);
        });
    }

    // Copiar email y teléfono
    setupClipboard();

});

// -------------------------------
// TRADUCCIÓN
// -------------------------------
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
                    if (el.tagName === 'IMG') {
                        el.alt = originalSpanishTexts[key]?.alt || el.alt;
                    } else {
                        el.textContent = originalSpanishTexts[key]?.text || el.textContent;
                    }
                } else {
                    const translated = translations?.[language]?.[key];
                    if (translated) {
                        if (el.tagName === 'IMG') {
                            el.alt = translated;
                        } else {
                            el.textContent = translated;
                        }
                    }
                }
            });

            gsap.fromTo(elements,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.2, stagger: 0.03 }
            );
        }
    });

    const translateBtn = document.getElementById('translateBtn');
    if (translateBtn) {
        translateBtn.innerHTML = language === 'es'
            ? '<i class="fa-solid fa-language"></i> English'
            : '<i class="fa-solid fa-language"></i> Español';
    }
}

// -------------------------------
// PORTAPAPELES
// -------------------------------
function setupClipboard() {

    const items = [
        { id: 'emailCopy', selector: '.correo', message: 'Correo copiado' },
        { id: 'phoneCopy', selector: '.tele', message: 'Número copiado' }
    ];

    items.forEach(item => {
        const el = document.getElementById(item.id);
        if (!el) return;

        el.addEventListener('click', async () => {
            const text = el.querySelector(item.selector)?.textContent?.trim();
            if (!text) return;

            try {
                await navigator.clipboard.writeText(text);
                showToastMessage(item.message, el);
            } catch (err) {
                showToastMessage('No se pudo copiar', el);
            }
        });
    });
}

// -------------------------------
// TOAST
// -------------------------------
function showToastMessage(message, referenceElement) {

    const existing = document.getElementById('clipboardToast');
    if (existing) existing.remove();

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
        transition: 'all 150ms ease',
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
    });

    document.body.appendChild(toast);

    const rect = referenceElement.getBoundingClientRect();

    toast.style.left = `${window.scrollX + rect.left + rect.width / 2}px`;
    toast.style.top = `${window.scrollY + rect.top - 10}px`;
    toast.style.transform = 'translate(-50%, -100%)';

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, -110%)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -100%)';
        setTimeout(() => toast.remove(), 200);
    }, 800);
}

// -------------------------------
// SCROLL RESET
// -------------------------------
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener("load", () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});
window.addEventListener("pageshow", () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});