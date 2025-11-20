// scripts/registro.js

// 1. IMPORTACIONES DE FIREBASE
// Asegúrate de que las rutas y las versiones coincidan con las de tu 'firebaseConfig.js'
import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebase/9.6.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebase/9.6.1/firebase-firestore.js';
// Si vas a guardar los datos personales (nombre, apellido, usuario)
// en Firestore:
// import { getFirestore, collection, doc, setDoc } from 'https://www.gstatic.com/firebase/9.6.1/firebase-firestore.js';
// const db = getFirestore(app); // Necesitarías exportar 'app' de firebaseConfig.js


// 2. CONFIGURACIÓN EXISTENTE
// Ajusta el máximo de fecha (hoy - 13 años para ejemplo)
(function setMaxDate(){
    const input = document.getElementById('nacimiento');
    const today = new Date();
    today.setFullYear(today.getFullYear() - 13);
    input.max = today.toISOString().slice(0,10);
})();

const form = document.getElementById('registerForm');
const els = {
    nombre: document.getElementById('nombre'),
    apellido: document.getElementById('apellido'),
    email: document.getElementById('email'),
    usuario: document.getElementById('usuario'),
    password: document.getElementById('password'),
    confirm: document.getElementById('confirm'),
    terms: document.getElementById('terms'),
    serverMsg: document.getElementById('serverMsg')
};

function showError(id, show, text){
    const el = document.getElementById(id);
    if(show){ el.textContent = text; el.style.display = 'block'; }
    else el.style.display = 'none';
}

function validateFields(){
    let ok = true;
    // ... (Tu lógica de validación existente)
    // nombre/apellido
    if(!els.nombre.value.trim()){ showError('err-nombre', true, 'Introduce tu nombre.'); ok = false; } else showError('err-nombre', false);
    if(!els.apellido.value.trim()){ showError('err-apellido', true, 'Introduce tu apellido.'); ok = false; } else showError('err-apellido', false);
    // email
    if(!els.email.checkValidity()){ showError('err-email', true, 'Introduce un correo válido.'); ok = false; } else showError('err-email', false);
    // usuario pattern
    if(!els.usuario.checkValidity()){ showError('err-usuario', true, els.usuario.title || 'Usuario no válido.'); ok = false; } else showError('err-usuario', false);
    // password
    if(els.password.value.length < 8){ showError('err-password', true, 'La contraseña debe tener al menos 8 caracteres.'); ok = false; } else showError('err-password', false);
    // confirm
    if(els.confirm.value !== els.password.value){ showError('err-confirm', true, 'Las contraseñas no coinciden.'); ok = false; } else showError('err-confirm', false);
    // terms
    if(!els.terms.checked){ showError('err-terms', true, 'Debes aceptar los términos y condiciones.'); ok = false; } else showError('err-terms', false);

    return ok;
}


// 3. HANDLER DEL FORMULARIO CON FIREBASE
form.addEventListener('submit', async function(e){ // Agregamos 'async' aquí
    e.preventDefault();
    // Oculta el mensaje general
    showError('serverMsg', false); 

    if(!validateFields()) return;

    // Deshabilitar botón para evitar doble click
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        // --- Paso 1: Autenticar el usuario con Firebase ---
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            els.email.value.trim(), 
            els.password.value
        );
        const user = userCredential.user;
        
        // --- Paso 2 (Opcional): Guardar datos adicionales en Firestore ---
        // (Si no usas Firestore, puedes eliminar esta sección)
        /*
        await setDoc(doc(db, "usuarios", user.uid), {
            nombre: els.nombre.value.trim(),
            apellido: els.apellido.value.trim(),
            usuario: els.usuario.value.trim(),
            email: user.email, // Guarda el email también por si acaso
            createdAt: new Date()
        });
        */
        
        // --- Paso 3: Éxito y Redirección ---
        console.log("Registro exitoso. UID:", user.uid);
        alert('¡Registro completado! Bienvenido, ' + els.nombre.value.trim() + '!');
        
        form.reset();
        window.location.href = 'login.html'; // Redirige al login para que inicie sesión
        
    } catch (error) {
        console.error("Error al registrar en Firebase:", error.code, error.message);
        
        let errorMsg = 'Ha ocurrido un error inesperado.';
        
        // Manejo de errores específicos de Firebase Auth
        if (error.code === 'auth/email-already-in-use') {
            errorMsg = 'El correo electrónico ya está registrado.';
        } else if (error.code === 'auth/invalid-email') {
            errorMsg = 'El formato del correo electrónico es incorrecto.';
        } else if (error.code === 'auth/weak-password') {
            // Este error puede aparecer si la validación del lado del cliente falla por algún motivo
            errorMsg = 'La contraseña es demasiado débil (mínimo 6 caracteres).'; 
        }

        // Muestra el error al usuario
        showError('serverMsg', true, errorMsg);
        
    } finally {
        // Habilitar el botón nuevamente
        submitButton.disabled = false;
    }
});


// 4. VALIDACIÓN EN TIEMPO REAL EXISTENTE
['input','change'].forEach(evt=>{
    form.addEventListener(evt, () => {
        // oculta mensaje general al editar
        showError('serverMsg', false);
    }, {passive:true});
});