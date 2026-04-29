// ─────────────────────────────────────────────
// BONUS — Manejo de errores y timeout con AbortController
// ─────────────────────────────────────────────
// fetch() por defecto NO tiene timeout. Si el servidor no responde,
// la promesa queda colgada. Para abortarla usamos AbortController.
//
// Objetivos:
//
// 1. fetchConTimeout(url, ms)
//    - Crea un AbortController
//    - Programa controller.abort() tras `ms` milisegundos
//    - Pasa { signal: controller.signal } al fetch
//    - Recuerda hacer clearTimeout al terminar
//    - Devuelve la respuesta o lanza un error claro:
//        · "Timeout"           → si se aborta
//        · "HTTP <status>"     → si la respuesta no es ok
//        · "Error de red"      → si falla la conexión
//
// 2. pedirPost(id, ms)
//    - Usa fetchConTimeout y devuelve el post parseado
//    - Captura cada tipo de error y lo imprime con contexto
//
// 3. demo()
//    - Caso ok:      post 1 con timeout generoso (5000ms)
//    - Caso 404:     post 999
//    - Caso timeout: timeout de 1ms para forzar abort
//    - Caso red:     dominio inexistente
//
// Patrón imprescindible en cualquier app que haga fetch real.
// ─────────────────────────────────────────────

async function fetchConTimeout(url, ms = 5000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);

    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Timeout");
        }

        if (error.message.startsWith("HTTP ")) {
            throw error;
        }

        throw new Error("Error de red");
    } finally {
        clearTimeout(timer);
    }
}

async function pedirPost(id, ms) {
    const url = "https://jsonplaceholder.typicode.com/posts/" + id;

    try {
        const res = await fetchConTimeout(url, ms);
        const post = await res.json();
        console.log("Post " + id + ":", post.title);
        return post;
    } catch (error) {
        console.log("Error pidiendo post " + id + ": " + error.message);
        return null;
    }
}

async function demo() {
    await pedirPost(1, 5000);
    await pedirPost(999, 5000);
    await pedirPost(1, 1);

    try {
        await fetchConTimeout("https://dominio-inexistente-ejemplo-12345.com/posts/1", 5000);
    } catch (error) {
        console.log("Error con dominio inexistente: " + error.message);
    }
}

demo();
