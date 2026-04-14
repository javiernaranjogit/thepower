// ─────────────────────────────────────────────
// MINI-PROYECTO — Formulario multipaso
// ─────────────────────────────────────────────
// Crea un formulario dividido en 3 pasos, con una
// barra de progreso superior que indique en qué
// paso está el usuario.
//
//   Paso 1 — Datos personales
//       nombre, apellidos, email, teléfono
//
//   Paso 2 — Dirección
//       calle, ciudad, código postal (5 dígitos),
//       país (select)
//
//   Paso 3 — Preferencias
//       idioma preferido (select), intereses
//       (checkbox múltiples, al menos uno),
//       newsletter (checkbox opcional)
//
// Botones:
//
//   - "Anterior": retrocede al paso previo (deshabilitado
//     en el paso 1).
//   - "Siguiente": valida el paso actual antes de avanzar.
//     Si hay errores se muestran y NO avanza.
//   - En el último paso el botón "Siguiente" se
//     convierte en "Enviar" (muestra primero un
//     resumen del paso 4 con todos los datos
//     recopilados, y al confirmar pinta los datos
//     finales en un bloque <pre>).
//
// Estado:
//
//   Mantén los datos en un objeto JS (estadoForm)
//   que se va rellenando a medida que el usuario
//   avanza, para poder mostrar el resumen final.
// ─────────────────────────────────────────────

const form = document.getElementById("formMulti");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnEnviar = document.getElementById("btnEnviar");
const progresoRelleno = document.getElementById("progresoRelleno");
const indicadores = document.querySelectorAll(".paso-ind");
const contenidoResumen = document.getElementById("contenidoResumen");
const finalizado = document.getElementById("finalizado");
const datosFinales = document.getElementById("datosFinales");

const TOTAL_PASOS = 3;
let pasoActual = 1;

const estadoForm = {
    datosPersonales: {},
    direccion: {},
    preferencias: {},
};

// Definición de campos por paso
const camposPorPaso = {
    1: ["nombre", "apellidos", "email", "telefono"],
    2: ["calle", "ciudad", "codigo_postal", "pais"],
    3: ["idioma", "intereses"],
};

// Validadores
const validadores = {
    nombre: (v) => (!v.trim() ? "El nombre es obligatorio" : ""),
    apellidos: (v) => (!v.trim() ? "Los apellidos son obligatorios" : ""),
    email: (v) => {
        if (!v.trim()) return "El email es obligatorio";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email inválido";
        return "";
    },
    telefono: (v) => {
        if (!v.trim()) return "El teléfono es obligatorio";
        if (!/^[0-9+\s-]{6,}$/.test(v)) return "Teléfono inválido";
        return "";
    },
    calle: (v) => (!v.trim() ? "La calle es obligatoria" : ""),
    ciudad: (v) => (!v.trim() ? "La ciudad es obligatoria" : ""),
    codigo_postal: (v) => {
        if (!v.trim()) return "Código postal obligatorio";
        if (!/^[0-9]{5}$/.test(v)) return "Deben ser 5 dígitos";
        return "";
    },
    pais: (v) => (!v ? "Selecciona un país" : ""),
    idioma: (v) => (!v ? "Selecciona un idioma" : ""),
    intereses: () => {
        const marcados = form.querySelectorAll('input[name="intereses"]:checked');
        return marcados.length === 0 ? "Selecciona al menos un interés" : "";
    },
};

function mostrarError(campo, mensaje) {
    const span = form.querySelector(`[data-error-for="${campo}"]`);
    if (span) span.textContent = mensaje;
    const el = form.elements[campo];
    if (el && el.classList) {
        el.classList.toggle("invalido", !!mensaje);
    }
}

function validarPaso(paso) {
    if (paso > TOTAL_PASOS) return true;
    const campos = camposPorPaso[paso];
    let valido = true;
    campos.forEach((campo) => {
        const el = form.elements[campo];
        const valor = el ? el.value : "";
        const mensaje = validadores[campo] ? validadores[campo](valor) : "";
        mostrarError(campo, mensaje);
        if (mensaje) valido = false;
    });
    return valido;
}

