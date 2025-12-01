// scripts/authState.js
import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

export let currentUser = null;

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        console.log("✔️ Usuario activo:", user);
        console.log("UID:", user.uid);
        console.log("Email:", user.email);
    } else {
        console.log("❌ No hay usuario activo");
    }
});
