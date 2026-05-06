// =============================================================
// main.js
// Punto de entrada del front. Conecta los botones de la UI con
// las funciones del apiService y muestra los resultados en el
// div #log de la página.
// =============================================================

import { getAll, create, update, remove, getFiltrados, bulkCreate, bulkRemove } from "./apiService.js";

// Añade una línea al log visible en pantalla y también a la consola.
function log(mensaje) {
    const logArea = document.querySelector("#log");
    const linea = document.createElement("p");
    linea.textContent = mensaje;
    logArea.appendChild(linea);
    console.log(mensaje);
}

// Vacía el contenido del log.
function limpiarLog() {
    document.querySelector("#log").innerHTML = "";
}

// Pequeña utilidad para esperar X milisegundos dentro de async.
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Demo del flujo CRUD completo: listar -> crear -> editar -> borrar -> ordenar.
// Se intercalan delays para poder ver paso a paso lo que va pasando.
async function llamadaServicios() {
    limpiarLog();
    try {
        log("Listar todos");
        await delay(5000);

        // 1) GET de todas las tareas existentes.
        const inicial = await getAll();
        log("Se obtuvieron: " + inicial.length + " tareas");
        inicial.forEach(t => log("Tarea id: " + t.id + " y el titulo: " + t.titulo));
        await delay(5000);

        log("Crear nuevo");
        await delay(5000);

        // 2) POST: creamos una tarea nueva.
        const nueva = await create({
            titulo: "Tarea desde el navegador",
            completada: false
        });
        log("Creada con titulo: " + nueva.titulo);
        await delay(5000);

        log("Editamos una");
        await delay(5000);

        // 3) PUT: editamos la tarea recién creada.
        const editada = await update(nueva.id, { titulo: "Editada", completada: true });
        log("Actualizada con nuevo titulo: " + editada.titulo);
        await delay(5000);

        log("Borrar");
        await delay(5000);

        // 4) DELETE: la borramos para dejarlo todo limpio.
        await remove(nueva.id);
        log("Borrada");
        await delay(5000);

        // 5) GET con filtro: pedimos las tareas ordenadas por título.
        const ordenadas = await getFiltrados({ ordenar: "titulo" });
        log("Tareas ordenadas: ");
        ordenadas.forEach(t => log(" " + t.titulo));
        log("FIN - Todo completado");

    } catch (error) {
        log("Error: " + error.message);
    }
}

// Demo de creación masiva: compara crear N tareas en serie
// frente a crearlas en paralelo con Promise.allSettled.
async function front_bulkCreate() {
    limpiarLog();
    try {
        const items = [
            { titulo: "Paralelo 1", completada: false },
            { titulo: "Paralelo 2", completada: true },
            { titulo: "Paralelo 3", completada: false },
            { titulo: "Paralelo 4", completada: true },
            { titulo: "Paralelo 5", completada: true },
        ];
        // Probamos la creación secuencial, uno tras otro.
        log("Iniciando secuencial....");
        const inicioSec = Date.now();
        for (const item of items) {
            await create(item);
        }
        const duracionSec = Date.now() - inicioSec;
        log("Secuencial: " + duracionSec + " ms");
        log("Secuencial terminado ");
        await delay(10000);
        log("Secuencial terminado ");

        // Probamos la paralelización con bulkCreate (Promise.allSettled).
        const inicioPar = Date.now();
        const resultado = await bulkCreate(items);
        const duracionPar = Date.now() - inicioPar;
        log("Paralelo: " + duracionPar + " ms");
        log("Exitos: " + resultado.exitos + "- Fallos: " + resultado.fallos);
        await delay(10000);

        // Resumen del % de mejora del paralelo respecto al secuencial.
        const mejora = ((duracionSec - duracionPar) / duracionSec * 100).toFixed(1);
        log("Mejora: " + mejora + " %");
    } catch (error) {
        log("Error: " + error.message);
    }
}

// Demo de la caché de getAll():
//  - 1ª llamada -> va al servidor.
//  - 2ª llamada inmediata -> sale de caché.
//  - Tras 40 s la caché expira (TTL 30 s) y vuelve al servidor.
async function cacheado() {
    limpiarLog();
    try {
        log("Primera llamada a getall()");
        await getAll()
        await delay(1000);
        log("Segunda llamada 1 segundo despues");
        await getAll();
        await delay(40000);
        log("Ahora ya sin cache");
        await getAll();
    } catch (error) {
        log("Error: " + error.message);
    }
}


// Conexión de los botones de la UI con cada demo.
document.querySelector("#btnEjecutar").addEventListener("click", llamadaServicios);
document.querySelector("#btnLimpiar").addEventListener("click", limpiarLog);
document.querySelector("#btnBulkCreate").addEventListener("click", front_bulkCreate);
document.querySelector("#cacheado").addEventListener("click", cacheado);
