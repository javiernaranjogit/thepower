const API = "http://localhost:2026/tareas";

async function manejarRespuesta(res) {
    if (!res.ok) {
        throw new Error("HTTP Error " + res.status);
    }

    return await res.json();
}

export async function getAll() {
    const res = await fetch(API);
    return await manejarRespuesta(res);
}

export async function create(tarea) {
    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarea)
    });
    return await manejarRespuesta(res);
}

export async function update(id, cambios) {
    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios)
    });
    return await manejarRespuesta(res);
}

export async function remove(id) {
    const res = await fetch(`${API}/${id}`, {
        method: "DELETE"
    });
    return await manejarRespuesta(res);
}

export async function getFiltrados(filtros) {
    const params = new URLSearchParams();

    if (filtros.ordenar) {
        params.set("_sort", filtros.ordenar);
    }

    const url = params.toString() ? `${API}?${params.toString()}` : API;
    const res = await fetch(url);
    return await manejarRespuesta(res);
}