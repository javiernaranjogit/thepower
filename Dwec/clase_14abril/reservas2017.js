function obtenerUsuario(id) {
    return new Promise(resolve =>
        setTimeout(() => resolve({ id, nombre: "Ana" }), 500)
    );
}
function obtenerPedidos(usuario) {
    return new Promise(resolve =>
        setTimeout(() => resolve([20, 35, 50]), 500)
    );
}
function calcularTotal(pedidos) {
    return new Promise(resolve =>
        setTimeout(() => resolve(pedidos.reduce((a, b) => a + b, 0)), 500)
    );
}
// FASE 3 — async/await
async function procesarReserva() {
    try {
        const usuario = await obtenerUsuario(1);
        const pedidos = await obtenerPedidos(usuario);
        const total = await calcularTotal(pedidos);
        console.log("Total:", total);
    } catch (error) {
        console.error("Error:", error);
    }
}

procesarReserva();