import { currentUser } from "./authState.js";

console.log("Usuario en otro archivo:", currentUser);

// scripts/index.js
import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Referencia al botón de cerrar sesión
const logoutBtn = document.getElementById("logoutBtn");

// 🔹 Detectar cambios en la sesión
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✔ Usuario activo:", user.email);

        // El usuario está logueado → mostrar botón
        if (logoutBtn) logoutBtn.style.display = "flex";

    } else {
        console.warn("❌ No hay sesión activa. Redirigiendo a login...");
        window.location.href = "login.html";
    }
});

// 🔹 Manejar el cierre de sesión
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            //alert("Has cerrado sesión correctamente.");
            window.location.href = "login.html";
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("Error al cerrar sesión.");
        }
    });
}
