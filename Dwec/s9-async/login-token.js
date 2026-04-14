// ─────────────────────────────────────────────
// EJERCICIO — Sistema de login con token simulado
// ─────────────────────────────────────────────
// Simula un sistema de autenticación por tokens con
// expiración, refresco y logout.
//
// Usuarios válidos:
//     { admin: "1234", ana: "abcd" }
//
// Funciones a implementar:
//
// 1. login(usuario, password)
//    - Valida credenciales contra el objeto de usuarios.
//    - Si son correctas → genera un token con formato:
//          "TOKEN_<usuario>_<timestamp>"
//      que expira a los 5 segundos y lo devuelve.
//    - Si no → lanza un error "Credenciales incorrectas".
//
// 2. validarToken(token)
//    - Devuelve true si el token existe y NO ha expirado.
//    - Devuelve false en caso contrario.
//
// 3. peticionProtegida(token, recurso)
//    - Si el token es válido → devuelve datos simulados
//      para ese recurso (ej. { recurso, datos: [...] }).
//    - Si no → lanza un error "Token inválido o expirado".
//
// 4. refrescarToken(tokenViejo)
//    - Si el token viejo sigue siendo válido → genera uno
//      nuevo (invalidando el viejo) y lo devuelve.
//    - Si no → lanza error.
//
// 5. logout(token)
//    - Invalida el token (lo elimina del registro).
//
// Prueba el flujo completo con async/await + try/catch:
//   login → peticionProtegida OK
//   refrescarToken → peticionProtegida con el nuevo OK
//   logout → peticionProtegida falla
//   esperar 6s → el token original ya habría expirado
// ─────────────────────────────────────────────

const USUARIOS = { admin: "1234", ana: "abcd" };
const TIEMPO_EXPIRACION_MS = 5000;

// Registro de tokens activos: token → { usuario, expiraEn }
const tokensActivos = new Map();

async function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function login(usuario, password) {
    if (USUARIOS[usuario] !== password) {
        throw new Error("Credenciales incorrectas");
    }
    const token = `TOKEN_${usuario}_${Date.now()}`;
    const expiraEn = Date.now() + TIEMPO_EXPIRACION_MS;
    tokensActivos.set(token, { usuario, expiraEn });

    // Auto-limpieza cuando expire
    setTimeout(() => {
        if (tokensActivos.has(token)) {
            tokensActivos.delete(token);
            console.log(`[auto] Token expirado y eliminado: ${token}`);
        }
    }, TIEMPO_EXPIRACION_MS);

    console.log(`Login OK para ${usuario}. Token: ${token}`);
    return token;
}

function validarToken(token) {
    if (!tokensActivos.has(token)) return false;
    const { expiraEn } = tokensActivos.get(token);
    if (Date.now() > expiraEn) {
        tokensActivos.delete(token);
        return false;
    }
    return true;
}

async function peticionProtegida(token, recurso) {
    if (!validarToken(token)) {
        throw new Error("Token inválido o expirado");
    }
    const { usuario } = tokensActivos.get(token);
    const datosSimulados = {
        usuarios: [{ id: 1, nombre: "Ana" }, { id: 2, nombre: "Luis" }],
        productos: [{ id: 1, nombre: "Libro" }, { id: 2, nombre: "Lápiz" }],
        pedidos: [{ id: 1, total: 25 }, { id: 2, total: 40 }]
    };
    return {
        recurso,
        solicitadoPor: usuario,
        datos: datosSimulados[recurso] ?? []
    };
}

async function refrescarToken(tokenViejo) {
    if (!validarToken(tokenViejo)) {
        throw new Error("No se puede refrescar: token inválido o expirado");
    }
    const { usuario } = tokensActivos.get(tokenViejo);
    tokensActivos.delete(tokenViejo);
    const nuevo = `TOKEN_${usuario}_${Date.now()}`;
    tokensActivos.set(nuevo, {
        usuario,
        expiraEn: Date.now() + TIEMPO_EXPIRACION_MS
    });
    console.log(`Token refrescado para ${usuario}: ${nuevo}`);
    return nuevo;
}

function logout(token) {
    const existia = tokensActivos.delete(token);
    console.log(existia ? `Logout OK: ${token}` : `Logout: token no existía`);
}

// ─────────────────────────────────────────────
// Flujo de prueba completo
// ─────────────────────────────────────────────

async function main() {
    console.log("\n=== 1. Login correcto ===");
    let token;
    try {
        token = await login("admin", "1234");
        const data = await peticionProtegida(token, "usuarios");
        console.log("Petición OK:", data);
    } catch (e) {
        console.error("Error:", e.message);
    }

    console.log("\n=== 2. Login incorrecto ===");
    try {
        await login("admin", "xxxx");
    } catch (e) {
        console.error("Error esperado:", e.message);
    }

    console.log("\n=== 3. Refrescar token ===");
    let tokenNuevo;
    try {
        tokenNuevo = await refrescarToken(token);
        const data = await peticionProtegida(tokenNuevo, "productos");
        console.log("Petición OK con token nuevo:", data);

        // El viejo ya no debería servir
        try {
            await peticionProtegida(token, "productos");
        } catch (e) {
            console.log("Token viejo ya no vale (esperado):", e.message);
        }
    } catch (e) {
        console.error("Error:", e.message);
    }

    console.log("\n=== 4. Logout ===");
    logout(tokenNuevo);
    try {
        await peticionProtegida(tokenNuevo, "pedidos");
    } catch (e) {
        console.log("Tras logout falla (esperado):", e.message);
    }

    console.log("\n=== 5. Expiración automática (esperando 6s) ===");
    const tokenTemp = await login("ana", "abcd");
    console.log("Petición inmediata:");
    console.log(await peticionProtegida(tokenTemp, "pedidos"));

    await esperar(6000);
    try {
        await peticionProtegida(tokenTemp, "pedidos");
    } catch (e) {
        console.log("Tras 6s falla (esperado):", e.message);
    }
}

main();
