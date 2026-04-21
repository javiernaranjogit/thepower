// ─────────────────────────────────────────────
// EJERCICIO 1 — Buscador de usuarios
// ─────────────────────────────────────────────
// Construir un buscador en consola que:
//
// 1. Cargue UNA sola vez todos los usuarios de la API
//      → https://jsonplaceholder.typicode.com/users
//    Guárdalos en una variable en memoria (no refetch por búsqueda).
//
// 2. mostrar(usuarios)
//    Imprima tabla: nombre | email | ciudad (address.city).
//    Incluir al final "Total: N".
//
// 3. buscar(texto)
//    Filtre en memoria por nombre (case-insensitive, contiene).
//
// 4. init()
//    Cargue los usuarios, los muestre, y programe dos búsquedas con
//    setTimeout para demostrar el filtrado.
//
// Manejo de errores: si falla el fetch, mostrar el error y usar [].
// ─────────────────────────────────────────────

const URL_USERS = "https://jsonplaceholder.typicode.com/users";

let todosUsuarios = [];

async function obtenerUsuarios() {
    // TODO: fetch + res.ok + return json (try/catch devolviendo [])
}

function mostrar(usuarios) {
    // TODO: forEach imprimiendo nombre | email | ciudad
}

function buscar(texto) {
    // TODO: filter case-insensitive sobre todosUsuarios + mostrar()
}

async function init() {
    // TODO: await obtenerUsuarios(), mostrar, programar buscar() con setTimeout
}

init();
