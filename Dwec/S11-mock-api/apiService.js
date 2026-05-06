// =============================================================
// apiService.js
// Capa de servicio que encapsula todas las llamadas HTTP a la
// mock API (json-server) corriendo en http://localhost:2026.
// Aquí centralizamos fetch, manejo de errores y caché en memoria.
// =============================================================

// URL base del recurso "tareas" expuesto por json-server.
const API = "http://localhost:2026/tareas";

// Caché simple en memoria (clave -> { data, timestamp })
// para evitar pedir al servidor lo mismo repetidas veces.
const cache = new Map();

// Tiempo de vida de la caché en milisegundos (30 s).
const TTL = 30000;

// Comprueba que la respuesta HTTP sea correcta (2xx) y
// devuelve el JSON ya parseado. Si no, lanza un error.
async function manejarRespuesta(res) {
    if (!res.ok) {
        throw new Error("HTTP Error " + res.status);
    }

    return await res.json();
}

// Wrapper genérico sobre fetch:
//  - Lanza error si la respuesta no es ok.
//  - Para DELETE devuelve true (no tiene body).
//  - Si fetch falla por red, lanza un error legible.
async function request(url, opciones = {}) {
    try {
        const res = await fetch(url, opciones);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        if (opciones.method === "DELETE") return true;
        return await res.json();
    } catch (error) {
        // Si ya es un error HTTP lo propagamos tal cual,
        // si no, asumimos que es un fallo de conexión.
        if (error.message.startsWith("HTTP")) throw error;
        throw new Error("No se puede conectar con el servidor");

    }
}

// GET /tareas — lista todas las tareas, con caché de 30 s.
export async function getAll() {
    try {
        const ahora = Date.now();
        const cached = cache.get("all");

        // Si hay valor cacheado y aún no ha expirado, lo reutilizamos.
        if (cached && (ahora - cached.timestamp) < TTL) {
            console.log("Cacheado");
            return cached.data;
        } else {
            // Si no hay caché (o expiró) pedimos al servidor y guardamos.
            console.log("Pido al servidor");
            const res = await fetch(API, {
                headers: { "Cache-Control": "no-cache" }
            });
            const data = await manejarRespuesta(res);
            cache.set("all", { data, timestamp: ahora });
            return data;
        }
    } catch (error) {
        if (error.message.startsWith("HTTP")) throw error;
        throw new Error("No se pudo conectar con el servidor");
    }

}

// POST /tareas — crea una nueva tarea con el objeto recibido.
export async function create(tarea) {
    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarea)
        });
        return await manejarRespuesta(res);
    } catch (error) {
        if (error.message.startsWith("HTTP")) throw error;
        throw new Error("No se pudo conectar con el servidor");
    }
}

// PUT /tareas/:id — sustituye la tarea identificada por id.
export async function update(id, cambios) {
    try {
        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cambios)
        });
        return await manejarRespuesta(res);
    } catch (error) {
        if (error.message.startsWith("HTTP")) throw error;
        throw new Error("No se pudo conectar con el servidor");
    }
}

// DELETE /tareas/:id — borra la tarea por id.
export async function remove(id) {
    try {
        const res = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });
        return await manejarRespuesta(res);
    } catch (error) {
        if (error.message.startsWith("HTTP")) throw error;
        throw new Error("No se pudo conectar con el servidor");
    }
}

// GET /tareas?_sort=campo — ejemplo de filtrado/ordenado
// usando query params construidos con URLSearchParams.
export async function getFiltrados(filtros) {
    try {
        const params = new URLSearchParams();

        if (filtros.ordenar) {
            params.set("_sort", filtros.ordenar);
        }

        const url = params.toString() ? `${API}?${params.toString()}` : API;
        const res = await fetch(url);
        return await manejarRespuesta(res);
    } catch (error) {
        if (error.message.startsWith("HTTP")) throw error;
        throw new Error("No se pudo conectar con el servidor");
    }
}

// Crea muchas tareas en paralelo con Promise.allSettled,
// para comparar rendimiento frente a hacerlo en serie.
export async function bulkCreate(items) {
    const inicio = Date.now();
    const resultados = await Promise.allSettled(
        items.map(item => create(item))
    );
    const duracion = Date.now() - inicio;
    console.log("Lote creado en " + duracion + "ms");
    return {
        exitos: resultados.filter(r => r.status === "fulfilled").length,
        fallos: resultados.filter(r => r.status === "rejected").length
    };
}

// Borra varias tareas en paralelo a partir de un array de ids.
export async function bulkRemove(ids) {
    const resultados = await Promise.allSettled(
        ids.map(id => remove(id))
    );
    return {
        exitos: resultados.filter(r => r.status === "fulfilled").length,
        fallos: resultados.filter(r => r.status === "rejected").length
    };
}

// Vacía la caché (útil tras crear/editar/borrar para forzar
// que la siguiente lectura vaya al servidor).
function invalidarCache() {
    cache.clear();
}
