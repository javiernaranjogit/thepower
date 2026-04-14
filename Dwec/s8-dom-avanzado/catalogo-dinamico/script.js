// ─────────────────────────────────────────────
// MINI-PROYECTO — Catálogo Dinámico
// ─────────────────────────────────────────────
// Construye un catálogo de productos que se renderiza
// completamente desde JavaScript a partir de un array
// de objetos con al menos 12 productos. Cada producto:
//   { id, nombre, categoria, precio, imagen, stock }
//
// Requisitos:
//
// 1. Render dinámico usando <template> + cloneNode(true)
//    y DocumentFragment para minimizar reflows.
//
// 2. Buscador por nombre (input type="search") que filtra
//    en tiempo real (evento input).
//
// 3. Filtro por categoría (select) cuyas opciones se generan
//    dinámicamente a partir de las categorías únicas del array.
//
// 4. Orden por precio ascendente / descendente (select).
//
// 5. Contador de resultados visibles.
//
// 6. Productos sin stock → clase modificadora CSS (opacidad
//    reducida) y etiqueta "Agotado".
//
// 7. Imágenes desde https://picsum.photos/200?random=N
//
// Técnicas: <template>, cloneNode, DocumentFragment, dataset.
// ─────────────────────────────────────────────

const productos = [
    { id: 1,  nombre: "Portátil Pro 14",      categoria: "Informática", precio: 1299, imagen: "https://picsum.photos/200?random=1",  stock: 5 },
    { id: 2,  nombre: "Auriculares BT",       categoria: "Audio",       precio: 79.9, imagen: "https://picsum.photos/200?random=2",  stock: 20 },
    { id: 3,  nombre: "Teclado Mecánico",     categoria: "Informática", precio: 119,  imagen: "https://picsum.photos/200?random=3",  stock: 12 },
    { id: 4,  nombre: "Ratón Gaming",         categoria: "Informática", precio: 49,   imagen: "https://picsum.photos/200?random=4",  stock: 0 },
    { id: 5,  nombre: "Altavoz Portátil",     categoria: "Audio",       precio: 39.5, imagen: "https://picsum.photos/200?random=5",  stock: 8 },
    { id: 6,  nombre: "Smartwatch S3",        categoria: "Wearables",   precio: 199,  imagen: "https://picsum.photos/200?random=6",  stock: 15 },
    { id: 7,  nombre: "Cámara Mirrorless",    categoria: "Fotografía",  precio: 899,  imagen: "https://picsum.photos/200?random=7",  stock: 3 },
    { id: 8,  nombre: "Trípode Aluminio",     categoria: "Fotografía",  precio: 59,   imagen: "https://picsum.photos/200?random=8",  stock: 10 },
    { id: 9,  nombre: "Monitor 27\" 4K",      categoria: "Informática", precio: 449,  imagen: "https://picsum.photos/200?random=9",  stock: 0 },
    { id: 10, nombre: "Pulsera Fitness",      categoria: "Wearables",   precio: 59.9, imagen: "https://picsum.photos/200?random=10", stock: 25 },
    { id: 11, nombre: "Micrófono USB",        categoria: "Audio",       precio: 89,   imagen: "https://picsum.photos/200?random=11", stock: 7 },
    { id: 12, nombre: "Disco SSD 1TB",        categoria: "Informática", precio: 109,  imagen: "https://picsum.photos/200?random=12", stock: 18 },
    { id: 13, nombre: "Objetivo 50mm",        categoria: "Fotografía",  precio: 249,  imagen: "https://picsum.photos/200?random=13", stock: 4 }
];

const grid      = document.getElementById("grid");
const tpl       = document.getElementById("tplProducto");
const buscador  = document.getElementById("buscador");
const selCat    = document.getElementById("filtroCategoria");
const selOrden  = document.getElementById("orden");
const contador  = document.getElementById("contador");

// Rellenar select de categorías únicas
const categorias = [...new Set(productos.map(p => p.categoria))].sort();
categorias.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    selCat.appendChild(opt);
});

function crearCard(p) {
    const nodo = tpl.content.cloneNode(true);
    const article = nodo.querySelector(".producto");
    article.dataset.id = p.id;

    const img = nodo.querySelector(".producto__img");
    img.src = p.imagen;
    img.alt = p.nombre;

    nodo.querySelector(".producto__nombre").textContent     = p.nombre;
    nodo.querySelector(".producto__categoria").textContent  = p.categoria;
    nodo.querySelector(".producto__precio").textContent     = p.precio.toFixed(2) + " €";
    nodo.querySelector(".producto__stock").textContent      =
        p.stock === 0 ? "Agotado" : `${p.stock} en stock`;

    if (p.stock === 0) article.classList.add("producto--agotado");
    return nodo;
}

function render() {
    const texto  = buscador.value.trim().toLowerCase();
    const cat    = selCat.value;
    const orden  = selOrden.value;

    let lista = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) &&
        (cat === "" || p.categoria === cat)
    );

    if (orden === "asc")  lista.sort((a, b) => a.precio - b.precio);
    if (orden === "desc") lista.sort((a, b) => b.precio - a.precio);

    const frag = document.createDocumentFragment();
    lista.forEach(p => frag.appendChild(crearCard(p)));

    grid.replaceChildren(frag);
    contador.textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;
}

[buscador, selCat, selOrden].forEach(el =>
    el.addEventListener("input", render)
);

render();
