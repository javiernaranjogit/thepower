// ─────────────────────────────────────────────
// LIVE CODING — Patrón fetch (GET, GET por ID, POST)
// ─────────────────────────────────────────────
// Primer contacto con APIs REST y fetch.
//
// 1. obtenerPosts()
//    - GET a https://jsonplaceholder.typicode.com/posts
//    - Imprime el total y los 3 primeros
//
// 2. obtenerPost(id)
//    - GET a /posts/:id
//    - Si res.ok es false → lanzar error con el status
//    - Probar con id=1 (ok) e id=999 (404)
//
// 3. crearPost(titulo, cuerpo)
//    - POST a /posts con headers Content-Type: application/json
//    - body serializado con JSON.stringify
//    - Imprime el recurso devuelto por el servidor
//
// Requisitos: async/await, try/catch, comprobar res.ok
// Ejecución: node api.js
// ─────────────────────────────────────────────

const API = "https://jsonplaceholder.typicode.com/posts";

async function obtenerPosts() {
    // TODO
}

async function obtenerPost(id) {
    // TODO
}

async function crearPost(titulo, cuerpo) {
    // TODO
}

async function demo() {
    // TODO: llamar a las 3 funciones anteriores
}

demo();
