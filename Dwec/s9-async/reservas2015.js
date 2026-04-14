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

obtenerUsuario(1)
    .then(usuario => obtenerPedidos(usuario))
    .then(pedidos => calcularTotal(pedidos))
    .then(total => console.log("Total:", total))
    .catch(err => console.error("Error:", err));
