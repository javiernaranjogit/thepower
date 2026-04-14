// ─────────────────────────────────────────────
// EJERCICIO 2 — Fetch con reintento automático
// ─────────────────────────────────────────────
// Crea una función fetchConReintentos(url, intentos) que:
//
// 1. Haga fetch a la URL con async/await
// 2. Si falla, reintente automáticamente hasta N veces
// 3. Entre cada reintento espere 1 segundo
// 4. Si agota los intentos, lance un error:
//    "Máximo de intentos alcanzado"
//
// Pista — función para esperar:
//   function esperar(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }
//
// Prueba con URL válida:
//   fetchConReintentos("https://jsonplaceholder.typicode.com/posts/1")
//
// Prueba con URL inválida (debe reintentar 3 veces y fallar):
//   fetchConReintentos("https://url-que-no-existe.xyz", 3)
// ─────────────────────────────────────────────

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchConReintentos(url, intentos = 3) {
    for (let i = 0; i < intentos; i++) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Peticion a la url inválida");
            return await res.json();
        } catch (error) {
            console.log("Intento fallido");
            if (i === intentos - 1) throw new Error("Maximo de intentos alcanzados");
            await esperar(1000);
        }
    }
}

//Prueba con la URL
fetchConReintentos("https://url-que-no-existe.xyz")
    .then(data => console.log(data))
    .catch(err => console.log(err.message))