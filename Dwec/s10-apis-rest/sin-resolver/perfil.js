// ─────────────────────────────────────────────
// EJERCICIO 3 — Encadenar dos APIs
// ─────────────────────────────────────────────
// Construir el perfil completo de un usuario combinando dos
// peticiones dependientes. La SEGUNDA petición necesita el
// resultado de la PRIMERA (el userId).
//
// cargarPerfilCompleto(id)
//   1. GET /users/:id
//      - Si no existe → lanzar error "Usuario no encontrado"
//   2. GET /posts?userId=:id
//   3. Imprimir:
//      === PERFIL DE NOMBRE ===
//      Email:  ...
//      Ciudad: ...
//
//      Posts (N):
//        1. Título 1
//        2. Título 2
//
// Envolver TODO en try/catch. Probar con ids 1, 3 y 999 (no existe).
//
// Patrón típico del mundo real:
//    login → con el token pido los datos
// ─────────────────────────────────────────────

const BASE = "https://jsonplaceholder.typicode.com";

async function obtenerUsuario(id) {
    // TODO
}

async function obtenerPostsDeUsuario(userId) {
    // TODO
}

async function cargarPerfilCompleto(id) {
    // TODO: encadenar las dos funciones + try/catch + imprimir formato pedido
}

async function demo() {
    // TODO: cargarPerfilCompleto(1), (3) y (999)
}

demo();
