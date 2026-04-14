// ─────────────────────────────────────────────
// EJERCICIO 1 — Calculadora de notas
// ─────────────────────────────────────────────
// Crea una función analizarNotas(notas) que:
//
// 1. Reciba un array de notas numéricas (0-10)
// 2. Valide que todas son números válidos entre 0 y 10
//    → si hay alguna inválida, lanza un Error con mensaje claro
// 3. Calcule:
//      media       → promedio aritmético (2 decimales)
//      max         → nota más alta
//      min         → nota más baja
//      aprobados   → cuántas notas >= 5
//      suspensos   → cuántas notas < 5
//      calificacion → según la media:
//           < 5   → "Suspenso"
//           5-6.9 → "Aprobado"
//           7-8.9 → "Notable"
//           >= 9  → "Sobresaliente"
//
// 4. Devuelva un objeto { media, max, min, aprobados, suspensos, calificacion }
//
// Prueba la función con varios arrays (normal, todos aprobados,
// todos suspensos, array vacío, notas inválidas).
// ─────────────────────────────────────────────

const analizarNotas = (notas) => {
    if (!Array.isArray(notas) || notas.length === 0) {
        throw new Error("Debe pasarse un array de notas no vacío");
    }

    for (const n of notas) {
        if (typeof n !== "number" || Number.isNaN(n) || n < 0 || n > 10) {
            throw new Error(`Nota inválida: ${n}. Debe ser número entre 0 y 10.`);
        }
    }

    const suma = notas.reduce((acc, n) => acc + n, 0);
    const media = Number((suma / notas.length).toFixed(2));
    const max = Math.max(...notas);
    const min = Math.min(...notas);
    const aprobados = notas.filter(n => n >= 5).length;
    const suspensos = notas.length - aprobados;

    let calificacion;
    if (media < 5) calificacion = "Suspenso";
    else if (media < 7) calificacion = "Aprobado";
    else if (media < 9) calificacion = "Notable";
    else calificacion = "Sobresaliente";

    return { media, max, min, aprobados, suspensos, calificacion };
};

// ─── Pruebas ───
const mostrar = (titulo, notas) => {
    try {
        const resultado = analizarNotas(notas);
        console.log(`\n${titulo}:`, notas);
        console.log(resultado);
    } catch (error) {
        console.log(`\n${titulo}:`, notas);
        console.log(`Error: ${error.message}`);
    }
};

mostrar("Clase A (mixto)", [7, 4.5, 9, 6, 3, 8.75, 10, 5]);
mostrar("Todos aprobados", [8, 9, 10, 7.5, 9.5]);
mostrar("Todos suspensos", [2, 3, 4.9, 1, 0]);
mostrar("Sobresaliente alto", [9.5, 10, 9.8, 9.2]);
mostrar("Notas inválidas", [7, 11, 5]);
mostrar("Array vacío", []);
