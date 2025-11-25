// scripts/script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBGlAxyLzrMPyTFK-HeHRAm2G76rz6YnrA",
  authDomain: "tfg-milonario.firebaseapp.com",
  projectId: "tfg-milonario",
  storageBucket: "tfg-milonario.appspot.com",
  messagingSenderId: "527650063519",
  appId: "1:527650063519:web:88d8f4e8ae254b8b728eaa"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Mantener sesión
setPersistence(auth, browserLocalPersistence).catch(err => console.error(err));

// 🔹 Año dinámico
document.getElementById('year').textContent = new Date().getFullYear();

// 🔹 Menú responsive
const botonMenu = document.getElementById('botonMenu');
const mainNav = document.getElementById('mainNav');
botonMenu.addEventListener('click', () => {
    const expanded = botonMenu.getAttribute('aria-expanded') === 'true' || false;
    botonMenu.setAttribute('aria-expanded', !expanded);
    mainNav.classList.toggle('open');
});

// 🔹 Concursantes y categorías
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

async function obtenerCategorias() { return categorias; }
async function obtenerConcursantes(query = '') {
    if (!query) return concursantesPredefinidos;
    const q = query.toLowerCase();
    return concursantesPredefinidos.filter(c =>
        (`${c.nombre} ${c.apellido}`.toLowerCase().includes(q)) ||
        (c.ciudad && c.ciudad.toLowerCase().includes(q))
    );
}

function mostrarCategorias(listado){ return; }
function mostrarConcursantes(concursantes){
    const panel = document.getElementById('panelConcursantes');
    panel.innerHTML = '';
    concursantes.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h4>${c.nombre} ${c.apellido}</h4>
                          <p>Ciudad: ${c.ciudad}</p>
                          <p>Edad: ${c.edad}</p>
                          <p>Premios acumulados: €${(c.premios || 0).toLocaleString()}</p>`;
        panel.appendChild(card);
    });
}

// 🔹 Mostrar nombre usuario
async function mostrarUsuario(uid){
    try{
        const docRef = doc(db, "usuarios", uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            const data = docSnap.data();
            const nombreUsuario = data.nombre || data.usuario || "Jugador";

            // Cambiar hero
            const heroTitle = document.querySelector('#inicio h2');
            if(heroTitle) heroTitle.textContent = `Bienvenido, ${nombreUsuario} a "El juego del millón"`;

            // Cambiar nav login
            const navLogin = document.getElementById('navLogin');
            if(navLogin){
                navLogin.textContent = `${nombreUsuario} / Cerrar sesión`;
                navLogin.href = "#";
                navLogin.addEventListener('click', async (e)=>{
                    e.preventDefault();
                    await signOut(auth);
                    window.location.reload();
                });
            }
        }
    }catch(error){
        console.error("Error al obtener usuario:", error);
    }
}

// 🔹 Comprobar sesión
onAuthStateChanged(auth, (user) => {
    if(user) mostrarUsuario(user.uid);
});

// 🔹 Carga inicial
(async ()=>{
    const ctas = await obtenerCategorias();
    mostrarCategorias(ctas);
    const concursantes = await obtenerConcursantes();
    mostrarConcursantes(concursantes);
})();

// 🔹 Accesibilidad detalles
document.querySelectorAll('details').forEach(d=>{
    const s = d.querySelector('summary');
    d.addEventListener('toggle', ()=> s.setAttribute('aria-expanded', d.open));
});
