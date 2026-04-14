// ─────────────────────────────────────────────
// EJERCICIO — Pipeline funcional de productos
// ─────────────────────────────────────────────
// Dado un array de productos con la forma:
//   { id, nombre, categoria, precio, stock, valoracion }
//
// Construye un pipeline ENCADENADO de métodos de array
// que realice, en este orden:
//
//   1. filter  → solo categoria === "electronica"
//   2. filter  → solo los que tienen stock > 0
//   3. sort    → descendente por valoracion
//   4. slice   → quedarse con el TOP 5
//   5. map     → transformar a { nombre, precioConIVA }
//                (IVA = 21%)
//   6. reduce  → sumar el total de precioConIVA
//
// Requisitos:
//   - Arrow functions en todos los callbacks
//   - Destructuring en los parámetros de callback
//   - No mutar el array original (usar spread antes de sort)
//   - Mostrar por consola los resultados INTERMEDIOS
//     y el total final
// ─────────────────────────────────────────────

const productos = [
    { id: 1, nombre: "Portátil",     categoria: "electronica", precio: 900, stock: 4,  valoracion: 4.6 },
    { id: 2, nombre: "Camiseta",     categoria: "ropa",        precio: 20,  stock: 15, valoracion: 4.1 },
    { id: 3, nombre: "Móvil",        categoria: "electronica", precio: 600, stock: 0,  valoracion: 4.9 },
    { id: 4, nombre: "Auriculares",  categoria: "electronica", precio: 80,  stock: 10, valoracion: 4.8 },
    { id: 5, nombre: "Tablet",       categoria: "electronica", precio: 300, stock: 6,  valoracion: 4.3 },
    { id: 6, nombre: "Cargador",     categoria: "electronica", precio: 15,  stock: 50, valoracion: 3.9 },
    { id: 7, nombre: "Smartwatch",   categoria: "electronica", precio: 200, stock: 3,  valoracion: 4.7 },
    { id: 8, nombre: "Zapatillas",   categoria: "ropa",        precio: 60,  stock: 8,  valoracion: 4.5 },
    { id: 9, nombre: "Altavoz",      categoria: "electronica", precio: 120, stock: 7,  valoracion: 4.2 },
    { id:10, nombre: "Teclado",      categoria: "electronica", precio: 45,  stock: 12, valoracion: 4.0 },
];

const IVA = 0.21;

// Pasos intermedios (para ilustrar)
const soloElectronica = productos.filter(({ categoria }) => categoria === "electronica");
console.log("1) Solo electronica:", soloElectronica.map(({ nombre }) => nombre));

const conStock = soloElectronica.filter(({ stock }) => stock > 0);
console.log("2) Con stock > 0:", conStock.map(({ nombre }) => nombre));

const ordenados = [...conStock].sort((a, b) => b.valoracion - a.valoracion);
console.log("3) Ordenados por valoracion desc:", ordenados.map(({ nombre, valoracion }) => `${nombre}(${valoracion})`));

const top5 = ordenados.slice(0, 5);
console.log("4) Top 5:", top5.map(({ nombre }) => nombre));

const conIVA = top5.map(({ nombre, precio }) => ({
    nombre,
    precioConIVA: +(precio * (1 + IVA)).toFixed(2),
}));
console.log("5) Con IVA aplicado:", conIVA);

// Pipeline completo encadenado
const total = productos
    .filter(({ categoria }) => categoria === "electronica")
    .filter(({ stock }) => stock > 0)
    .sort((a, b) => b.valoracion - a.valoracion)
    .slice(0, 5)
    .map(({ nombre, precio }) => ({ nombre, precioConIVA: +(precio * (1 + IVA)).toFixed(2) }))
    .reduce((acc, { precioConIVA }) => acc + precioConIVA, 0);

console.log("6) TOTAL (suma precioConIVA top 5):", total.toFixed(2), "€");
