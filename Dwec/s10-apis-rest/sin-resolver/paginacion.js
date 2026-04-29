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
    if (pagina < 1 || pagina > TOTAL_PAGINAS) {
        console.log("Pagina fuera de rango " + pagina);
        return [];
    }

    const start = (pagina - 1) * POSTS_POR_PAGINA;
    const url = API + "?_start=" + start + "&_limit=" + POSTS_POR_PAGINA;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP Error: " + res.status);
        console.log("PAGINA " + pagina + " de " + TOTAL_PAGINAS);
        const posts = await res.json();
        posts.forEach(({ id, title }) => console.log("Id: " + id + " Titulo: " + title));
        if (pagina === 1) console.log("[Anterior: deshabilitado]");
        if (pagina === TOTAL_PAGINAS) console.log("[Siguiente: deshabilitado]");
        return posts;
    } catch (error) {
        console.log("Error cargando la pagina: ", error.message);
        return [];
    }
}

async function demo() {
    await cargarPagina(1);
    await cargarPagina(2);
    await cargarPagina(10);
}

demo();
