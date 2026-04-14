// ─────────────────────────────────────────────
// EJERCICIO 2 — Gestión de emails con Set
// ─────────────────────────────────────────────
// Implementa un gestor de listas de emails usando Set
// para evitar duplicados automáticamente.
//
// Funciones sobre una lista (Set):
//   - añadirEmail(set, email)   → valida formato con regex
//                                  y solo añade si es válido
//   - eliminarEmail(set, email) → delete
//   - existeEmail(set, email)   → has
//   - contar(set)               → size
//   - aArrayOrdenado(set)       → [...].sort()
//
// Operaciones entre dos listas (Set):
//   - union(a, b)        → todos los emails de ambos
//   - interseccion(a, b) → solo los que aparecen en los dos
//   - diferencia(a, b)   → los de A que NO están en B
//
// El regex no tiene que ser perfecto (los de RFC son enormes),
// con algo tipo /^[^\s@]+@[^\s@]+\.[^\s@]+$/ basta.
// ─────────────────────────────────────────────

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function añadirEmail(set, email) {
    if (!regexEmail.test(email)) {
        console.warn(`Email inválido: "${email}"`);
        return false;
    }
    const antes = set.size;
    set.add(email.toLowerCase());
    return set.size > antes; // false si ya existía (duplicado evitado)
}

function eliminarEmail(set, email) {
    return set.delete(email.toLowerCase());
}

function existeEmail(set, email) {
    return set.has(email.toLowerCase());
}

function contar(set) {
    return set.size;
}

function aArrayOrdenado(set) {
    return [...set].sort();
}

// Operaciones entre conjuntos
function union(a, b) {
    return new Set([...a, ...b]);
}

function interseccion(a, b) {
    return new Set([...a].filter(x => b.has(x)));
}

function diferencia(a, b) {
    return new Set([...a].filter(x => !b.has(x)));
}

// ───────── Demostración ─────────
const listaA = new Set();

añadirEmail(listaA, "ana@mail.com");
añadirEmail(listaA, "pepe@mail.com");
añadirEmail(listaA, "ANA@mail.com");     // duplicado (lowercase)
añadirEmail(listaA, "no-es-email");       // inválido
añadirEmail(listaA, "lucia@empresa.es");

console.log("Lista A:", aArrayOrdenado(listaA));
console.log("¿Existe pepe?", existeEmail(listaA, "pepe@mail.com"));
console.log("Total:", contar(listaA));

eliminarEmail(listaA, "pepe@mail.com");
console.log("Tras eliminar pepe:", aArrayOrdenado(listaA));

const listaB = new Set();
añadirEmail(listaB, "ana@mail.com");
añadirEmail(listaB, "juan@mail.com");
añadirEmail(listaB, "lucia@empresa.es");

console.log("\nLista B:", aArrayOrdenado(listaB));

console.log("\nUnión:", aArrayOrdenado(union(listaA, listaB)));
console.log("Intersección:", aArrayOrdenado(interseccion(listaA, listaB)));
console.log("Diferencia A − B:", aArrayOrdenado(diferencia(listaA, listaB)));
console.log("Diferencia B − A:", aArrayOrdenado(diferencia(listaB, listaA)));
