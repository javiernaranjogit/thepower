// ─────────────────────────────────────────────
// EJERCICIO 2 — Sistema de descuentos
// ─────────────────────────────────────────────
// Crea una función calcularPrecio(precioBase, tipoCliente, cantidad, esTemporadaAlta) que:
//
// 1. Aplique un descuento según tipoCliente (switch):
//      "nuevo"   →  5%
//      "regular" → 10%
//      "vip"     → 20%
//      otro      →  0% (cliente desconocido)
//
// 2. Aplique descuento extra por cantidad:
//      cantidad >= 50 → 15% extra
//      cantidad >= 10 →  5% extra
//      (se aplica el mayor, no se acumulan entre sí)
//
// 3. Si esTemporadaAlta === true → recargo del 20% sobre el subtotal
//
// 4. Devuelva un objeto con el desglose completo:
//    {
//       precioBase, cantidad, tipoCliente,
//       subtotal,                  // precioBase * cantidad
//       descuentoCliente,          // importe
//       descuentoCantidad,         // importe
//       recargoTemporada,          // importe (0 si no aplica)
//       total                      // precio final redondeado a 2 decimales
//    }
//
// Prueba con varios casos (cliente nuevo pocas unidades, vip muchas,
// temporada alta, tipo de cliente desconocido, etc.)
// ─────────────────────────────────────────────

const calcularPrecio = (precioBase, tipoCliente, cantidad, esTemporadaAlta = false) => {
    if (typeof precioBase !== "number" || precioBase < 0) {
        throw new Error("precioBase debe ser un número positivo");
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new Error("cantidad debe ser un entero positivo");
    }

    let pctCliente;
    switch (tipoCliente) {
        case "nuevo":   pctCliente = 0.05; break;
        case "regular": pctCliente = 0.10; break;
        case "vip":     pctCliente = 0.20; break;
        default:        pctCliente = 0;
    }

    const pctCantidad = cantidad >= 50 ? 0.15 : cantidad >= 10 ? 0.05 : 0;

    const subtotal = precioBase * cantidad;
    const descuentoCliente = subtotal * pctCliente;
    const descuentoCantidad = subtotal * pctCantidad;

    const trasDescuentos = subtotal - descuentoCliente - descuentoCantidad;
    const recargoTemporada = esTemporadaAlta ? trasDescuentos * 0.20 : 0;

    const total = Number((trasDescuentos + recargoTemporada).toFixed(2));

    return {
        precioBase,
        cantidad,
        tipoCliente,
        subtotal: Number(subtotal.toFixed(2)),
        descuentoCliente: Number(descuentoCliente.toFixed(2)),
        descuentoCantidad: Number(descuentoCantidad.toFixed(2)),
        recargoTemporada: Number(recargoTemporada.toFixed(2)),
        total
    };
};

// ─── Pruebas ───
const casos = [
    { precioBase: 20, tipoCliente: "nuevo",   cantidad: 3,   esTemporadaAlta: false },
    { precioBase: 20, tipoCliente: "regular", cantidad: 15,  esTemporadaAlta: false },
    { precioBase: 20, tipoCliente: "vip",     cantidad: 60,  esTemporadaAlta: false },
    { precioBase: 50, tipoCliente: "vip",     cantidad: 100, esTemporadaAlta: true  },
    { precioBase: 10, tipoCliente: "ocasional", cantidad: 5, esTemporadaAlta: true  },
];

casos.forEach(({ precioBase, tipoCliente, cantidad, esTemporadaAlta }, i) => {
    const resultado = calcularPrecio(precioBase, tipoCliente, cantidad, esTemporadaAlta);
    console.log(`\nCaso ${i + 1}: ${cantidad} uds a ${precioBase}€, ${tipoCliente}${esTemporadaAlta ? " (temp. alta)" : ""}`);
    console.log(resultado);
    console.log(`→ Precio final: ${resultado.total}€`);
});
