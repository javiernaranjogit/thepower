// ─────────────────────────────────────────────
// EJERCICIO 3 — Juego de adivinanza
// ─────────────────────────────────────────────
// El ordenador elige un número secreto entre 1 y 100 (Math.random).
//
// 1. Crea una función jugar(intentos, maxIntentos = 7) que:
//    - Reciba un array 'intentos' con los números que prueba el usuario
//    - Simule la partida recorriendo el array con un bucle
//    - Por cada intento añada una pista a 'pistas':
//          "Más alto"  si el intento es menor que el secreto
//          "Más bajo"  si es mayor
//          "Acertado"  si coincide (y termina)
//    - Limite a maxIntentos (si se agotan sin acertar → fin de partida)
//    - Devuelva { acertado, numeroSecreto, intentosUsados, pistas }
//
// 2. Crea además una variante jugarBiseccion(maxIntentos = 7) que
//    juegue SOLA (sin array de entrada) adivinando por bisección:
//    parte del rango [1, 100] y en cada iteración prueba el punto medio,
//    ajustando el rango según la pista. Usa un bucle while.
//    Devuelve el mismo objeto { acertado, numeroSecreto, intentosUsados, pistas }.
//
// Prueba ambas variantes e imprime el resultado por consola.
// ─────────────────────────────────────────────

const numeroAleatorio = (min = 1, max = 100) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const jugar = (intentos, maxIntentos = 7) => {
    const numeroSecreto = numeroAleatorio();
    const pistas = [];
    let acertado = false;
    let intentosUsados = 0;

    for (const intento of intentos) {
        if (intentosUsados >= maxIntentos) break;
        intentosUsados++;

        if (typeof intento !== "number" || intento < 1 || intento > 100) {
            pistas.push(`Intento ${intentosUsados}: ${intento} no es válido (1-100)`);
            continue;
        }

        if (intento === numeroSecreto) {
            pistas.push(`Intento ${intentosUsados}: ${intento} → Acertado`);
            acertado = true;
            break;
        }

        const direccion = intento < numeroSecreto ? "Más alto" : "Más bajo";
        pistas.push(`Intento ${intentosUsados}: ${intento} → ${direccion}`);
    }

    return { acertado, numeroSecreto, intentosUsados, pistas };
};

const jugarBiseccion = (maxIntentos = 7) => {
    const numeroSecreto = numeroAleatorio();
    const pistas = [];
    let min = 1;
    let max = 100;
    let acertado = false;
    let intentosUsados = 0;

    while (intentosUsados < maxIntentos && min <= max) {
        const intento = Math.floor((min + max) / 2);
        intentosUsados++;

        if (intento === numeroSecreto) {
            pistas.push(`Intento ${intentosUsados}: ${intento} [${min}-${max}] → Acertado`);
            acertado = true;
            break;
        }

        if (intento < numeroSecreto) {
            pistas.push(`Intento ${intentosUsados}: ${intento} [${min}-${max}] → Más alto`);
            min = intento + 1;
        } else {
            pistas.push(`Intento ${intentosUsados}: ${intento} [${min}-${max}] → Más bajo`);
            max = intento - 1;
        }
    }

    return { acertado, numeroSecreto, intentosUsados, pistas };
};

// ─── Pruebas ───
console.log("\n─── Partida manual (array de intentos) ───");
const partida1 = jugar([50, 25, 75, 60, 55, 58, 57], 7);
console.log(`Número secreto: ${partida1.numeroSecreto}`);
partida1.pistas.forEach(p => console.log(" ", p));
console.log(`Resultado: ${partida1.acertado ? "GANADA" : "PERDIDA"} en ${partida1.intentosUsados} intentos`);

console.log("\n─── Partida por bisección (automática) ───");
const partida2 = jugarBiseccion(7);
console.log(`Número secreto: ${partida2.numeroSecreto}`);
partida2.pistas.forEach(p => console.log(" ", p));
console.log(`Resultado: ${partida2.acertado ? "GANADA" : "PERDIDA"} en ${partida2.intentosUsados} intentos`);

// Estadística: cuántas veces acierta la bisección en 100 partidas con max 7 intentos
const totales = 100;
const ganadas = Array.from({ length: totales }, () => jugarBiseccion(7))
    .filter(({ acertado }) => acertado).length;
console.log(`\nBisección: ${ganadas}/${totales} partidas ganadas con máx. 7 intentos`);
