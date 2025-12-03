// scripts/login.js
import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

(function() {

    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const pwd = document.getElementById('password');
    const toggle = document.getElementById('togglePwd');
    const result = document.getElementById('validationResult');
    const serverMsg = document.getElementById('serverMsg');

    const pwdRule = /(?=.*[A-Z])(?=.*\d)/;

    function showMessage(message, ok) {
        result.textContent = message || '';
        result.style.color = ok ? '#047857' : '#b91c1c';
    }

    function showServerMessage(text, ok = false) {
        if (!serverMsg) return;
        serverMsg.textContent = text;
        serverMsg.style.color = ok ? '#047857' : '#b91c1c';
        serverMsg.style.display = 'block';
    }

    function validatePwd() {
        const value = pwd.value || '';

        if (value.length === 0) {
            pwd.setCustomValidity('');
            showMessage('');
            return;
        }

        if (!pwdRule.test(value)) {
            pwd.setCustomValidity('Must contain an uppercase letter and a number.');
            showMessage('Must contain an uppercase letter and a number.', false);
        } else {
            pwd.setCustomValidity('');
            showMessage('Valid password.', true);
        }
    }

    pwd.addEventListener('input', validatePwd);

    toggle.addEventListener('click', function() {
        const isHidden = pwd.type === 'password';
        pwd.type = isHidden ? 'text' : 'password';
        toggle.textContent = isHidden ? 'Ocultar' : 'Mostrar';
        toggle.setAttribute('aria-pressed', String(isHidden));
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        validatePwd();

        if (!form.checkValidity()) {
            showServerMessage("Invalid form.");
            return;
        }

        const emailVal = email.value.trim();
        const passwordVal = pwd.value;

        try {
            const credential = await signInWithEmailAndPassword(auth, emailVal, passwordVal);

            // ⬅️ MOSTRAR USUARIO COMPLETO EN CONSOLA
            console.log("Usuario logueado:", credential.user);
            console.log("UID:", credential.user.uid);
            console.log("Email:", credential.user.email);

            showServerMessage("¡Inicio correcto!", true);

            // ⬅️ REDIRECCIÓN A INDEX
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 300);

        } catch (error) {
            let msg = "Some of the data is incorrect.";

            switch (error.code) {
                case "auth/invalid-email":
                    msg = "Invalid email.";
                    break;
                case "auth/user-not-found":
                    msg = "User not found.";
                    break;
                case "auth/wrong-password":
                    msg = "Incorrect password.";
                    break;
            }

            showServerMessage(msg);
        }
    });

})();
