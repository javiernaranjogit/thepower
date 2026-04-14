# thepowerrepo

Repositorio de ejercicios y materiales de clase para los ciclos formativos de **DAW** y **ASIR** en Prometeo (The Power MBA FP).

## Módulos

### DAW — Desarrollo de Aplicaciones Web
- **DWEC** — Desarrollo Web en Entorno Cliente (JavaScript, DOM, eventos, async)

### ASIR — Administración de Sistemas Informáticos en Red
- **SAD** — Seguridad y Alta Disponibilidad
- **SRI** — Servicios de Red e Internet

## Estructura del repositorio

El contenido se organiza por módulo y, dentro de cada módulo, por sesión (`sN-tema`). Cada sesión contiene los ejercicios resueltos: el enunciado va siempre en un comentario de cabecera y la solución justo debajo.

### DWEC

```
Dwec/
├── s3-sintaxis/               Sintaxis básica, condicionales, bucles
│   ├── calculadora-notas.js
│   ├── sistema-descuentos.js
│   └── juego-adivinanza.js
├── s4-arrays-funciones/       Arrays, HOF, programación funcional
│   ├── pipeline-productos.js
│   ├── carrito-descuentos.js
│   └── map-filter-reduce-manual.js
├── s5-eventos-dom/            Manipulación del DOM y eventos
│   ├── formulario-validacion/
│   ├── slider-imagenes/
│   └── todo-list/
├── s6-map-set-json/           Map, Set, JSON y localStorage
│   ├── inventario-map.js
│   ├── emails-set.js
│   └── favoritos-localstorage.js
├── s7-formularios/            Formularios y validación
│   ├── registro-validacion/
│   ├── password-fortaleza/
│   └── formulario-multipaso/
├── s8-dom-avanzado/           DOM avanzado (templates, drag&drop, IO)
│   ├── catalogo-dinamico/
│   ├── lista-tareas/
│   └── galeria-filtros/
└── s9-async/                  Asincronía: promesas, async/await, fetch
    ├── reservas.js
    ├── fetch-reintentos.js
    └── login-token.js
```

## Cómo ejecutar los ejercicios

- **Archivos `.js` sueltos**: se pueden ejecutar con Node (`node ruta/al/archivo.js`) salvo los que dependen del DOM o de `localStorage` (indicado en su cabecera).
- **Mini-proyectos con `index.html`**: abrir el HTML directamente en el navegador, o servirlos con un servidor estático (p. ej. `npx serve` o la extensión *Live Server* de VS Code).

## Licencia

Este repositorio se distribuye bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.
