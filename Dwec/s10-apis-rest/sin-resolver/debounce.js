// ─────────────────────────────────────────────
// EJERCICIO 5 — Debounce aplicado a un buscador
// ─────────────────────────────────────────────
// Sin debounce, cada pulsación del usuario dispararía una petición.
// Con debounce, solo se lanza la petición tras N ms de inactividad.
//
// 1. debounce(fn, delay)
//    - Devuelve una función que:
//      · Cancela el timer anterior (clearTimeout)
//      · Programa fn(...args) para ejecutarse tras `delay` ms
//
// 2. buscarAPI(termino)
//    - GET https://jsonplaceholder.typicode.com/users?q=<termino>
//    - Imprime el término buscado y el número de resultados
//
// 3. Simular tecleo rápido:
//    - Llamar tres veces a la versión debounced en <300ms
//    - Solo debe ejecutarse la última llamada
//
// Patrón real: buscador con autocompletar en un <input>.
// ─────────────────────────────────────────────

function debounce(fn, delay) {
    // TODO: devolver función que clearTimeout y setTimeout
}

async function buscarAPI(termino) {
    // TODO: fetch con query ?q=termino, imprimir resultados
}

// const buscarConDebounce = debounce(buscarAPI, 300);
// TODO: llamar 3 veces seguidas con "a", "an", "ana"
// TODO (opcional): una segunda ráfaga 1s después para ver que se reinicia
