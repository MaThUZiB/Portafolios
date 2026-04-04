gsap.from(".pre-1 img", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out"
});

// Set initial state for animated title
gsap.set(".animated-title", {
    opacity: 0,
    y: 60
});

// Animate animated title
gsap.to(".animated-title", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.2
});

gsap.from(".titulos-presentacion div", {
    opacity: 0,
    x: -30,
    duration: 0.8,
    stagger: 0.2,
    delay: 0.5
});

gsap.from(".contactos", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.8
});

gsap.from(".cuadros", {
    scrollTrigger: ".cuadros",
    opacity: 0,
    y: 60,
    duration: 1,
    ease: "power3.out"
});

gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray(".acerca, .tecnologias, .proyectos, .certiffi, .tabla").forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out"
    });
});

gsap.utils.toArray(".proyecto-card, .categoria, .certificaciones").forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
        },
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: "power2.out"
    });
});

document.querySelectorAll(".box").forEach(box => {
    box.addEventListener("mouseenter", () => {
        gsap.to(box, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    box.addEventListener("mouseleave", () => {
        gsap.to(box, {
            scale: 1,
            duration: 0.3
        });
    });
});

// Translation functionality
let currentLanguage = 'es';

function translatePage(language) {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
    
    // Update button text
    const translateBtn = document.getElementById('translateBtn');
    if (language === 'es') {
        translateBtn.innerHTML = '<i class="fa-solid fa-language"></i> English';
    } else {
        translateBtn.innerHTML = '<i class="fa-solid fa-language"></i> Español';
    }
}

document.getElementById('translateBtn').addEventListener('click', () => {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    translatePage(currentLanguage);
});

// Force page to start at the top on reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
const resetScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
};
window.addEventListener('load', resetScrollToTop);
window.addEventListener('pageshow', resetScrollToTop);
window.addEventListener('beforeunload', resetScrollToTop);