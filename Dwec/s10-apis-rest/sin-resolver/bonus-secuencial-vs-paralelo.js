// ─────────────────────────────────────────────
// BONUS — Secuencial vs Paralelo con Promise.all
// ─────────────────────────────────────────────
// Extiende el Ejercicio 3 (perfil). Ahora queremos cargar el perfil
// de VARIOS usuarios a la vez y comparar dos estrategias:
//
//   A) Secuencial — await dentro de un for, uno detrás de otro
//   B) Paralelo   — Promise.all sobre un array de promesas
//
// Para cada estrategia medir el tiempo con Date.now() antes/después
// e imprimir el total.
//
// Ejemplo: para 5 usuarios, la secuencial tarda ~5× lo que tarda una
// petición; la paralela tarda ~1×. El ahorro depende de la latencia.
//
// Funciones:
//   cargarUsuario(id)           → GET /users/:id (devuelve {id, name})
//   cargarSecuencial(ids)       → for con await
//   cargarParalelo(ids)         → Promise.all
//   comparar(ids)               → ejecuta ambas y compara tiempos
//
// Regla: NUNCA uses paralelo si la segunda petición DEPENDE del
// resultado de la primera. Ahí el encadenamiento con await es obligatorio.
// ─────────────────────────────────────────────

const API = "https://jsonplaceholder.typicode.com/users";

async function cargarUsuario(id) {
    // TODO: fetch /users/:id, devolver {id, name}
}

async function cargarSecuencial(ids) {
    // TODO: for + await, medir tiempo con Date.now()
}

async function cargarParalelo(ids) {
    // TODO: Promise.all con ids.map(cargarUsuario), medir tiempo
}

async function comparar(ids) {
    // TODO: ejecutar ambas e imprimir el factor de mejora
}

comparar([1, 2, 3, 4, 5]);
