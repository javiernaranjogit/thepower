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
// Envolver todo en try/catch. Probar con ids 1, 3 y 999 (no existe).
//
// Patrón típico del mundo real:
//    login → con el token pido los datos
// ─────────────────────────────────────────────

const BASE = "https://jsonplaceholder.typicode.com";

async function obtenerUsuario(id) {
    const res = await fetch(BASE + "/users/" + id);
    if (!res.ok) throw new Error("Usuario no encontrado");
    return await res.json();
}

async function obtenerPostsDeUsuario(userId) {
    const res = await fetch(BASE + "/posts?userId=" + userId);
    if (!res.ok) throw new Error("HTTP Error " + res.status);
    return await res.json();
}

async function cargarPerfilCompleto(id) {
    try {
        const usuario = await obtenerUsuario(id);
        const posts = await obtenerPostsDeUsuario(usuario.id);

        console.log("=== PERFIL DE " + usuario.name.toUpperCase() + " ===");
        console.log("Email: " + usuario.email);
        console.log("Ciudad: " + usuario.address.city);
        console.log("");
        console.log("Posts (" + posts.length + "):");
        posts.forEach((post, index) => {
            console.log("  " + (index + 1) + ". " + post.title);
        });
        console.log("");
        return { usuario, posts };
    } catch (error) {
        console.log("Error cargando perfil " + id + ": " + error.message);
        return null;
    }
}

async function demo() {
    await cargarPerfilCompleto(1);
    await cargarPerfilCompleto(3);
    await cargarPerfilCompleto(999);
}

demo();
