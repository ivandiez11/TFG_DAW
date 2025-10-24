

document.getElementById('year').textContent = new Date().getFullYear();
const botonMenu = document.getElementById('botonMenu');
const mainNav = document.getElementById('mainNav');
botonMenu.addEventListener('click', () => {
    const expanded = botonMenu.getAttribute('aria-expanded') === 'true' || false;
    botonMenu.setAttribute('aria-expanded', !expanded);
    mainNav.classList.toggle('open');
});

// Datos locales para "El juego de un millón"
const categorias = [
    { nombre: 'Historia', descripcion: 'Preguntas sobre historia general' },
    { nombre: 'Ciencia', descripcion: 'Preguntas de ciencia y tecnología' },
    { nombre: 'Cultura', descripcion: 'Literatura, cine y música' },
    { nombre: 'Deportes', descripcion: 'Preguntas sobre deportes' },
];

const concursantesPredefinidos = [
    { nombre: 'María', apellido: 'López', ciudad: 'Madrid', edad: 32, premios: 1000000 },
    { nombre: 'Carlos', apellido: 'García', ciudad: 'Sevilla', edad: 28, premios: 25000 },
    { nombre: 'Ana', apellido: 'Martínez', ciudad: 'Valencia', edad: 35, premios: 8000 },
    { nombre: 'Pablo', apellido: 'Santos', ciudad: 'Bilbao', edad: 40, premios: 12000 },
];

// Funciones
async function obtenerCategorias() { return categorias; }
async function obtenerConcursantes(query = '') {
    if (!query) return concursantesPredefinidos;
    const q = query.toLowerCase();
    return concursantesPredefinidos.filter(c =>
        (`${c.nombre} ${c.apellido}`.toLowerCase().includes(q)) ||
        (c.ciudad && c.ciudad.toLowerCase().includes(q))
    );
}

function mostrarCategorias(listado) {
    // puede usarse para mostrar tarjetas de categorías si se desea
    // por ahora no se inserta en DOM principal; se mantiene para extensión
    return;
}

function mostrarConcursantes(concursantes) {
    const panel = document.getElementById('panelConcursantes');
    panel.innerHTML = '';
    concursantes.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        // Se han eliminado las imágenes; solo se muestra la información textual
        const info = document.createElement('div');
        info.innerHTML = `<h4>${c.nombre} ${c.apellido}</h4><p>Ciudad: ${c.ciudad}</p><p>Edad: ${c.edad}</p><p>Premios acumulados: €${(c.premios || 0).toLocaleString()}</p>`;
        card.appendChild(info);
        panel.appendChild(card);
    });
}

// Nota: Se eliminó la barra de búsqueda y su listener

// Carga inicial
(async () => {
    const ctas = await obtenerCategorias();
    mostrarCategorias(ctas);
    const concursantes = await obtenerConcursantes();
    mostrarConcursantes(concursantes);
})();

// Accesibilidad para mostrar las preguntas frecuentes
document.querySelectorAll('details').forEach(d=>{
        const s = d.querySelector('summary');
        d.addEventListener('toggle', ()=> s.setAttribute('aria-expanded', d.open));
    });