function guardarPaso(paso) {
    if (paso === 1) {
        estadoForm.datosPersonales = {
            nombre: form.nombre.value.trim(),
            apellidos: form.apellidos.value.trim(),
            email: form.email.value.trim(),
            telefono: form.telefono.value.trim(),
        };
    } else if (paso === 2) {
        estadoForm.direccion = {
            calle: form.calle.value.trim(),
            ciudad: form.ciudad.value.trim(),
            codigo_postal: form.codigo_postal.value.trim(),
            pais: form.pais.value,
        };
    } else if (paso === 3) {
        const intereses = [...form.querySelectorAll('input[name="intereses"]:checked')].map(
            (c) => c.value
        );
        estadoForm.preferencias = {
            idioma: form.idioma.value,
            intereses,
            newsletter: form.newsletter.checked,
        };
    }
}

function mostrarPaso(paso) {
    // Ocultar todos
    form.querySelectorAll(".paso").forEach((f) => f.classList.remove("activo"));
    const actual = form.querySelector(`.paso[data-paso="${paso}"]`);
    if (actual) actual.classList.add("activo");

    // Barra de progreso
    const porcentaje = (paso / (TOTAL_PASOS + 1)) * 100;
    progresoRelleno.style.width = `${porcentaje}%`;

    // Indicadores
    indicadores.forEach((ind) => {
        const n = Number(ind.dataset.paso);
        ind.classList.toggle("activo", n === paso);
        ind.classList.toggle("completo", n < paso);
    });

    // Botones
    btnAnterior.disabled = paso === 1;

    if (paso === TOTAL_PASOS + 1) {
        // Resumen
        btnSiguiente.classList.add("oculto");
        btnEnviar.classList.remove("oculto");
        pintarResumen();
    } else {
        btnSiguiente.classList.remove("oculto");
        btnEnviar.classList.add("oculto");
        btnSiguiente.textContent = paso === TOTAL_PASOS ? "Revisar" : "Siguiente";
    }
}

function pintarResumen() {
    const { datosPersonales, direccion, preferencias } = estadoForm;

    const bloques = [
        {
            titulo: "Datos personales",
            datos: {
                Nombre: datosPersonales.nombre,
                Apellidos: datosPersonales.apellidos,
                Email: datosPersonales.email,
                Teléfono: datosPersonales.telefono,
            },
        },
        {
            titulo: "Dirección",
            datos: {
                Calle: direccion.calle,
                Ciudad: direccion.ciudad,
                "Código postal": direccion.codigo_postal,
                País: direccion.pais,
            },
        },
        {
            titulo: "Preferencias",
            datos: {
                Idioma: preferencias.idioma,
                Intereses: preferencias.intereses.join(", ") || "(ninguno)",
                Newsletter: preferencias.newsletter ? "Sí" : "No",
            },
        },
    ];

    contenidoResumen.innerHTML = "";
    bloques.forEach((b) => {
        const div = document.createElement("div");
        div.className = "bloque";
        const h3 = document.createElement("h3");
        h3.textContent = b.titulo;
        const dl = document.createElement("dl");
        for (const [k, v] of Object.entries(b.datos)) {
            const dt = document.createElement("dt");
            dt.textContent = k;
            const dd = document.createElement("dd");
            dd.textContent = v;
            dl.append(dt, dd);
        }
        div.append(h3, dl);
        contenidoResumen.appendChild(div);
    });
}

// Eventos
btnSiguiente.addEventListener("click", () => {
    if (pasoActual <= TOTAL_PASOS && !validarPaso(pasoActual)) return;
    if (pasoActual <= TOTAL_PASOS) guardarPaso(pasoActual);
    pasoActual++;
    mostrarPaso(pasoActual);
});

btnAnterior.addEventListener("click", () => {
    if (pasoActual > 1) {
        pasoActual--;
        mostrarPaso(pasoActual);
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    datosFinales.textContent = JSON.stringify(estadoForm, null, 2);
    form.classList.add("oculto");
    finalizado.classList.remove("oculto");
    finalizado.scrollIntoView({ behavior: "smooth" });
});

// Limpiar error on input
form.addEventListener("input", (e) => {
    const name = e.target.name;
    if (name && validadores[name]) {
        const valor = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        mostrarError(name, validadores[name](valor));
    }
    if (e.target.name === "intereses") mostrarError("intereses", validadores.intereses());
});

// Inicial
mostrarPaso(1);
