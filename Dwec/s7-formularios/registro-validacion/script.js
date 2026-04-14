// ─────────────────────────────────────────────
// MINI-PROYECTO — Formulario de registro con validación
// ─────────────────────────────────────────────
// Crea un formulario de registro completo con los campos:
//
//   - nombre (requerido, mínimo 2 caracteres)
//   - apellidos (requerido, mínimo 2 caracteres)
//   - email (requerido, formato válido)
//   - email_confirm (debe coincidir con email)
//   - password (mínimo 8 caracteres, al menos una
//     mayúscula, una minúscula y un número)
//   - password_confirm (debe coincidir con password)
//   - fecha_nacimiento (obligatorio, el usuario debe
//     tener 18 años o más, calculado a partir de la
//     fecha de hoy)
//   - pais (select, obligatorio seleccionar uno)
//   - aceptar_terminos (checkbox, obligatorio marcar)
//
// Reglas de validación:
//   - Cada campo se valida on blur (al perder foco)
//   - Al enviar el formulario se validan todos los
//     campos a la vez
//   - Los errores se muestran bajo cada campo
//   - Se combina la Constraint Validation API
//     (setCustomValidity) con validación propia
//   - Cada input muestra el estado visual: válido /
//     inválido (clases CSS)
//
// Resultado:
//   - Si todo es correcto se oculta el formulario
//     (o se queda) y se muestra una tarjeta con los
//     datos del usuario registrado (sin la password)
// ─────────────────────────────────────────────

const form = document.getElementById("formRegistro");
const tarjeta = document.getElementById("tarjetaUsuario");
const datosUsuario = document.getElementById("datosUsuario");

// Reglas de validación por campo
const validadores = {
    nombre: (v) => {
        if (!v.trim()) return "El nombre es obligatorio";
        if (v.trim().length < 2) return "Mínimo 2 caracteres";
        return "";
    },
    apellidos: (v) => {
        if (!v.trim()) return "Los apellidos son obligatorios";
        if (v.trim().length < 2) return "Mínimo 2 caracteres";
        return "";
    },
    email: (v) => {
        if (!v.trim()) return "El email es obligatorio";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(v)) return "Formato de email inválido";
        return "";
    },
    email_confirm: (v) => {
        if (!v.trim()) return "Confirma el email";
        if (v !== form.email.value) return "Los emails no coinciden";
        return "";
    },
    password: (v) => {
        if (!v) return "La contraseña es obligatoria";
        if (v.length < 8) return "Mínimo 8 caracteres";
        if (!/[A-Z]/.test(v)) return "Debe tener al menos una mayúscula";
        if (!/[a-z]/.test(v)) return "Debe tener al menos una minúscula";
        if (!/[0-9]/.test(v)) return "Debe tener al menos un número";
        return "";
    },
    password_confirm: (v) => {
        if (!v) return "Confirma la contraseña";
        if (v !== form.password.value) return "Las contraseñas no coinciden";
        return "";
    },
    fecha_nacimiento: (v) => {
        if (!v) return "La fecha es obligatoria";
        const edad = calcularEdad(v);
        if (edad < 18) return `Debes ser mayor de 18 años (tienes ${edad})`;
        if (edad > 120) return "Fecha no válida";
        return "";
    },
    pais: (v) => {
        if (!v) return "Selecciona un país";
        return "";
    },
    aceptar_terminos: (v, el) => {
        if (!el.checked) return "Debes aceptar los términos";
        return "";
    },
};

function calcularEdad(fechaIso) {
    const nacimiento = new Date(fechaIso);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function validarCampo(nombreCampo) {
    const el = form.elements[nombreCampo];
    const valor = el.type === "checkbox" ? el.checked : el.value;
    const mensaje = validadores[nombreCampo](valor, el);

    // Constraint Validation API
    el.setCustomValidity(mensaje);

    const spanError = form.querySelector(`[data-error-for="${nombreCampo}"]`);
    spanError.textContent = mensaje;

    if (el.type !== "checkbox") {
        el.classList.toggle("invalido", !!mensaje);
        el.classList.toggle("valido", !mensaje && (el.value !== "" || el.tagName === "SELECT" && el.value !== ""));
    }

    return !mensaje;
}

// Validación on blur
Object.keys(validadores).forEach((nombre) => {
    const el = form.elements[nombre];
    const evento = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "blur";
    el.addEventListener(evento, () => validarCampo(nombre));
});

// Revalidar confirmaciones al cambiar el original
form.email.addEventListener("input", () => {
    if (form.email_confirm.value) validarCampo("email_confirm");
});
form.password.addEventListener("input", () => {
    if (form.password_confirm.value) validarCampo("password_confirm");
});

// Validación on submit
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const campos = Object.keys(validadores);
    const resultados = campos.map((c) => validarCampo(c));
    const todoValido = resultados.every(Boolean);

    if (!todoValido) {
        // Foco en el primer inválido
        const primerError = campos.find((c) => !form.elements[c].validity.valid);
        if (primerError) form.elements[primerError].focus();
        return;
    }

    mostrarTarjeta();
});

function mostrarTarjeta() {
    const paisTexto = form.pais.options[form.pais.selectedIndex].text;
    const edad = calcularEdad(form.fecha_nacimiento.value);

    const datos = {
        Nombre: form.nombre.value.trim(),
        Apellidos: form.apellidos.value.trim(),
        Email: form.email.value.trim(),
        "Fecha de nacimiento": new Date(form.fecha_nacimiento.value).toLocaleDateString("es-ES"),
        Edad: `${edad} años`,
        País: paisTexto,
    };

    datosUsuario.innerHTML = "";
    for (const [clave, valor] of Object.entries(datos)) {
        const dt = document.createElement("dt");
        dt.textContent = clave;
        const dd = document.createElement("dd");
        dd.textContent = valor;
        datosUsuario.append(dt, dd);
    }

    tarjeta.classList.remove("oculto");
    tarjeta.scrollIntoView({ behavior: "smooth" });
    form.reset();
    form.querySelectorAll(".valido, .invalido").forEach((el) => {
        el.classList.remove("valido", "invalido");
    });
}
