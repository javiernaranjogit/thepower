// FASE 1 — Callback hell
function obtenerUsuario(id, callback) {
    setTimeout(() => callback({ id, nombre: "Ana" }), 500);
}
function obtenerPedidos(usuario, callback) {
    setTimeout(() => callback([20, 35, 50]), 500);
}
function calcularTotal(pedidos, callback) {
    setTimeout(() => callback(pedidos.reduce((a, b) => a + b, 0)), 500);
}

obtenerUsuario(1, function (usuario) {
    obtenerPedidos(usuario, function (pedidos) {
        calcularTotal(pedidos, function (total) {
            console.log("Total:", total);
        });
    });
});