// ─────────────────────────────────────────────
// MINI-PROYECTO — Formulario con validación en tiempo real
// ─────────────────────────────────────────────
// Construye un formulario con 4 campos: nombre, email, edad y
// password. La validación debe ser en tiempo real utilizando los
// eventos "input" (mientras se escribe) y "blur" (al salir del
// campo).
//
// Reglas de validación:
//   - nombre:   mínimo 3 caracteres
//   - email:    debe cumplir una expresión regular estándar
//   - edad:     numérica, entre 18 y 99 (ambos incluidos)
//   - password: mínimo 8 caracteres, al menos una mayúscula
//               y al menos un número
//
// Requisitos:
//   - Mostrar el mensaje de error debajo de cada campo
//   - Marcar visualmente campos válidos / inválidos
//   - El botón "Enviar" debe permanecer deshabilitado mientras
//     haya algún error o algún campo vacío
//   - Al hacer submit válido, mostrar un resumen con los datos
//     introducidos en un <section> aparte
//
// Conceptos: addEventListener, querySelector, FormData, regex,
// manipulación de clases CSS, preventDefault.
// ─────────────────────────────────────────────

const formulario = document.querySelector('#formulario');
const btnSubmit = document.querySelector('#submit');
const resumen = document.querySelector('#resumen');

const reglas = {
    nombre: {
        valida: (v) => v.trim().length >= 3,
        error: 'El nombre debe tener al menos 3 caracteres.'
    },
    email: {
        valida: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        error: 'Introduce un email válido (ej. nombre@dominio.com).'
    },
    edad: {
        valida: (v) => {
            const n = Number(v);
            return Number.isInteger(n) && n >= 18 && n <= 99;
        },
        error: 'La edad debe ser un número entero entre 18 y 99.'
    },
    password: {
        valida: (v) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(v),
        error: 'Mínimo 8 caracteres, con una mayúscula y un número.'
    }
};

const estado = { nombre: false, email: false, edad: false, password: false };

function validarCampo(campo) {
    const input = document.querySelector(`#${campo}`);
    const errorEl = document.querySelector(`#error-${campo}`);
    const valor = input.value;

    if (valor === '') {
        estado[campo] = false;
        input.classList.remove('valido', 'invalido');
        errorEl.textContent = '';
    } else if (reglas[campo].valida(valor)) {
        estado[campo] = true;
        input.classList.add('valido');
        input.classList.remove('invalido');
        errorEl.textContent = '';
    } else {
        estado[campo] = false;
        input.classList.add('invalido');
        input.classList.remove('valido');
        errorEl.textContent = reglas[campo].error;
    }

    btnSubmit.disabled = !Object.values(estado).every(Boolean);
}

Object.keys(reglas).forEach((campo) => {
    const input = document.querySelector(`#${campo}`);
    input.addEventListener('input', () => validarCampo(campo));
    input.addEventListener('blur', () => validarCampo(campo));
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const datos = new FormData(formulario);
    resumen.classList.remove('oculto');
    resumen.innerHTML = `
        <h2>Resumen del registro</h2>
        <ul>
            <li><strong>Nombre:</strong> ${datos.get('nombre')}</li>
            <li><strong>Email:</strong> ${datos.get('email')}</li>
            <li><strong>Edad:</strong> ${datos.get('edad')}</li>
            <li><strong>Contraseña:</strong> ${'•'.repeat(datos.get('password').length)}</li>
        </ul>
    `;
    formulario.reset();
    Object.keys(estado).forEach((k) => (estado[k] = false));
    document.querySelectorAll('input').forEach((i) => i.classList.remove('valido', 'invalido'));
    btnSubmit.disabled = true;
});
