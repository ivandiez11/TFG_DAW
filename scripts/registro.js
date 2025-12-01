// scripts/registro.js
// 🔹 Módulo completo con Firebase 10.14.0
import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";


// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGlAxyLzrMPyTFK-HeHRAm2G76rz6YnrA",
  authDomain: "tfg-milonario.firebaseapp.com",
  projectId: "tfg-milonario",
  storageBucket: "tfg-milonario.appspot.com",
  messagingSenderId: "527650063519",
  appId: "1:527650063519:web:88d8f4e8ae254b8b728eaa"
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Configuración fecha máxima nacimiento
(function setMaxDate(){
    const input = document.getElementById('nacimiento');
    const today = new Date();
    today.setFullYear(today.getFullYear() - 13);
    input.max = today.toISOString().slice(0,10);
})();

// 🔹 Elementos del formulario
const form = document.getElementById('registerForm');
const els = {
    nombre: document.getElementById('nombre'),
    apellido: document.getElementById('apellido'),
    email: document.getElementById('email'),
    usuario: document.getElementById('usuario'),
    password: document.getElementById('password'),
    confirm: document.getElementById('confirm'),
    nacimiento: document.getElementById('nacimiento'),
    sexo: document.getElementById('sexo'),
    terms: document.getElementById('terms'),
    serverMsg: document.getElementById('serverMsg')
};

// 🔹 Mostrar errores
function showError(id, show, text){
    const el = document.getElementById(id);
    if(show){ el.textContent = text; el.style.display = 'block'; }
    else el.style.display = 'none';
}

// 🔹 Validación del formulario
function validateFields(){
    let ok = true;
    if(!els.nombre.value.trim()){ showError('err-nombre', true, 'Introduce tu nombre.'); ok = false; } 
    else showError('err-nombre', false);

    if(!els.apellido.value.trim()){ showError('err-apellido', true, 'Introduce tu apellido.'); ok = false; } 
    else showError('err-apellido', false);

    if(!els.email.checkValidity()){ showError('err-email', true, 'Introduce un correo válido.'); ok = false; } 
    else showError('err-email', false);

    if(!els.usuario.checkValidity()){ showError('err-usuario', true, els.usuario.title); ok = false; } 
    else showError('err-usuario', false);

    if(els.password.value.length < 8){ showError('err-password', true, 'La contraseña debe tener al menos 8 caracteres.'); ok = false; } 
    else showError('err-password', false);

    if(els.confirm.value !== els.password.value){ showError('err-confirm', true, 'Las contraseñas no coinciden.'); ok = false; } 
    else showError('err-confirm', false);

    if(!els.terms.checked){ showError('err-terms', true, 'Debes aceptar los términos y condiciones.'); ok = false; } 
    else showError('err-terms', false);

    return ok;
}

// 🔹 Manejo del submit con Firebase
form.addEventListener('submit', async function(e){
    e.preventDefault();
    showError('serverMsg', false);

    if(!validateFields()) return;

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        // 🔹 Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            els.email.value.trim(),
            els.password.value
        );

        const user = userCredential.user;

        // 🔹 Guardar datos adicionales en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
            uid: user.uid,
            nombre: els.nombre.value.trim(),
            apellido: els.apellido.value.trim(),
            usuario: els.usuario.value.trim(),
            email: user.email,
            nacimiento: els.nacimiento.value || null,
            sexo: els.sexo.value || "",
            creado: new Date()
        });

        alert('¡Registro completado! Bienvenido, ' + els.nombre.value.trim() + '!');
        form.reset();
        window.location.href = 'login.html';

    } catch (error) {
        let errorMsg = 'Ha ocurrido un error inesperado.';
        switch(error.code){
            case 'auth/email-already-in-use': errorMsg = 'El correo electrónico ya está registrado.'; break;
            case 'auth/invalid-email': errorMsg = 'Correo electrónico inválido.'; break;
            case 'auth/weak-password': errorMsg = 'La contraseña es demasiado débil.'; break;
        }
        showError('serverMsg', true, errorMsg);
    } finally {
        submitButton.disabled = false;
    }
});

// 🔹 Validación en tiempo real
['input','change'].forEach(evt=>{
    form.addEventListener(evt, () => { showError('serverMsg', false); }, {passive:true});
});