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
    // TODO: AbortController + setTimeout(abort) + fetch con signal
    //       diferenciar AbortError, HTTP y error de red
    //       clearTimeout en finally
}

async function pedirPost(id, ms) {
    // TODO: llamar fetchConTimeout, parsear JSON, imprimir resultado o error
}

async function demo() {
    // TODO: 4 casos (ok, 404, timeout forzado, dominio inexistente)
}

demo();
