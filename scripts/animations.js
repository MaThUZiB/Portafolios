// -------------------------------
// Animaciones iniciales con GSAP
// -------------------------------

// Animación inicial de la primera presentación
export function animatePre1() {
    gsap.from(".pre-1", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
    });
}

// Animación del título principal
export function animateTitle() {
    gsap.set(".animated-title", {
        opacity: 0,
        y: 60
    });

    gsap.from(".animated-title span", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.05
    });

    gsap.to(".animated-title", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
    });
}

// Animación de los subtítulos de presentación
export function animateSubtitles() {
    gsap.from(".titulos-presentacion", {
        opacity: 0,
        x: -30,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.5
    });
}

// Animación de contactos
export function animateContacts() {
    gsap.from(".contactos", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.8
    });
}

// Animación de cuadros
export function animateCuadros() {
    gsap.from(".cuadros", {
        scrollTrigger: ".cuadros",
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out"
    });
}

// Animaciones por secciones (scroll)
export function animateSections() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".acerca, .tecnologias, .proyectos, .certiffi, .tabla")
        .forEach(section => {
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

    gsap.utils.toArray(".proyecto-card, .categoria, .certificaciones")
        .forEach(card => {
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
}

// Animación hover de cajas
export function setupBoxHover() {
    document.querySelectorAll(".box").forEach(box => {
        box.addEventListener("mouseenter", () => {
            gsap.to(box, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });
        box.addEventListener("mouseleave", () => {
            gsap.to(box, { scale: 1, duration: 0.3 });
        });
    });

    document.querySelectorAll(".titulos-presentacion div").forEach(el => {
        el.addEventListener("mouseenter", () => {
            gsap.to(el, { x: 10, scale: 1.05, duration: 0.2, ease: "power2.out" });
        });
        el.addEventListener("mouseleave", () => {
            gsap.to(el, { x: 0, scale: 1, duration: 0.2, ease: "power2.out" });
        });
    });
}

// Función principal para inicializar todas las animaciones
export function initAnimations() {
    animatePre1();
    animateTitle();
    animateSubtitles();
    animateContacts();
    animateCuadros();
    animateSections();
    setupBoxHover();
}