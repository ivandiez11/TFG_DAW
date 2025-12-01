// scripts/firebaseConfig.js
// Importaciones desde CDN (versión 10.14.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGlAxyLzrMPyTFK-HeHRAm2G76rz6YnrA",
  authDomain: "tfg-milonario.firebaseapp.com",
  projectId: "tfg-milonario",
  storageBucket: "tfg-milonario.appspot.com",
  messagingSenderId: "527650063519",
  appId: "1:527650063519:web:88d8f4e8ae254b8b728eaa"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);