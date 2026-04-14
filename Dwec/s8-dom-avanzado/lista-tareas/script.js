// ─────────────────────────────────────────────
// MINI-PROYECTO — Lista de Tareas Avanzada
// ─────────────────────────────────────────────
// Aplicación de tareas con funcionalidades avanzadas
// del DOM y persistencia en localStorage.
//
// Requisitos:
//
// 1. Añadir tarea desde un formulario con texto,
//    prioridad (alta/media/baja) y fecha límite.
//
// 2. Eliminar tarea con botón "X".
//
// 3. Editar inline: doble click sobre el texto lo
//    convierte en <input>; Enter o blur guarda, Esc cancela.
//
// 4. Reordenar las tareas mediante drag & drop HTML5
//    (dragstart, dragover, drop, dragend).
//
// 5. Color del borde izquierdo según prioridad:
//    rojo=alta, naranja=media, verde=baja.
//
// 6. Persistencia en localStorage (guardar y restaurar
//    al cargar).
//
// 7. Event delegation: UN SOLO listener de click en
//    el contenedor <ul> gestiona editar y eliminar
//    usando dataset.accion.
//
// 8. Render con <template> + cloneNode + DocumentFragment.
// ─────────────────────────────────────────────

const LS_KEY = "tareas_dwec_v1";

const form       = document.getElementById("formTarea");
const txt        = document.getElementById("txtTarea");
const selPrio    = document.getElementById("selPrioridad");
const fecha      = document.getElementById("fechaLimite");
const lista      = document.getElementById("lista");
const tpl        = document.getElementById("tplTarea");

let tareas = cargar();

function cargar() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch { return []; }
}

function guardar() {
    localStorage.setItem(LS_KEY, JSON.stringify(tareas));
}

function render() {
    const frag = document.createDocumentFragment();
    tareas.forEach(t => {
        const nodo = tpl.content.cloneNode(true);
        const li = nodo.querySelector(".tarea");
        li.dataset.id = t.id;
        li.dataset.prioridad = t.prioridad;

        nodo.querySelector(".tarea__texto").textContent = t.texto;
        nodo.querySelector(".tarea__fecha").textContent =
            t.fecha ? new Date(t.fecha).toLocaleDateString("es-ES") : "sin fecha";

        frag.appendChild(nodo);
    });
    lista.replaceChildren(frag);
}

// ── Añadir ──
form.addEventListener("submit", e => {
    e.preventDefault();
    tareas.push({
        id: Date.now().toString(),
        texto: txt.value.trim(),
        prioridad: selPrio.value,
        fecha: fecha.value
    });
    guardar();
    render();
    form.reset();
    selPrio.value = "media";
});

// ── Event delegation: editar / eliminar ──
lista.addEventListener("click", e => {
    const btn = e.target.closest("[data-accion]");
    if (!btn) return;
    const li = btn.closest(".tarea");
    const id = li.dataset.id;

    if (btn.dataset.accion === "eliminar") {
        tareas = tareas.filter(t => t.id !== id);
        guardar();
        render();
    } else if (btn.dataset.accion === "editar") {
        activarEdicion(li, id);
    }
});

// ── Doble click para editar inline ──
lista.addEventListener("dblclick", e => {
    const span = e.target.closest(".tarea__texto");
    if (!span) return;
    const li = span.closest(".tarea");
    activarEdicion(li, li.dataset.id);
});

function activarEdicion(li, id) {
    const span = li.querySelector(".tarea__texto");
    if (span.classList.contains("editando")) return;

    const valor = span.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = valor;
    input.className = "tarea__input";
    span.classList.add("editando");
    span.after(input);
    input.focus();
    input.select();

    const guardarCambio = () => {
        const nuevo = input.value.trim();
        if (nuevo) {
            const t = tareas.find(t => t.id === id);
            if (t) t.texto = nuevo;
            guardar();
        }
        render();
    };

    input.addEventListener("blur", guardarCambio);
    input.addEventListener("keydown", ev => {
        if (ev.key === "Enter") input.blur();
        if (ev.key === "Escape") { input.value = valor; render(); }
    });
}

// ── Drag & Drop ──
let arrastrada = null;

lista.addEventListener("dragstart", e => {
    const li = e.target.closest(".tarea");
    if (!li) return;
    arrastrada = li;
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
});

lista.addEventListener("dragend", e => {
    const li = e.target.closest(".tarea");
    if (li) li.classList.remove("dragging");
    document.querySelectorAll(".drag-over")
        .forEach(el => el.classList.remove("drag-over"));
    arrastrada = null;
});

lista.addEventListener("dragover", e => {
    e.preventDefault();
    const li = e.target.closest(".tarea");
    if (!li || li === arrastrada) return;
    document.querySelectorAll(".drag-over")
        .forEach(el => el.classList.remove("drag-over"));
    li.classList.add("drag-over");
});

lista.addEventListener("drop", e => {
    e.preventDefault();
    const destino = e.target.closest(".tarea");
    if (!destino || !arrastrada || destino === arrastrada) return;

    const idA = arrastrada.dataset.id;
    const idB = destino.dataset.id;
    const iA  = tareas.findIndex(t => t.id === idA);
    const iB  = tareas.findIndex(t => t.id === idB);

    const [movida] = tareas.splice(iA, 1);
    tareas.splice(iB, 0, movida);

    guardar();
    render();
});

render();
