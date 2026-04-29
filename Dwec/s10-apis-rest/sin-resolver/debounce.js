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
    let timer;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

async function buscarAPI(termino) {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users?q=" + encodeURIComponent(termino));
        if (!res.ok) throw new Error("HTTP Error " + res.status);

        const usuarios = await res.json();
        console.log("Buscando: " + termino);
        console.log("Resultados: " + usuarios.length);
        return usuarios;
    } catch (error) {
        console.log("Error en la busqueda:", error.message);
        return [];
    }
}

const buscarConDebounce = debounce(buscarAPI, 300);

buscarConDebounce("a");
buscarConDebounce("an");
buscarConDebounce("ana");

setTimeout(() => {
    buscarConDebounce("l");
    buscarConDebounce("le");
    buscarConDebounce("lea");
}, 1000);
