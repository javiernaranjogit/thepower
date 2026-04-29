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
    try {
        const res = await fetch(API + "?_limit=5");
        if (!res.ok) throw new Error("HTTP Error " + res.status);

        const posts = await res.json();
        posts.forEach(({ id, title }) => console.log("[" + id + "] " + title));
        return posts;
    } catch (error) {
        console.log("Error al listar posts:", error.message);
        return [];
    }
}

async function crearPost(titulo, cuerpo) {
    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: titulo, body: cuerpo, userId: 1 })
        });
        if (!res.ok) throw new Error("HTTP Error " + res.status);

        const nuevo = await res.json();
        console.log("Post creado:", nuevo);
        return nuevo;
    } catch (error) {
        console.log("Error al crear post:", error.message);
        return null;
    }
}

async function editarPost(id, titulo, cuerpo) {
    try {
        const res = await fetch(API + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, title: titulo, body: cuerpo, userId: 1 })
        });
        if (!res.ok) throw new Error("HTTP Error " + res.status);

        const editado = await res.json();
        console.log("Post editado:", editado);
        return editado;
    } catch (error) {
        console.log("Error al editar post:", error.message);
        return null;
    }
}

async function eliminarPost(id) {
    try {
        const res = await fetch(API + "/" + id, { method: "DELETE" });
        if (!res.ok) throw new Error("HTTP Error " + res.status);

        console.log("Post eliminado: " + id);
        return true;
    } catch (error) {
        console.log("Error al eliminar post:", error.message);
        return false;
    }
}

async function demo() {
    await listarPosts();
    await crearPost("Nuevo post", "Contenido del post creado");
    await editarPost(1, "Post editado", "Contenido actualizado");
    await eliminarPost(1);
    await listarPosts();
}

demo();
