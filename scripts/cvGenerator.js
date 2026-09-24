/* Script clásico (funciona local en file:// y online en http/https) */
(function () {
    "use strict";

    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    function imageToBase64(img) {
        if (!img) return Promise.resolve("");
        return fetch(img.src)
            .then(function (r) { return r.blob(); })
            .then(function (blob) {
                return new Promise(function (resolve, reject) {
                    const reader = new FileReader();
                    reader.onloadend = function () { resolve(reader.result); };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            })
            .catch(function () { return img.src; });
    }

    function isEnglishPage() {
        const btn = $("#translateBtn");
        return btn ? /\bEspañol\b/.test(btn.textContent) : false;
    }

    function getSummary() {
        return isEnglishPage()
            ? "<p>Full stack developer with experience in Laravel, Python and TypeScript, and expertise in cloud deployments (AWS, Azure). Computer Engineering background, reinforced by Business Administration studies. Currently specializing in infrastructure, networks and cybersecurity. English proficiency C1.</p>"
            : "<p>Desarrollador full stack con experiencia en Laravel, Python y TypeScript, especializado en despliegues en la nube (AWS, Azure). Formaci\u00f3n en Ingenier\u00eda en Inform\u00e1tica reforzada por estudios en Administraci\u00f3n de Empresas. Actualmente enfocado en infraestructura, redes y ciberseguridad. Ingl\u00e9s nivel C1.</p>";
    }

    function getContact() {
        const items = [
            ["Email", ($(".correo") || {}).textContent ? $(".correo").textContent.trim() : ""],
            ["Tel\u00e9fono", ($(".tele") || {}).textContent ? $(".tele").textContent.trim() : ""],
            ["Ubicaci\u00f3n", ($(".ciudad") || {}).textContent ? $(".ciudad").textContent.trim() : ""],
            ["GitHub", "github.com/MaThUZiB"],
            ["LinkedIn", "linkedin.com/in/iv\u00e1n-matus-angulo-814bb1316"]
        ].filter(function (pair) { return pair[1]; });

        return items.map(function (pair) {
            return "<li><strong>" + pair[0] + "</strong><span>" + pair[1] + "</span></li>";
        }).join("");
    }

    function text(el) {
        return el ? (el.textContent || "").trim() : "";
    }

    function getExperience() {
        return $$("#experiencia .timeline-card").map(function (card) {
            const title = text($("h4", card));
            const company = text($(".empresa", card));
            const date = text($(".fecha", card));
            const desc = text($("p", card));
            return (
                '<div class="card">' +
                '<div class="exp-head">' +
                "<strong>" + title + "</strong>" +
                (date ? '<span class="date">' + date + "</span>" : "") +
                "</div>" +
                '<p class="company">' + company + "</p>" +
                (desc ? "<p>" + desc + "</p>" : "") +
                "</div>"
            );
        }).join("");
    }

    function getEducation() {
        return $$("#educacion .timeline-card").map(function (card) {
            const title = text($("h4", card));
            const inst = text($(".empresa", card));
            const date = text($(".fecha", card));
            return (
                '<div class="card">' +
                '<div class="exp-head">' +
                "<strong>" + title + "</strong>" +
                (date ? '<span class="date">' + date + "</span>" : "") +
                "</div>" +
                '<p class="company">' + inst + "</p>" +
                "</div>"
            );
        }).join("");
    }

    function getTechStack() {
        return $$(".categoria").map(function (cat) {
            const title = text($("h4", cat));
            const items = $$("ul.badges li", cat).map(function (li) { return li.textContent.trim(); });
            return '<div class="card"><strong>' + title + "</strong><p>" + items.join(", ") + "</p></div>";
        }).join("");
    }

    function getProjects() {
        return $$(".proyecto-card").map(function (card) {
            const title = text($(".titulo-proyecto", card));
            const desc = text($(".contenido-proyecto p", card));
            const tech = text($(".tech-mini", card));
            return (
                '<div class="card">' +
                '<div class="exp-head"><strong>' + title + "</strong></div>" +
                (desc ? "<p>" + desc + "</p>" : "") +
                (tech ? '<p class="muted">' + tech + "</p>" : "") +
                "</div>"
            );
        }).join("");
    }

    function getCertifications() {
        const relevantTokens = [
            "AWS Academy Graduate",
            "Full Stack",
            "Infraestructura",
            "Secure IT",
            "Ingl\u00e9s",
            "English"
        ];
        return $$(".cert-card")
            .filter(function (card) {
                const title = ($(".title", card) || {}).textContent || "";
                return relevantTokens.some(function (t) { return title.indexOf(t) !== -1; });
            })
            .map(function (card) {
                const title = text($(".title", card));
                const issuer = text($(".subtitle", card));
                return "<li><strong>" + title + "</strong><span>" + issuer + "</span></li>";
            })
            .join("");
    }

    function getTemplate() {
        const tpl = document.getElementById("cv-template");
        if (tpl && tpl.innerHTML.trim()) return tpl.innerHTML.trim();
        return null;
    }

    function fillTemplate(template, data) {
        Object.keys(data).forEach(function (key) {
            template = template.split("{{" + key + "}}").join(data[key] || "");
        });
        return template;
    }

    function buildDocument(template) {
        let css = '<link rel="stylesheet" href="CSS/plantilla.css">';
        try {
            return fetch("CSS/plantilla.css")
                .then(function (res) {
                    if (!res.ok) return css;
                    return res.text().then(function (t) {
                        return "<style>" + t + "</style>";
                    });
                })
                .catch(function () { return css; })
                .then(function (finalCss) {
                    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n<title>CV - Iv\u00e1n Matus Angulo</title>\n' + finalCss + '\n</head>\n<body>\n' + template + "\n</body>\n</html>";
                });
        } catch (e) {
            return Promise.resolve(
                '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n<title>CV - Iv\u00e1n Matus Angulo</title>\n' + css + '\n</head>\n<body>\n' + template + "\n</body>\n</html>"
            );
        }
    }

    function printViaPopup(html) {
        const popup = window.open("", "_blank");
        if (!popup) throw new Error("Pop-up bloqueado");
        popup.document.write(html);
        popup.document.close();
        let done = false;
        const fire = function () {
            if (done) return;
            done = true;
            popup.focus();
            popup.print();
            setTimeout(function () { popup.close(); }, 60000);
        };
        popup.addEventListener("load", function () { setTimeout(fire, 400); }, { once: true });
        setTimeout(fire, 3500);
    }

    function printTemplate(html) {
        const iframe = document.createElement("iframe");
        Object.assign(iframe.style, {
            position: "fixed",
            top: "0",
            left: "-10000px",
            width: "794px",
            height: "1123px",
            border: "none",
            opacity: "0",
            pointerEvents: "none",
            zIndex: "99999"
        });
        document.body.appendChild(iframe);

        const win = iframe.contentWindow;
        const doc = win.document;

        doc.open();
        doc.write(html);
        doc.close();

        let printed = false;

        const doPrint = function () {
            if (printed) return;
            printed = true;

            try {
                win.focus();
                win.print();
                const cleanup = function () { iframe.remove(); };
                win.addEventListener("afterprint", cleanup, { once: true });
                setTimeout(cleanup, 60000);
            } catch (err) {
                console.error("Fallo print en iframe, usando ventana nueva:", err);
                iframe.remove();
                printViaPopup(html);
            }
        };

        if (doc.readyState === "complete") {
            setTimeout(doPrint, 300);
        } else {
            win.addEventListener("load", function () { setTimeout(doPrint, 400); }, { once: true });
        }

        setTimeout(doPrint, 3500);
    }

    function generateCvPdf() {
        const btn = document.getElementById("downloadCvBtn");
        if (btn) {
            btn.classList.add("disable");
            if (!btn.dataset.originalHtml) {
                btn.dataset.originalHtml = btn.innerHTML;
            }
            btn.innerHTML = '<span class="fa-solid fa-spinner fa-spin"></span> <span>Generando CV\u2026</span>';
        }

        const run = async function () {
            const profileImage = await imageToBase64($(".imagen-perfil"));

            const data = {
                name: text(document.querySelector(".animated-title")),
                titles: [(
                    $("#title_1") || document.querySelector('[data-key="title_1"]') || { textContent: "" }
                ).textContent, (
                    $("#title_2") || document.querySelector('[data-key="title_2"]') || { textContent: "" }
                ).textContent, (
                    $("#title_3") || document.querySelector('[data-key="title_3"]') || { textContent: "" }
                ).textContent].filter(Boolean).join(" \u00b7 "),
                profileImage: profileImage,
                contact: getContact(),
                summary: getSummary(),
                experience: getExperience(),
                education: getEducation(),
                techStack: getTechStack(),
                projects: getProjects(),
                certifications: getCertifications()
            };

            let template = getTemplate();
            if (!template) {
                const res = await fetch("plantilla.html");
                if (!res.ok) throw new Error("No se pudo cargar la plantilla del CV");
                template = await res.text();
            }

            const rendered = fillTemplate(template, data);
            const docHtml = await buildDocument(rendered);
            printTemplate(docHtml);
        };

        run().catch(function (err) {
            console.error("Error generando CV:", err);
            alert("Error al generar el CV. Int\u00e9ntalo nuevamente.");
        }).then(function () {
            if (btn) {
                btn.classList.remove("disable");
                btn.innerHTML = btn.dataset.originalHtml || btn.innerHTML;
            }
        });
    }

    window.generateCvPdf = generateCvPdf;

    function bindButton() {
        const btn = document.getElementById("downloadCvBtn");
        if (!btn) return;
        if (btn.dataset.listenerBound) return;
        btn.dataset.listenerBound = "1";
        btn.addEventListener("click", generateCvPdf);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindButton);
    } else {
        bindButton();
    }
})();