// scripts/registro.js
// ---------------------------------------------------
// Registro de usuario + Guardar datos en Firestore
// Usando firebaseConfig.js (Firebase 10.14.0)
// ---------------------------------------------------

import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// 🔹 Configurar fecha máxima para nacimiento (+13 años)
(function setMaxDate() {
    const input = document.getElementById("nacimiento");
    const today = new Date();
    today.setFullYear(today.getFullYear() - 13);
    input.max = today.toISOString().slice(0, 10);
})();

// 🔹 Elementos del formulario
const form = document.getElementById("registerForm");
const els = {
    nombre: document.getElementById("nombre"),
    apellido: document.getElementById("apellido"),
    email: document.getElementById("email"),
    usuario: document.getElementById("usuario"),
    password: document.getElementById("password"),
    confirm: document.getElementById("confirm"),
    nacimiento: document.getElementById("nacimiento"),
    sexo: document.getElementById("sexo"),
    terms: document.getElementById("terms"),
    serverMsg: document.getElementById("serverMsg")
};

// 🔹 Mostrar mensaje de error o éxito
function showFeedback(text, ok = false) {
    els.serverMsg.textContent = text;
    els.serverMsg.style.display = "block";
    els.serverMsg.style.color = ok ? "#047857" : "#b91c1c"; // verde / rojo
}

// 🔹 Validación del formulario
function validateFields() {
    if (!els.nombre.value.trim()) return "Introduce tu nombre.";
    if (!els.apellido.value.trim()) return "Introduce tu apellido.";
    if (!els.email.checkValidity()) return "Introduce un correo válido.";
    if (!els.usuario.checkValidity()) return els.usuario.title || "Nombre de usuario inválido.";
    if (els.password.value.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (els.confirm.value !== els.password.value) return "Las contraseñas no coinciden.";
    if (!els.terms.checked) return "Debes aceptar los términos y condiciones.";

    return null;
}

// 🔹 Submit del formulario
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    els.serverMsg.style.display = "none";

    // Validación
    const error = validateFields();
    if (error) {
        showFeedback(error);
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        // 🔹 Crear usuario en Auth
        const cred = await createUserWithEmailAndPassword(
            auth,
            els.email.value.trim(),
            els.password.value
        );

        const user = cred.user;

        // Datos a guardar
        const userData = {
            uid: user.uid,
            nombre: els.nombre.value.trim(),
            apellido: els.apellido.value.trim(),
            usuario: els.usuario.value.trim(),
            email: user.email,
            nacimiento: els.nacimiento.value || null,
            sexo: els.sexo.value || "",
            creado: serverTimestamp()
        };

        // 🔹 Guardar datos adicionales en Firestore
        await setDoc(doc(db, "usuarios", user.uid), userData);

        showFeedback("¡Registro completado con éxito!", true);

        form.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 800);

    } catch (error) {
        let message = "Ha ocurrido un error inesperado.";

        switch (error.code) {
            case "auth/email-already-in-use":
                message = "El correo electrónico ya está registrado.";
                break;
            case "auth/invalid-email":
                message = "Correo electrónico inválido.";
                break;
            case "auth/weak-password":
                message = "La contraseña es demasiado débil.";
                break;
        }

        showFeedback(message);
    } finally {
        submitButton.disabled = false;
    }
});

// 🔹 Ocultar mensaje cuando el usuario escribe
["input", "change"].forEach((evt) => {
    form.addEventListener(evt, () => (els.serverMsg.style.display = "none"), {
        passive: true,
    });
});
