// ─────────────────────────────────────────────
// EJERCICIO — Carrito de la compra con descuentos
// ─────────────────────────────────────────────
// Tenemos un carrito de items con la forma:
//   { producto, precio, cantidad }
//
// Implementa las siguientes funciones PURAS
// (sin mutar el carrito original):
//
//   1. subtotal(carrito)
//        → reduce que suma precio * cantidad
//
//   2. aplicarCupon(total, codigo)
//        → switch con los cupones:
//          "VERANO10"     → 10% de descuento
//          "BLACK25"      → 25% de descuento
//          "ENVIOGRATIS"  → resta 5€ fijos (gastos envío)
//          cualquier otro → sin descuento
//
//   3. calcularIVA(total, tipo = 0.21)
//        → devuelve el importe de IVA sobre el total
//
//   4. totalFinal(carrito, cupon)
//        → subtotal → aplicar cupón → sumar IVA
//
//   5. resumen(carrito, cupon)
//        → devuelve un objeto con TODOS los pasos:
//          { subtotal, conDescuento, iva, total }
//
// Requisitos:
//   - Arrow functions
//   - Destructuring en callbacks
//   - No mutar el carrito (usar spread si hace falta)
// ─────────────────────────────────────────────

const carrito = [
    { producto: "Libro JS",      precio: 25,  cantidad: 2 },
    { producto: "Taza DWEC",     precio: 10,  cantidad: 1 },
    { producto: "Sudadera FP",   precio: 40,  cantidad: 1 },
    { producto: "Pegatinas",     precio:  3,  cantidad: 5 },
];

const subtotal = (carrito) =>
    carrito.reduce((acc, { precio, cantidad }) => acc + precio * cantidad, 0);

const aplicarCupon = (total, codigo) => {
    switch (codigo) {
        case "VERANO10":    return total * 0.90;
        case "BLACK25":     return total * 0.75;
        case "ENVIOGRATIS": return Math.max(0, total - 5);
        default:            return total;
    }
};

const calcularIVA = (total, tipo = 0.21) => total * tipo;

const totalFinal = (carrito, cupon) => {
    const sub = subtotal(carrito);
    const conDto = aplicarCupon(sub, cupon);
    return conDto + calcularIVA(conDto);
};

const resumen = (carrito, cupon) => {
    const sub = subtotal(carrito);
    const conDescuento = aplicarCupon(sub, cupon);
    const iva = calcularIVA(conDescuento);
    return {
        subtotal:     +sub.toFixed(2),
        conDescuento: +conDescuento.toFixed(2),
        iva:          +iva.toFixed(2),
        total:        +(conDescuento + iva).toFixed(2),
        cupon:        cupon ?? "ninguno",
    };
};

// Pruebas — el carrito NO se muta entre llamadas
console.log("Carrito original:", carrito);
console.log("Subtotal:", subtotal(carrito));

console.log("Sin cupón:",   resumen(carrito, null));
console.log("VERANO10:",    resumen(carrito, "VERANO10"));
console.log("BLACK25:",     resumen(carrito, "BLACK25"));
console.log("ENVIOGRATIS:", resumen(carrito, "ENVIOGRATIS"));
console.log("Cupón inexistente:", resumen(carrito, "NOEXISTE"));

console.log("Total final BLACK25:", totalFinal(carrito, "BLACK25").toFixed(2), "€");
console.log("Carrito tras todo (debe seguir igual):", carrito);
