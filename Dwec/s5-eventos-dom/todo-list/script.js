// ─────────────────────────────────────────────
// MINI-PROYECTO — Lista de tareas (To-Do list)
// ─────────────────────────────────────────────
// Crea una lista de tareas con las siguientes funcionalidades:
//
//   - Un <input> y un botón "Añadir" para crear nuevas tareas.
//     No se permiten tareas vacías ni solo con espacios.
//   - Al hacer click sobre el texto de una tarea, ésta se marca
//     como completada (texto tachado, line-through).
//   - Cada tarea tiene un botón "eliminar" que la retira de la
//     lista. Usa EVENT DELEGATION sobre el <ul>, no añadas un
//     listener por tarea.
//   - Filtros "Todas / Pendientes / Completadas" que cambian la
//     vista sin perder los datos.
//   - Contador dinámico de tareas pendientes en el footer.
//
// Restricciones:
//   - No se requiere persistencia (localStorage llegará en s6).
//   - Mantén el estado en memoria (un array de objetos).
//
// Técnicas: addEventListener, event delegation, closest,
// data-attributes, manipulación del DOM, filter/reduce.
// ─────────────────────────────────────────────

const form = document.querySelector('#form-tarea');
const input = document.querySelector('#input-tarea');
const lista = document.querySelector('#lista');
const filtros = document.querySelector('#filtros');
const contador = document.querySelector('#contador');

let tareas = [];
let filtroActivo = 'todas';
let siguienteId = 1;

function renderizar() {
    const visibles = tareas.filter((t) => {
        if (filtroActivo === 'pendientes') return !t.completada;
        if (filtroActivo === 'completadas') return t.completada;
        return true;
    });

    lista.innerHTML = visibles
        .map(
            (t) => `
            <li class="tarea ${t.completada ? 'completada' : ''}" data-id="${t.id}">
                <span class="texto">${t.texto}</span>
                <button class="eliminar" aria-label="Eliminar tarea">&times;</button>
            </li>
        `
        )
        .join('');

    const pendientes = tareas.filter((t) => !t.completada).length;
    contador.textContent = `${pendientes} ${pendientes === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
}

function escapar(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;
    tareas.push({ id: siguienteId++, texto: escapar(texto), completada: false });
    input.value = '';
    renderizar();
});

// Event delegation: un único listener para toda la lista
lista.addEventListener('click', (e) => {
    const li = e.target.closest('.tarea');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.classList.contains('eliminar')) {
        tareas = tareas.filter((t) => t.id !== id);
        renderizar();
        return;
    }

    if (e.target.classList.contains('texto')) {
        const tarea = tareas.find((t) => t.id === id);
        if (tarea) {
            tarea.completada = !tarea.completada;
            renderizar();
        }
    }
});

filtros.addEventListener('click', (e) => {
    const btn = e.target.closest('.filtro');
    if (!btn) return;
    filtros.querySelectorAll('.filtro').forEach((f) => f.classList.remove('activo'));
    btn.classList.add('activo');
    filtroActivo = btn.dataset.filtro;
    renderizar();
});

renderizar();
