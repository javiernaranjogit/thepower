// ─────────────────────────────────────────────
// EJERCICIO — Fetch con reintentos y backoff exponencial
// ─────────────────────────────────────────────
// Crea una función:
//
//   fetchConReintentos(url, maxIntentos = 3, delay = 1000)
//
// Requisitos:
//
// 1. Hace fetch(url) con async/await.
// 2. Si la respuesta no es ok (status 200–299) → lanza error.
// 3. Si el fetch o la respuesta fallan → reintenta hasta
//    maxIntentos veces.
// 4. Entre reintentos aplica BACKOFF EXPONENCIAL:
//       intento 1 → espera delay ms
//       intento 2 → espera delay*2 ms
//       intento 3 → espera delay*4 ms
//       intento N → espera delay * 2^(N-1) ms
// 5. Loguea cada intento:
//       "Intento 1 de 3 → <url>"
//       "Fallo intento 1: <mensaje>. Reintento en 1000ms"
// 6. Si agota los intentos → lanza un error final.
//
// BONUS — Timeout con AbortController:
//   Añade un timeout (por ejemplo 3000 ms) a cada intento.
//   Si la petición supera ese tiempo, abortarla y tratarla
//   como un fallo más (se reintenta con backoff).
//
// Prueba:
//   - URL OK:    https://jsonplaceholder.typicode.com/posts/1
//   - URL FAIL:  https://no-existe-dominio-xyz-123.com/data
//
// Todo con async/await + try/catch.
// ─────────────────────────────────────────────

async function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchConReintentos(url, maxIntentos = 3, delay = 1000, timeoutMs = 3000) {
    for (let intento = 1; intento <= maxIntentos; intento++) {
        console.log(`Intento ${intento} de ${maxIntentos} → ${url}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const respuesta = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!respuesta.ok) {
                throw new Error(`Status no OK: ${respuesta.status} ${respuesta.statusText}`);
            }

            const datos = await respuesta.json();
            console.log(`Éxito en intento ${intento}`);
            return datos;
        } catch (error) {
            clearTimeout(timeoutId);

            const esTimeout = error.name === "AbortError";
            const mensaje = esTimeout ? `Timeout tras ${timeoutMs}ms` : error.message;

            if (intento === maxIntentos) {
                throw new Error(`Agotados ${maxIntentos} intentos. Último error: ${mensaje}`);
            }

            const espera = delay * Math.pow(2, intento - 1);
            console.log(`Fallo intento ${intento}: ${mensaje}. Reintento en ${espera}ms`);
            await esperar(espera);
        }
    }
}

// ─────────────────────────────────────────────
// Pruebas
// ─────────────────────────────────────────────

async function main() {
    console.log("\n=== PRUEBA 1: URL válida ===");
    try {
        const post = await fetchConReintentos(
            "https://jsonplaceholder.typicode.com/posts/1",
            3,
            1000
        );
        console.log("Datos recibidos:", post);
    } catch (error) {
        console.error("Error final:", error.message);
    }

    console.log("\n=== PRUEBA 2: URL inexistente ===");
    try {
        const datos = await fetchConReintentos(
            "https://no-existe-dominio-xyz-123.com/data",
            3,
            500
        );
        console.log("Datos recibidos:", datos);
    } catch (error) {
        console.error("Error final:", error.message);
    }

    console.log("\n=== PRUEBA 3: URL con 404 (status no ok) ===");
    try {
        const datos = await fetchConReintentos(
            "https://jsonplaceholder.typicode.com/posts/99999999",
            2,
            500
        );
        console.log("Datos recibidos:", datos);
    } catch (error) {
        console.error("Error final:", error.message);
    }
}

main();
