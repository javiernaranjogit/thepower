// ─────────────────────────────────────────────
// EJERCICIO 4 — CRUD completo (GET, POST, PUT, DELETE)
// ─────────────────────────────────────────────
// Implementar el ciclo completo de operaciones sobre /posts:
//
//   GET    /posts?_limit=5   → listar
//   POST   /posts            → crear
//   PUT    /posts/:id        → actualizar
//   DELETE /posts/:id        → eliminar
//
// Funciones:
//
//   listarPosts()                       → lista los primeros 5
//   crearPost(titulo, cuerpo)           → crea y devuelve el nuevo
//   editarPost(id, titulo, cuerpo)      → actualiza y devuelve el editado
//   eliminarPost(id)                    → elimina (comprueba res.ok)
//
// POST y PUT requieren:
//   - headers: { "Content-Type": "application/json" }
//   - body: JSON.stringify(obj)
//
// GET y DELETE no requieren body ni headers.
//
// demo() debe: listar → crear → editar → eliminar → listar otra vez.
//
// Nota: JSONPlaceholder es fake, los cambios NO persisten.
// ─────────────────────────────────────────────

const API = "https://jsonplaceholder.typicode.com/posts";

async function listarPosts() {
    // TODO: GET con _limit=5, imprimir [id] title
}

async function crearPost(titulo, cuerpo) {
    // TODO: POST con headers + body JSON.stringify
}

async function editarPost(id, titulo, cuerpo) {
    // TODO: PUT a /posts/:id con headers + body
}

async function eliminarPost(id) {
    // TODO: DELETE a /posts/:id, comprobar res.ok
}

async function demo() {
    // TODO: listar → crear → editar(1) → eliminar(1) → listar
}

demo();
