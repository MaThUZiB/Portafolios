# Portafolio de Iván Matus

Sitio estático en HTML, CSS y JavaScript. Conserva el alojamiento existente; no requiere una compilación para publicarlo.

## Desarrollo

```sh
python -m http.server 8000
```

Abrir http://localhost:8000. Revisar escritorio, móvil, teclado, selector de idioma y descarga del CV.

## Proyectos y capturas

Las fichas están en `proyectos/`. El carrusel de inicio permite desplazamiento manual, teclado y gestos táctiles, sin reproducción automática.

Guardar capturas reales revisadas en `assets/proyectos/` y añadir sus rutas y descripciones en `scripts/gallery-data.js`. Por ejemplo:

```js
'sgic-terneros': [
  { src: '../assets/proyectos/sgic-resumen.webp', es: 'Resumen del sistema con datos de demostración.', en: 'System overview with demo data.' }
]
```

Las galerías sin imágenes no se muestran. Las imágenes deben excluir datos personales de clientes y registros operativos reales. No se incluyen capturas inventadas.

## CV PDF

El botón descarga el PDF A4 revisado en el idioma seleccionado. Los documentos tienen dos páginas: perfil, experiencia y formación; proyectos, tecnologías y certificaciones.

Después de modificar el contenido de inicio o sus traducciones, regenerar los PDFs:

```sh
python -m pip install reportlab
python scripts/build_cv.py
```

El generador lee `index.html` y `scripts/traduccion.js`. Los PDFs se guardan en `assets/cv/` y deben subirse junto con el contenido actualizado. Usa DejaVu Sans si está instalada o Helvetica como alternativa. Verificar ambas versiones antes de publicar, especialmente si se agrega contenido suficiente para modificar los saltos de página.
