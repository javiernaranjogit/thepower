// ─────────────────────────────────────────────
// EJERCICIO 3 — Favoritos persistidos en localStorage
// ─────────────────────────────────────────────
// Crea un gestor de favoritos. Cada favorito es un objeto:
//   { id, titulo, url, fecha }
//
// Los datos se guardan como array serializado en localStorage
// bajo la clave "favoritos".
//
// Funciones:
//   - cargar()             → lee de localStorage y parsea (array)
//   - guardar(favoritos)   → serializa y escribe en localStorage
//   - añadir(fav)          → evita duplicados por id
//   - quitar(id)           → elimina por id
//   - limpiar()            → vacía la lista
//   - exportar()           → devuelve JSON string
//   - importar(jsonString) → reemplaza la lista desde JSON
//
// Maneja errores:
//   · JSON.parse inválido  → devolver [] y avisar
//   · Quota excedida       → try/catch al guardar
//
// Para poder ejecutarlo en Node.js (sin navegador), incluye
// un mock mínimo de localStorage si no existe.
// ─────────────────────────────────────────────

// Mock mínimo para Node
if (typeof localStorage === "undefined") {
    globalThis.localStorage = {
        _data: {},
        getItem(k)       { return this._data[k] ?? null; },
        setItem(k, v)    { this._data[k] = String(v); },
        removeItem(k)    { delete this._data[k]; },
        clear()          { this._data = {}; }
    };
    console.log("(Usando mock de localStorage para Node)\n");
}

const CLAVE = "favoritos";

function cargar() {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return [];
    try {
        const datos = JSON.parse(raw);
        return Array.isArray(datos) ? datos : [];
    } catch (e) {
        console.error("JSON corrupto en localStorage, se reinicia:", e.message);
        return [];
    }
}

function guardar(favoritos) {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(favoritos));
        return true;
    } catch (e) {
        // QuotaExceededError típicamente
        console.error("No se pudo guardar (¿cuota excedida?):", e.message);
        return false;
    }
}

function añadir(fav) {
    const lista = cargar();
    if (lista.some(f => f.id === fav.id)) {
        console.warn(`Favorito con id=${fav.id} ya existe`);
        return false;
    }
    const nuevo = { fecha: new Date().toISOString(), ...fav };
    lista.push(nuevo);
    return guardar(lista);
}

function quitar(id) {
    const lista = cargar();
    const filtrada = lista.filter(f => f.id !== id);
    if (filtrada.length === lista.length) return false;
    return guardar(filtrada);
}

function limpiar() {
    localStorage.removeItem(CLAVE);
}

function exportar() {
    return JSON.stringify(cargar(), null, 2);
}

function importar(jsonString) {
    try {
        const datos = JSON.parse(jsonString);
        if (!Array.isArray(datos)) throw new Error("El JSON no es un array");
        return guardar(datos);
    } catch (e) {
        console.error("Error al importar:", e.message);
        return false;
    }
}

// ───────── Demostración ─────────
limpiar();

añadir({ id: 1, titulo: "MDN",     url: "https://developer.mozilla.org" });
añadir({ id: 2, titulo: "GitHub",  url: "https://github.com" });
añadir({ id: 3, titulo: "Wikipedia", url: "https://wikipedia.org" });
añadir({ id: 2, titulo: "duplicado", url: "x" }); // bloqueado

console.log("Favoritos actuales:");
console.table(cargar());

quitar(1);
console.log("\nTras quitar id=1:");
console.table(cargar());

const exportado = exportar();
console.log("\nExportado (JSON):\n", exportado);

// Simulamos importación desde otro navegador / backup
limpiar();
importar(exportado);
console.log("\nTras importar:");
console.table(cargar());

// Error al importar JSON inválido
importar("esto no es json {");

// Error al importar no-array
importar('{"no":"array"}');
