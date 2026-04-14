// ─────────────────────────────────────────────
// MINI-PROYECTO — Galería con Filtros
// ─────────────────────────────────────────────
// Galería de imágenes (12+ elementos) con filtros
// múltiples, búsqueda por tags, modal de visualización
// y lazy loading mediante IntersectionObserver.
//
// Requisitos:
//
// 1. Array de imágenes {id, titulo, categoria, tags[], src}
//    con al menos 12 entradas de varias categorías.
//
// 2. Botones de filtro por categoría (chips). Click alterna
//    entre "todas" y una categoría concreta. Event delegation.
//
// 3. Buscador por tag: filtra las imágenes cuyos tags
//    contienen el texto escrito (case-insensitive).
//
// 4. Modal:
//    - Click en una imagen abre el modal con la grande.
//    - Botones "anterior" y "siguiente" recorren las
//      imágenes actualmente filtradas.
//    - Se cierra con Escape, click fuera, o botón cerrar.
//
// 5. Lazy loading con IntersectionObserver:
//    el atributo data-src pasa a src sólo cuando la
//    imagen entra en el viewport, añadiendo clase "loaded".
//
// 6. Render con <template>, cloneNode y DocumentFragment.
// ─────────────────────────────────────────────

const imagenes = [
    { id: 1,  titulo: "Cumbre",      categoria: "naturaleza", tags: ["montaña","nieve"],    src: "https://picsum.photos/600?random=101" },
    { id: 2,  titulo: "Skyline",     categoria: "ciudad",     tags: ["rascacielos","noche"], src: "https://picsum.photos/600?random=102" },
    { id: 3,  titulo: "Bosque",      categoria: "naturaleza", tags: ["árboles","verde"],    src: "https://picsum.photos/600?random=103" },
    { id: 4,  titulo: "Playa",       categoria: "naturaleza", tags: ["mar","arena"],        src: "https://picsum.photos/600?random=104" },
    { id: 5,  titulo: "Puente",      categoria: "ciudad",     tags: ["río","arquitectura"], src: "https://picsum.photos/600?random=105" },
    { id: 6,  titulo: "Gato",        categoria: "animales",   tags: ["mascota","felino"],   src: "https://picsum.photos/600?random=106" },
    { id: 7,  titulo: "Perro",       categoria: "animales",   tags: ["mascota","cachorro"], src: "https://picsum.photos/600?random=107" },
    { id: 8,  titulo: "Café",        categoria: "comida",     tags: ["bebida","mañana"],    src: "https://picsum.photos/600?random=108" },
    { id: 9,  titulo: "Pizza",       categoria: "comida",     tags: ["italiana","cena"],    src: "https://picsum.photos/600?random=109" },
    { id: 10, titulo: "Metro",       categoria: "ciudad",     tags: ["transporte","gente"], src: "https://picsum.photos/600?random=110" },
    { id: 11, titulo: "Volcán",      categoria: "naturaleza", tags: ["montaña","fuego"],    src: "https://picsum.photos/600?random=111" },
    { id: 12, titulo: "Ave",         categoria: "animales",   tags: ["vuelo","cielo"],      src: "https://picsum.photos/600?random=112" },
    { id: 13, titulo: "Postre",      categoria: "comida",     tags: ["dulce","chocolate"],  src: "https://picsum.photos/600?random=113" },
    { id: 14, titulo: "Atardecer",   categoria: "naturaleza", tags: ["cielo","sol"],        src: "https://picsum.photos/600?random=114" }
];

const galeria   = document.getElementById("galeria");
const tpl       = document.getElementById("tplItem");
const filtros   = document.getElementById("filtros");
const buscador  = document.getElementById("buscador");
const vacio     = document.getElementById("vacio");
const modal     = document.getElementById("modal");
const modalImg  = modal.querySelector(".modal__img");
const modalInfo = modal.querySelector(".modal__info");

let categoriaActual = "todas";
let visibles = [];      // imágenes filtradas visibles
let indiceModal = 0;

// Construir chips de categorías únicas
const categorias = [...new Set(imagenes.map(i => i.categoria))];
categorias.forEach(c => {
    const b = document.createElement("button");
    b.className = "chip";
    b.dataset.categoria = c;
    b.textContent = c.charAt(0).toUpperCase() + c.slice(1);
    filtros.appendChild(b);
});

// IntersectionObserver para lazy loading
const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
        obs.unobserve(img);
    });
}, { rootMargin: "100px" });

function render() {
    const texto = buscador.value.trim().toLowerCase();

    visibles = imagenes.filter(img => {
        const matchCat = categoriaActual === "todas" || img.categoria === categoriaActual;
        const matchTag = texto === "" || img.tags.some(t => t.toLowerCase().includes(texto));
        return matchCat && matchTag;
    });

    const frag = document.createDocumentFragment();
    visibles.forEach((img, idx) => {
        const nodo = tpl.content.cloneNode(true);
        const fig  = nodo.querySelector(".item");
        const el   = nodo.querySelector(".item__img");
        fig.dataset.id = img.id;
        fig.dataset.indice = idx;
        el.dataset.src = img.src;
        el.alt = img.titulo;
        nodo.querySelector(".item__cap").textContent = img.titulo;
        frag.appendChild(nodo);
    });

    galeria.replaceChildren(frag);
    vacio.hidden = visibles.length > 0;

    // Observar las nuevas imágenes
    galeria.querySelectorAll(".item__img").forEach(i => io.observe(i));
}

// Filtros por categoría (event delegation)
filtros.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filtros.querySelectorAll(".chip").forEach(c => c.classList.remove("chip--active"));
    chip.classList.add("chip--active");
    categoriaActual = chip.dataset.categoria;
    render();
});

buscador.addEventListener("input", render);

// Abrir modal al clicar imagen (event delegation)
galeria.addEventListener("click", e => {
    const item = e.target.closest(".item");
    if (!item) return;
    indiceModal = Number(item.dataset.indice);
    abrirModal();
});

function abrirModal() {
    const img = visibles[indiceModal];
    if (!img) return;
    modalImg.src = img.src;
    modalImg.alt = img.titulo;
    modalInfo.textContent = `${img.titulo} — ${indiceModal + 1}/${visibles.length}`;
    modal.hidden = false;
}

function cerrarModal() { modal.hidden = true; }

function navegar(delta) {
    if (!visibles.length) return;
    indiceModal = (indiceModal + delta + visibles.length) % visibles.length;
    abrirModal();
}

// Delegación de clicks en el modal
modal.addEventListener("click", e => {
    const btn = e.target.closest("[data-accion]");
    if (btn) {
        if (btn.dataset.accion === "cerrar") cerrarModal();
        if (btn.dataset.accion === "prev")   navegar(-1);
        if (btn.dataset.accion === "next")   navegar(1);
        return;
    }
    // Click fuera de la imagen cierra
    if (e.target === modal) cerrarModal();
});

// Teclado
document.addEventListener("keydown", e => {
    if (modal.hidden) return;
    if (e.key === "Escape")     cerrarModal();
    if (e.key === "ArrowLeft")  navegar(-1);
    if (e.key === "ArrowRight") navegar(1);
});

render();
