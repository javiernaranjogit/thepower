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
    const res = await fetch(API + "/" + id);
    if (!res.ok) throw new Error("HTTP Error " + res.status);

    const usuario = await res.json();
    return { id: usuario.id, name: usuario.name };
}

async function cargarSecuencial(ids) {
    const inicio = Date.now();
    const usuarios = [];

    for (const id of ids) {
        usuarios.push(await cargarUsuario(id));
    }

    const tiempo = Date.now() - inicio;
    console.log("Secuencial:", usuarios);
    console.log("Tiempo secuencial: " + tiempo + "ms");
    return { usuarios, tiempo };
}

async function cargarParalelo(ids) {
    const inicio = Date.now();
    const usuarios = await Promise.all(ids.map(cargarUsuario));
    const tiempo = Date.now() - inicio;

    console.log("Paralelo:", usuarios);
    console.log("Tiempo paralelo: " + tiempo + "ms");
    return { usuarios, tiempo };
}

async function comparar(ids) {
    try {
        const secuencial = await cargarSecuencial(ids);
        const paralelo = await cargarParalelo(ids);
        const mejora = paralelo.tiempo === 0 ? 0 : secuencial.tiempo / paralelo.tiempo;

        console.log("El paralelo fue " + mejora.toFixed(2) + " veces mas rapido");
    } catch (error) {
        console.log("Error comparando estrategias:", error.message);
    }
}

comparar([1, 2, 3, 4, 5]);
