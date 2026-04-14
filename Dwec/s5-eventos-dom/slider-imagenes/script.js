// ─────────────────────────────────────────────
// MINI-PROYECTO — Slider / Carrusel de imágenes
// ─────────────────────────────────────────────
// Crea un carrusel con 5 imágenes obtenidas de
// https://picsum.photos/800/400?random=1 ... 5
//
// Funcionalidad requerida:
//   - Botones "anterior" y "siguiente" que cambian la imagen
//     activa (con comportamiento circular).
//   - Indicadores (dots) bajo el carrusel, uno por imagen,
//     clicables para saltar a esa posición.
//   - Autoplay: cambia de imagen automáticamente cada 3 segundos.
//   - El autoplay se pausa cuando el cursor está sobre el
//     carrusel (mouseenter / mouseleave) y se reanuda al salir.
//   - Transición suave entre imágenes con CSS (transform +
//     transition en el track).
//
// Técnicas: addEventListener, querySelector, setInterval /
// clearInterval, translateX dinámico, generación de elementos
// desde JS.
// ─────────────────────────────────────────────

const track = document.querySelector('#track');
const slider = document.querySelector('#slider');
const dotsContainer = document.querySelector('#dots');
const btnPrev = document.querySelector('#prev');
const btnNext = document.querySelector('#next');

const slides = track.querySelectorAll('img');
const total = slides.length;
let actual = 0;
let intervalo = null;
const INTERVALO_MS = 3000;

// Generar dots
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
    dot.dataset.indice = i;
    if (i === 0) dot.classList.add('activo');
    dotsContainer.appendChild(dot);
});

function actualizar() {
    track.style.transform = `translateX(-${actual * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('activo', i === actual);
    });
}

function siguiente() {
    actual = (actual + 1) % total;
    actualizar();
}

function anterior() {
    actual = (actual - 1 + total) % total;
    actualizar();
}

function irA(indice) {
    actual = indice;
    actualizar();
}

function iniciarAutoplay() {
    detenerAutoplay();
    intervalo = setInterval(siguiente, INTERVALO_MS);
}

function detenerAutoplay() {
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }
}

btnNext.addEventListener('click', () => { siguiente(); iniciarAutoplay(); });
btnPrev.addEventListener('click', () => { anterior(); iniciarAutoplay(); });

// Delegación para los dots
dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.dot');
    if (!dot) return;
    irA(Number(dot.dataset.indice));
    iniciarAutoplay();
});

slider.addEventListener('mouseenter', detenerAutoplay);
slider.addEventListener('mouseleave', iniciarAutoplay);

iniciarAutoplay();
