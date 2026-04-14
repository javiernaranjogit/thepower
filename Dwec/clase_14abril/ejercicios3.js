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
