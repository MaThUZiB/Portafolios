export async function generateCvPdf() {

    try {

        // ============================
        // 1. EXTRAER DATOS DEL DOM
        // ============================
        const data = {
            name: document.querySelector(".animated-title")?.textContent.trim() || "",

            titles: [
                document.querySelector('[data-key="title_1"]')?.textContent,
                document.querySelector('[data-key="title_2"]')?.textContent,
                document.querySelector('[data-key="title_3"]')?.textContent
            ].filter(Boolean).join(" | "),

            contact: [
                `Email: ${document.querySelector(".correo")?.textContent || ""}`,
                `Teléfono: ${document.querySelector(".tele")?.textContent || ""}`,
                `Ubicación: ${document.querySelector(".ciudad")?.textContent || ""}`,
                `GitHub: github.com/MaThUZiB`
            ].map(c => `<li>${c}</li>`).join(""),

            about: [
                'about_1', 'about_2', 'about_3',
                'about_4', 'about_5', 'about_6'
            ]
                .map(key => document.querySelector(`[data-key="${key}"]`)?.textContent)
                .filter(Boolean)
                .map(p => `<p>${p}</p>`)
                .join(""),

            education: [...document.querySelectorAll("#educacion .timeline-card")]
                .map(card => {
                    const title = card.querySelector("h4")?.textContent || "";
                    const inst = card.querySelector(".empresa")?.textContent || "";
                    const date = card.querySelector(".fecha")?.textContent || "";

                    return `
                        <div class="card">
                            <strong>${title}</strong>
                            <p>${inst}</p>
                            <p>${date}</p>
                        </div>
                    `;
                }).join(""),

            experience: [...document.querySelectorAll("#experiencia .timeline-card")]
                .map(card => {
                    const title = card.querySelector("h4")?.textContent || "";
                    const company = card.querySelector(".empresa")?.textContent || "";
                    const date = card.querySelector(".fecha")?.textContent || "";
                    const desc = card.querySelector("p")?.textContent || "";

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
                    const title = card.querySelector(".titulo-proyecto")?.textContent || "";
                    const desc = card.querySelector(".contenido-proyecto p")?.textContent || "";

                    return `
                        <div class="card">
                            <strong>${title}</strong>
                            <p>${desc}</p>
                        </div>
                    `;
                }).join(""),

            certifications: [...document.querySelectorAll(".cert-card")]
                .map(card => {
                    const title = card.querySelector('.title')?.textContent || "";
                    const issuer = card.querySelector('.subtitle')?.textContent || "";

                    return title
                        ? `<li class="cert-item">
                    <strong>${title}</strong>
                    <span>${issuer}</span></li>`
                        : "";
                }).join(""),

            profileImage: document.querySelector(".imagen-perfil")?.src || ""
        };

        // ============================
        // 2. CARGAR PLANTILLA
        // ============================
        const response = await fetch("plantilla.html");

        if (!response.ok) {
            throw new Error("No se pudo cargar plantilla.html");
        }

        let template = await response.text();

        // ============================
        // 3. REEMPLAZO DE VARIABLES
        // ============================
        Object.entries(data).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, "g");
            template = template.replace(regex, value || "");
        });

        // ============================
        // 4. ABRIR EN NUEVA VENTANA E IMPRIMIR
        // ============================
        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            throw new Error("No se pudo abrir ventana. Permita pop-ups para este sitio.");
        }

        printWindow.document.write(template);
        printWindow.document.close();

        // Esperar a que cargue el contenido y estilos
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };

    } catch (err) {
        console.error("Error generando CV:", err);
        alert("Error al abrir el CV. Verifique que los pop-ups estén permitidos.");
    }
}

// botón
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("downloadCvBtn");
    if (btn) {
        btn.addEventListener("click", generateCvPdf);
    }
});
