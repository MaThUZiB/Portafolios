export function initParticles() {
  const canvas = document.createElement("canvas");
  canvas.id = "particles-canvas";
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    zIndex: "0",
    pointerEvents: "none"
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2.5 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.3;
        this.x -= dx / dist * force;
        this.y -= dy / dist * force;
      }
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: Math.min(80, Math.floor(w * h / 15000)) }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", init);
  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  init();
  animate();
}

export function initScrollProgress() {
  const bar = document.createElement("div");
  bar.id = "scroll-progress";
  Object.assign(bar.style, {
    position: "fixed",
    top: "0",
    left: "0",
    height: "3px",
    width: "0%",
    background: "linear-gradient(90deg, #A855F7, #C084FC, #EC4899)",
    zIndex: "10000",
    transition: "width 0.1s linear",
    boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)"
  });
  document.body.prepend(bar);

  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = p + "%";
  });
}

export function initMouseGlow() {
  const glow = document.createElement("div");
  glow.id = "mouse-glow";
  Object.assign(glow.style, {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: "1",
    transform: "translate(-50%, -50%)",
    transition: "left 0.15s ease-out, top 0.15s ease-out"
  });
  document.body.prepend(glow);

  window.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

let typewriterState = null;

export function initTypewriter() {
  const container = document.querySelector(".titulos-presentacion");
  if (!container) return;

  if (typewriterState && typewriterState.stop) {
    typewriterState.stop();
  }

  const items = [...container.querySelectorAll("div")];
  items.forEach(el => { el.style.display = "none"; el.textContent = ""; });

  const texts = items.map(el => el.getAttribute("data-original") || el.textContent);

  items.forEach((el, i) => {
    el.setAttribute("data-original", texts[i]);
  });

  let index = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentEl = items[0];
  let timeoutId = null;

  function type() {
    if (!currentEl) return;
    const fullText = currentEl.getAttribute("data-original") || "";

    if (!isDeleting) {
      charIndex++;
      currentEl.style.display = "block";
      currentEl.textContent = fullText.substring(0, charIndex);
      if (charIndex === fullText.length) {
        timeoutId = setTimeout(() => { isDeleting = true; type(); }, 2500);
        return;
      }
      timeoutId = setTimeout(type, 40 + Math.random() * 30);
    } else {
      charIndex--;
      currentEl.textContent = fullText.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        currentEl.style.display = "none";
        index = (index + 1) % items.length;
        currentEl = items[index];
        timeoutId = setTimeout(type, 300);
        return;
      }
      timeoutId = setTimeout(type, 20 + Math.random() * 20);
    }
  }

  timeoutId = setTimeout(type, 1500);

  typewriterState = {
    stop: () => { if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; } },
    items,
    texts
  };
  return typewriterState;
}

export function restartTypewriter() { initTypewriter(); }

export function initTilt() {
  const cards = document.querySelectorAll(
    ".proyecto-card, .categoria, .cert-card, .timeline-card, .box"
  );

  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      card.style.setProperty("--rx", rotateX + "deg");
      card.style.setProperty("--ry", rotateY + "deg");
      card.style.setProperty("--s", "1.02");
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--s", "1");
    });
  });
}
