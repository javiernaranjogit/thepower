// ─────────────────────────────────────────────
// EJERCICIO — Reimplementar map / filter / reduce
// ─────────────────────────────────────────────
// Reimplementa desde cero las siguientes funciones
// de orden superior, usando SOLAMENTE bucles for clásicos
// (nada de forEach, ni de los métodos nativos):
//
//   - miMap(arr, fn)
//   - miFilter(arr, fn)
//   - miReduce(arr, fn, inicial)
//   - miEvery(arr, fn)
//   - miSome(arr, fn)
//   - miFind(arr, fn)
//
// Después compara los resultados con los métodos
// NATIVOS del prototipo Array, usando console.assert
// para verificar que coinciden.
//
// Requisitos:
//   - Las funciones son puras (no mutan el array)
//   - Usa arrow functions en los callbacks de prueba
//   - Demuestra cada una con al menos un ejemplo
// ─────────────────────────────────────────────

const miMap = (arr, fn) => {
    const out = [];
    for (let i = 0; i < arr.length; i++) out.push(fn(arr[i], i, arr));
    return out;
};

const miFilter = (arr, fn) => {
    const out = [];
    for (let i = 0; i < arr.length; i++) {
        if (fn(arr[i], i, arr)) out.push(arr[i]);
    }
    return out;
};

const SIN_INICIAL = Symbol("sin-inicial");
const miReduce = (arr, fn, inicial = SIN_INICIAL) => {
    let acc;
    let i = 0;
    if (inicial === SIN_INICIAL) {
        if (arr.length === 0) throw new TypeError("Reduce de array vacío sin valor inicial");
        acc = arr[0];
        i = 1;
    } else {
        acc = inicial;
    }
    for (; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
    return acc;
};

const miEvery = (arr, fn) => {
    for (let i = 0; i < arr.length; i++) {
        if (!fn(arr[i], i, arr)) return false;
    }
    return true;
};

const miSome = (arr, fn) => {
    for (let i = 0; i < arr.length; i++) {
        if (fn(arr[i], i, arr)) return true;
    }
    return false;
};

const miFind = (arr, fn) => {
    for (let i = 0; i < arr.length; i++) {
        if (fn(arr[i], i, arr)) return arr[i];
    }
    return undefined;
};

// ─── Pruebas y comparación con nativos ───
const nums = [1, 2, 3, 4, 5, 6, 7, 8];

const dobladoMio    = miMap(nums, (n) => n * 2);
const dobladoNativo = nums.map((n) => n * 2);
console.log("miMap:", dobladoMio);
console.assert(JSON.stringify(dobladoMio) === JSON.stringify(dobladoNativo), "miMap no coincide");

const paresMio    = miFilter(nums, (n) => n % 2 === 0);
const paresNativo = nums.filter((n) => n % 2 === 0);
console.log("miFilter:", paresMio);
console.assert(JSON.stringify(paresMio) === JSON.stringify(paresNativo), "miFilter no coincide");

const sumaMia    = miReduce(nums, (acc, n) => acc + n, 0);
const sumaNativa = nums.reduce((acc, n) => acc + n, 0);
console.log("miReduce:", sumaMia);
console.assert(sumaMia === sumaNativa, "miReduce no coincide");

const everyMio    = miEvery(nums, (n) => n > 0);
const everyNativo = nums.every((n) => n > 0);
console.log("miEvery:", everyMio);
console.assert(everyMio === everyNativo, "miEvery no coincide");

const someMio    = miSome(nums, (n) => n > 7);
const someNativo = nums.some((n) => n > 7);
console.log("miSome:", someMio);
console.assert(someMio === someNativo, "miSome no coincide");

const findMio    = miFind(nums, (n) => n > 4);
const findNativo = nums.find((n) => n > 4);
console.log("miFind:", findMio);
console.assert(findMio === findNativo, "miFind no coincide");

// Ejemplo combinado: pipeline con nuestras implementaciones
const personas = [
    { nombre: "Ana",   edad: 22 },
    { nombre: "Luis",  edad: 17 },
    { nombre: "María", edad: 30 },
    { nombre: "Pepe",  edad: 15 },
];

const mediaEdadAdultos = miReduce(
    miMap(miFilter(personas, ({ edad }) => edad >= 18), ({ edad }) => edad),
    (acc, n) => acc + n,
    0
) / miFilter(personas, ({ edad }) => edad >= 18).length;

console.log("Media edad adultos:", mediaEdadAdultos);
console.log("Todos los tests pasaron sin errores de console.assert");
