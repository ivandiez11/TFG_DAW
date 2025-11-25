// scripts/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// 🔹 Configuración de Firebase (igual que registro.js)
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

// 🔹 Elementos del formulario
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const validationResult = document.getElementById('validationResult');
const togglePwd = document.getElementById('togglePwd');

// 🔹 Función para mostrar mensajes
function showMessage(text, isError = true){
    validationResult.textContent = text;
    validationResult.style.color = isError ? 'red' : 'green';
}

// 🔹 Validación básica
function validateFields(){
    let ok = true;

    if(!emailInput.checkValidity()){
        showMessage('Introduce un correo válido.');
        ok = false;
    } else if(!passwordInput.value || passwordInput.value.length < 6){
        showMessage('La contraseña debe tener al menos 6 caracteres.');
        ok = false;
    } else {
        showMessage('', false);
    }

    return ok;
}

// 🔹 Submit del formulario
form.addEventListener('submit', async function(e){
    e.preventDefault();
    if(!validateFields()) return;

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            emailInput.value.trim(),
            passwordInput.value
        );

        const user = userCredential.user;
        showMessage('¡Bienvenido, ' + user.email + '!', false);
        form.reset();

        // Redirige a la página principal
        window.location.href = 'index.html';

    } catch (error) {
        let errorMsg = 'Correo o contraseña incorrectos.';
        switch(error.code){
            case 'auth/user-not-found': errorMsg = 'Usuario no encontrado.'; break;
            case 'auth/wrong-password': errorMsg = 'Contraseña incorrecta.'; break;
            case 'auth/invalid-email': errorMsg = 'Correo inválido.'; break;
        }
        showMessage(errorMsg);
    }
});

// 🔹 Mostrar / ocultar contraseña
togglePwd.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePwd.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
    togglePwd.setAttribute('aria-pressed', type === 'text');
});
