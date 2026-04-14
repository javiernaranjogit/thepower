// ─────────────────────────────────────────────
// EJERCICIO 1 — Login con token que expira
// ─────────────────────────────────────────────
// Crea dos funciones:
//
// 1. login(usuario, password)
//    - Si usuario es "admin" y password es "1234"
//      → genera un token y lo guarda en una variable
//      → el token expira en 5 segundos (setTimeout)
//      → devuelve el token
//    - Si los datos son incorrectos → lanza un error
//
// 2. peticionProtegida(token)
//    - Si el token sigue activo → devuelve "Datos obtenidos"
//    - Si el token ha expirado → lanza "Sesión expirada"
//
// Prueba:
//    login → peticionProtegida inmediata (funciona)
//    login → esperar 6 segundos → peticionProtegida (falla)
//
// Todo con async/await y try/catch
// ─────────────────────────────────────────────

let tokenActivo = null;

async function login(usuario, password) {
    if (usuario === "admin" && password === "1234") {
        tokenActivo = "TOKEN_ABC123";
        setTimeout(() => {
            tokenActivo = null;
            console.log("Se ha expirado el token");
        }, 5000);
        return tokenActivo;
    }
    throw new Error("Credenciales incorrectas");
}

async function peticionProtegida(token) {
    if (token != tokenActivo) throw new Error("Sesion Expirada");
    return "Datos obtenidos"
}

async function main() {
    try {
        // Prueba 1 - login correcto
        const token = await login("admin", "1234");
        console.log("Login ok, Valor del token: ", token);

        const datos = await peticionProtegida(token);
        console.log(datos);

        // Prueba 2 - espera 6 segundos, token expirado
        await new Promise(r => setTimeout(r, 6000));
        const datos2 = await peticionProtegida(token1);
        console.log(datos2);

    } catch (error) {
        console.log("Error obtenido del hijo: ", error.message);
    }
}

//main();

// ─────────────────────────────────────────────
// EJERCICIO 2 — Promise.all: peticiones en paralelo
// ─────────────────────────────────────────────
// Tenéis 3 funciones que simulan peticiones lentas:
//    obtenerNombre()  → tarda 1 segundo
//    obtenerEdad()    → tarda 1 segundo
//    obtenerEmail()   → tarda 1 segundo
//
// 1. Primero ejecutadlas en secuencia con await
//    → medid cuánto tarda en total (debería ser ~3s)
//
// 2. Luego ejecutadlas en paralelo con Promise.all
//    → medid cuánto tarda (debería ser ~1s)
//
// Pista: Date.now() antes y después para medir tiempo
// ─────────────────────────────────────────────

function obtenerNombre() {
    return new Promise(resolve => setTimeout(() => resolve("Javier"), 1000));
}

function obtenerEdad() {
    return new Promise(resolve => setTimeout(() => resolve(28), 1000));
}

function obtenerEmail() {
    return new Promise(resolve => setTimeout(() => resolve("javier@email.com"), 1000));
}

//En Secuencia -- deberia ser 3s
async function enSecuencia() {
    const inicio = Date.now();
    const nombre = await obtenerNombre();
    const edad = await obtenerEdad();
    const email = await obtenerEmail();
    console.log("Secuencia: ", { nombre, edad, email });
    console.log("Tiempo en secuencia: ", Date.now() - inicio, " ms");
}

//En paralelo -- deberia ser 1s

async function enParalelo() {
    const inicio = Date.now();
    const [nombre, edad, email] = await Promise.all([
        obtenerNombre(), obtenerEdad(), obtenerEmail()
    ]);
    console.log("Paralelo: ", { nombre, edad, email });
    console.log("Tiempo en paralelo: ", Date.now() - inicio, " ms");
}

enSecuencia();
enParalelo();










// ─────────────────────────────────────────────
// EJERCICIO 3 — Cola de peticiones asíncronas
// ─────────────────────────────────────────────
// Crea una función procesarCola(urls) que:
//
// 1. Reciba un array de URLs
// 2. Las procese DE UNA EN UNA (no en paralelo)
// 3. Si una falla, continúe con la siguiente sin parar
// 4. Al final devuelva un array con los resultados:
//    { url, ok: true, datos } si fue bien
//    { url, ok: false, error } si falló
//
// URLs de prueba:
//    "https://jsonplaceholder.typicode.com/posts/1"
//    "https://url-que-no-existe.xyz"
//    "https://jsonplaceholder.typicode.com/posts/2"
//
// ─────────────────────────────────────────────
