export async function generateCvPdf() {

    // ============================
    // 1. Obtener datos desde tu web
    // ============================
    const data = {
        name: document.querySelector(".animated-title")?.textContent.trim(),
        titles: [
            document.querySelector('[data-key="title_1"]')?.textContent,
            document.querySelector('[data-key="title_2"]')?.textContent,
            document.querySelector('[data-key="title_3"]')?.textContent
        ].filter(Boolean).join(" | "),

        contact: [
            `Email: ${document.querySelector(".correo")?.textContent}`,
            `Teléfono: ${document.querySelector(".tele")?.textContent}`,
            `Ubicación: ${document.querySelector(".ciudad")?.textContent}`,
            `GitHub: github.com/MaThUZiB`
        ].map(c => `<li>${c}</li>`).join(""),

        about: ['about_1', 'about_2', 'about_3', 'about_4', 'about_5', 'about_6']
            .map(key => document.querySelector(`[data-key="${key}"]`)?.textContent)
            .filter(Boolean)
            .map(p => `<p>${p}</p>`)
            .join(""),

        education: [...document.querySelectorAll("#educacion .timeline-card")]
            .map(card => {
                const title = card.querySelector("h4")?.textContent;
                const inst = card.querySelector(".empresa")?.textContent;
                const date = card.querySelector(".fecha")?.textContent;

                return `
        <div class="card">
            <strong>${title}</strong>
            <p>${inst}</p>
            <p>${date}</p>
        </div>
        `;
            }).join(""),

        certifications: [...document.querySelectorAll(".cert-card")]
            .map(card => {
                const title = card.querySelector('.title')?.textContent;
                const issuer = card.querySelector('.subtitle')?.textContent;
                return title ? `<li><strong>${title}</strong><br>${issuer}</li>` : "";
            }).join(""),

        experience: [...document.querySelectorAll("#experiencia .timeline-card")]
            .map(card => {
                const title = card.querySelector("h4")?.textContent;
                const company = card.querySelector(".empresa")?.textContent;
                const date = card.querySelector(".fecha")?.textContent;
                const desc = card.querySelector("p")?.textContent;

                return `
        <div class="card">
            <strong>${title} - ${company}</strong>
            <p>${date}</p>
            <p>${desc}</p>
        </div>
        `;
            }).join(""),

        projects: [...document.querySelectorAll(".proyecto-card")]
            .map(card => {
                const title = card.querySelector('[data-key^="project"]')?.textContent;
                const desc = card.querySelector(".contenido-proyecto p")?.textContent;

                return title ? `
        <div class="card">
            <strong>${title}</strong>
            <p>${desc || ""}</p>
        </div>
        ` : "";
            }).join(""),

        profileImage: document.querySelector(".imagen-perfil")?.src || ""
    };

    // ============================
    // 2. Cargar plantilla.html
    // ============================
    const response = await fetch("plantilla.html");
    let template = await response.text();

    // ============================
    // 3. Reemplazar variables
    // ============================
    Object.keys(data).forEach(key => {
        template = template.replaceAll(`{{${key}}}`, data[key] || "");
    });

    // ============================
    // 4. Crear contenedor temporal
    // ============================
    const container = document.createElement("div");
    container.innerHTML = template;
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.width = '100%';
    container.style.height = 'auto';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.appendChild(container);

    // ============================
    // 5. Generar PDF
    // ============================
    const opt = {
        margin: 0,
        filename: `CV_Ivan_Matus.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#0f172a'
        },
        jsPDF: { unit: 'mm', format: 'a4' },
        pagebreak: { mode: ['css', 'legacy'] } // 👈 cambia esto
    };

    await html2pdf()
        .set(opt)
        .from(container)
        .save();

    // limpiar
    document.body.removeChild(container);
}

// botón
document.getElementById("downloadCvBtn")
    .addEventListener("click", generateCvPdf);