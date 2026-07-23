async function imageToBase64(imgElement) {
    if (!imgElement) return "";
    const src = imgElement.src;
    try {
        const response = await fetch(src);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch {
        return src;
    }
}

export async function generateCvPdf() {

    try {

        // ============================
        // 1. EXTRAER DATOS DEL DOM
        // ============================
        const profileImageBase64 = await imageToBase64(document.querySelector(".imagen-perfil"));

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

            summary: `<p>Desarrollador Full Stack con experiencia en Laravel, Python y tecnologías cloud (AWS). Formación en Ingeniería en Informática con base en Administración de Empresas. Enfocado en infraestructura, redes y ciberseguridad. Inglés nivel C1.</p>`,

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

            techStack: `
                <div class="card">
                    <strong>Lenguajes</strong>
                    <p>Python, PHP, JavaScript, TypeScript, C#</p>
                </div>
                <div class="card">
                    <strong>Frameworks</strong>
                    <p>Laravel, Django, React, Vue, Next.js, Tailwind CSS</p>
                </div>
                <div class="card">
                    <strong>Cloud & Infraestructura</strong>
                    <p>AWS (EC2, S3, VPC, RDS), Azure, Linux, Windows Server</p>
                </div>
                <div class="card">
                    <strong>Bases de Datos</strong>
                    <p>PostgreSQL, MySQL, MongoDB, Oracle Database, Firebase</p>
                </div>
                <div class="card">
                    <strong>Herramientas</strong>
                    <p>Git, Kali Linux, Nmap, VirtualBox, Android Studio</p>
                </div>
            `,

            projects: [...document.querySelectorAll(".proyecto-card")]
                .map(card => {
                    const title = card.querySelector(".titulo-proyecto")?.textContent || "";
                    const desc = card.querySelector(".contenido-proyecto p")?.textContent || "";
                    const tech = card.querySelector(".tech-mini")?.textContent || "";

                    return `
                        <div class="card">
                            <strong>${title}</strong>
                            <p>${desc}</p>
                            <p class="muted">${tech}</p>
                        </div>
                    `;
                }).join(""),

            // Solo certificaciones relevantes: AWS, Full Stack, Infraestructura TI, Inglés
            certifications: (() => {
                const certs = [...document.querySelectorAll(".cert-card")];
                const relevantTitles = [
                    'AWS Academy Graduate',
                    'Desarrollador Full Stack',
                    'Infraestructura de TI segura',
                    'Inglés'
                ];

                return certs
                    .filter(card => {
                        const title = card.querySelector('.title')?.textContent || "";
                        return relevantTitles.some(r => title.includes(r));
                    })
                    .map(card => {
                        const title = card.querySelector('.title')?.textContent || "";
                        const issuer = card.querySelector('.subtitle')?.textContent || "";

                        return `
                            <li class="cert-item">
                                <strong>${title}</strong>
                                <span>${issuer}</span>
                            </li>
                        `;
                    }).join("");
            })(),

            profileImage: profileImageBase64

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
