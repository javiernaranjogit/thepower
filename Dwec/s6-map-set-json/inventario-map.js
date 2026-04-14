// ─────────────────────────────────────────────
// EJERCICIO 1 — Gestión de inventario con Map
// ─────────────────────────────────────────────
// Crea un gestor de inventario usando un Map donde:
//   - clave  = id del producto (puede ser número, no solo string)
//   - valor  = { nombre, stock, precio }
//
// Implementa las siguientes funciones:
//
//   - añadir(id, nombre, stock, precio)
//   - actualizarStock(id, nuevoStock)
//   - eliminar(id)
//   - buscar(id)
//   - totalInventario()        → suma de stock * precio
//   - productosSinStock()      → array de productos con stock 0
//   - productosOrdenadosPorPrecio() → array ordenado asc
//
// Demuestra por qué Map es mejor que un objeto literal aquí:
//   · Iteración en orden de inserción
//   · Propiedad .size sin recorrer
//   · Claves de cualquier tipo (números, objetos...)
//
// Serializa y deserializa a JSON (Map NO es JSON-serializable
// directamente → hay que convertir con Array.from / new Map).
// ─────────────────────────────────────────────

const inventario = new Map();

function añadir(id, nombre, stock, precio) {
    inventario.set(id, { nombre, stock, precio });
}

function actualizarStock(id, nuevoStock) {
    const prod = inventario.get(id);
    if (!prod) throw new Error(`Producto ${id} no existe`);
    prod.stock = nuevoStock;
}

function eliminar(id) {
    return inventario.delete(id);
}

function buscar(id) {
    return inventario.get(id) ?? null;
}

function totalInventario() {
    let total = 0;
    for (const { stock, precio } of inventario.values()) {
        total += stock * precio;
    }
    return total;
}

function productosSinStock() {
    const sinStock = [];
    for (const [id, prod] of inventario) {
        if (prod.stock === 0) sinStock.push({ id, ...prod });
    }
    return sinStock;
}

function productosOrdenadosPorPrecio() {
    return [...inventario.entries()]
        .map(([id, prod]) => ({ id, ...prod }))
        .sort((a, b) => a.precio - b.precio);
}

// Serialización: Map → JSON
function serializar() {
    return JSON.stringify(Array.from(inventario.entries()));
}

// Deserialización: JSON → Map
function deserializar(json) {
    const array = JSON.parse(json);
    return new Map(array);
}

// ───────── Demostración ─────────
añadir(1, "Teclado", 10, 25);
añadir(2, "Ratón", 0, 15);
añadir(3, "Monitor", 5, 180);
añadir(4, "Auriculares", 0, 40);

console.log("Tamaño (size directo, sin recorrer):", inventario.size);

console.log("\nBuscar id=3:", buscar(3));

actualizarStock(2, 20);
console.log("Tras actualizar stock ratón:", buscar(2));

console.log("\nTotal inventario (€):", totalInventario());
console.log("\nSin stock:", productosSinStock());
console.log("\nOrdenados por precio:", productosOrdenadosPorPrecio());

// Ventaja Map: claves no-string
const claveObj = { categoria: "oferta" };
inventario.set(claveObj, { nombre: "Pack promo", stock: 3, precio: 99 });
console.log("\nAcceso por clave objeto:", inventario.get(claveObj));

// Iteración en orden de inserción (garantizada)
console.log("\nIteración ordenada:");
for (const [id, prod] of inventario) {
    console.log(`  ${JSON.stringify(id)} → ${prod.nombre}`);
}

// Serializar / deserializar (ojo: la clave objeto se pierde al JSON)
inventario.delete(claveObj);
const json = serializar();
console.log("\nJSON:", json);

const copia = deserializar(json);
console.log("Map restaurado, size:", copia.size);
console.log("Producto 1 restaurado:", copia.get(1));
