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

        about: ['about_1','about_2','about_3','about_4','about_5','about_6']
            .map(key => document.querySelector(`[data-key="${key}"]`)?.textContent)
            .filter(Boolean)
            .map(p => `<p>${p}</p>`)
            .join(""),

        education: [...document.querySelectorAll("#educacion .timeline-card")]
            .map(card => {
                const title = card.querySelector("h4")?.textContent;
                const inst = card.querySelector(".empresa")?.textContent;
                const date = card.querySelector(".fecha")?.textContent;
                return `<p>${date} - ${title} ${inst ? "| " + inst : ""}</p>`;
            }).join(""),

        experience: [...document.querySelectorAll("#experiencia .timeline-card")]
            .map(card => {
                const title = card.querySelector("h4")?.textContent;
                const company = card.querySelector(".empresa")?.textContent;
                const date = card.querySelector(".fecha")?.textContent;
                const desc = card.querySelector("p")?.textContent;
                return `<p><strong>${title}</strong> - ${company} (${date})<br>${desc}</p>`;
            }).join(""),

        projects: [...document.querySelectorAll(".proyecto-card")]
            .map(card => {
                const title = card.querySelector('[data-key^="project"]')?.textContent;
                const desc = card.querySelector(".contenido-proyecto p")?.textContent;
                return title ? `<p><strong>${title}</strong><br>${desc || ""}</p>` : "";
            }).join(""),

        certifications: ['cert1_title','cert2_title','cert3_title','cert4_title','cert5_title','cert6_title']
            .map(key => document.querySelector(`[data-key="${key}"]`)?.textContent)
            .filter(Boolean)
            .map(c => `<li>${c}</li>`)
            .join("")
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
        template = template.replace(`{{${key}}}`, data[key] || "");
    });

    // ============================
    // 4. Crear contenedor temporal
    // ============================
    const container = document.createElement("div");
    container.innerHTML = template;
    document.body.appendChild(container);

    // ============================
    // 5. Generar PDF
    // ============================
    const opt = {
        margin: 10,
        filename: `CV_Ivan_Matus.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4' }
    };

    await html2pdf().set(opt).from(container).save();

    // limpiar
    document.body.removeChild(container);
}

// botón
document.getElementById("downloadCvBtn")
    .addEventListener("click", generateCvPdf);