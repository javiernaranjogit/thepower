// ─────────────────────────────────────────────
// EJERCICIO 2 — Paginación de posts
// ─────────────────────────────────────────────
// Paginar los 100 posts de JSONPlaceholder en bloques de 10.
//
// JSONPlaceholder acepta los query params:
//    ?_start=<N>&_limit=<M>
//
// Fórmula clave:
//    start = (pagina - 1) * POSTS_POR_PAGINA
//
// Funciones a implementar:
//
// 1. cargarPagina(pagina)
//    - Calcula start, hace fetch, parsea JSON
//    - Imprime "PÁGINA N de TOTAL" y lista los posts con id + title
//    - Si estamos en la primera → imprime "[Anterior: deshabilitado]"
//    - Si estamos en la última  → imprime "[Siguiente: deshabilitado]"
//
// 2. demo()
//    - Carga las páginas 1, 2 y 10 en secuencia con await
//
// ─────────────────────────────────────────────

const API = "https://jsonplaceholder.typicode.com/posts";
const POSTS_POR_PAGINA = 10;
const TOTAL_POSTS = 100;
const TOTAL_PAGINAS = TOTAL_POSTS / POSTS_POR_PAGINA;

async function cargarPagina(pagina) {
    // TODO: calcular start, fetch con _start y _limit, imprimir listado
    //       y avisos de Anterior/Siguiente deshabilitados
}

async function demo() {
    // TODO: await cargarPagina(1), (2) y (10)
}

demo();
