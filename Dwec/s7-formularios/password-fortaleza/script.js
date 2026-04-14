// ─────────────────────────────────────────────
// MINI-PROYECTO — Medidor de fortaleza de contraseña
// ─────────────────────────────────────────────
// Crea un input de contraseña con un medidor visual
// (barra de progreso) que evalúe su fortaleza en
// tiempo real según los siguientes criterios:
//
//   - Longitud mínima (8, bonus si >= 12)
//   - Contiene mayúsculas
//   - Contiene minúsculas
//   - Contiene números
//   - Contiene símbolos (no alfanuméricos)
//   - No tiene repeticiones de 3+ caracteres iguales
//     seguidos (ej: "aaa", "111")
//
// Niveles a mostrar (color distinto cada uno):
//
//   0 → vacía        → gris
//   1 → muy débil    → rojo
//   2 → débil        → naranja
//   3 → media        → amarillo
//   4 → fuerte       → verde claro
//   5 → muy fuerte   → verde oscuro
//
// Además:
//
//   - Muestra una lista de sugerencias de mejora
//     dinámica: cada criterio cumplido se tacha.
//   - Botón "Mostrar / Ocultar" que alterna el tipo
//     del input entre "password" y "text".
//
// La barra de progreso debe pintarse con width en %
// y el color debe cambiar con el nivel.
// ─────────────────────────────────────────────

const input = document.getElementById("password");
const toggleBtn = document.getElementById("toggleVisibilidad");
const barra = document.getElementById("barraProgreso");
const nivelTexto = document.getElementById("nivelTexto");
const lista = document.getElementById("listaSugerencias");

const criterios = [
    { id: "longitud", test: (p) => p.length >= 8, texto: "Al menos 8 caracteres" },
    { id: "longitudExtra", test: (p) => p.length >= 12, texto: "12 caracteres o más (recomendado)" },
    { id: "mayus", test: (p) => /[A-Z]/.test(p), texto: "Incluye alguna mayúscula" },
    { id: "minus", test: (p) => /[a-z]/.test(p), texto: "Incluye alguna minúscula" },
    { id: "numero", test: (p) => /[0-9]/.test(p), texto: "Incluye algún número" },
    { id: "simbolo", test: (p) => /[^A-Za-z0-9]/.test(p), texto: "Incluye algún símbolo (!, @, #, etc.)" },
    { id: "sinRepes", test: (p) => p.length > 0 && !/(.)\1{2,}/.test(p), texto: "Evita 3+ caracteres iguales seguidos" },
];

const niveles = [
    { texto: "Introduce una contraseña", color: "#9ca3af", clase: "nivel-0", porcentaje: 0 },
    { texto: "Muy débil", color: "#dc2626", clase: "nivel-1", porcentaje: 15 },
    { texto: "Débil", color: "#ea580c", clase: "nivel-2", porcentaje: 35 },
    { texto: "Media", color: "#ca8a04", clase: "nivel-3", porcentaje: 60 },
    { texto: "Fuerte", color: "#16a34a", clase: "nivel-4", porcentaje: 85 },
    { texto: "Muy fuerte", color: "#15803d", clase: "nivel-5", porcentaje: 100 },
];

function evaluarPassword(p) {
    if (!p) return { nivel: 0, cumplidos: [] };

    const cumplidos = criterios.filter((c) => c.test(p)).map((c) => c.id);
    const puntos = cumplidos.length;

    // Mapeo de puntos (0-7) a niveles (1-5)
    let nivel;
    if (puntos <= 1) nivel = 1;
    else if (puntos <= 3) nivel = 2;
    else if (puntos === 4) nivel = 3;
    else if (puntos <= 6) nivel = 4;
    else nivel = 5;

    return { nivel, cumplidos };
}

function renderizar(password) {
    const { nivel, cumplidos } = evaluarPassword(password);
    const info = niveles[nivel];

    // Barra
    barra.style.width = `${info.porcentaje}%`;
    barra.style.background = info.color;

    // Texto nivel
    nivelTexto.textContent = info.texto;
    nivelTexto.className = `nivel-texto ${info.clase}`;

    // Sugerencias
    lista.innerHTML = "";
    criterios.forEach((c) => {
        const li = document.createElement("li");
        li.textContent = c.texto;
        if (cumplidos.includes(c.id)) li.classList.add("cumplida");
        lista.appendChild(li);
    });
}

input.addEventListener("input", (e) => renderizar(e.target.value));

toggleBtn.addEventListener("click", () => {
    const visible = input.type === "text";
    input.type = visible ? "password" : "text";
    toggleBtn.textContent = visible ? "Mostrar" : "Ocultar";
    toggleBtn.setAttribute(
        "aria-label",
        visible ? "Mostrar contraseña" : "Ocultar contraseña"
    );
    input.focus();
});

// Render inicial
renderizar("");
