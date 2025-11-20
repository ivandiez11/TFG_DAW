// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <--- Añadido: Función para Auth
import { getFirestore } from "firebase/firestore"; // <--- Añadido: Función para Base de Datos (BBDD)
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGlAxyLzrMPyTFK-HeHRAm2G76rz6YnrA",
  authDomain: "tfg-milonario.firebaseapp.com",
  projectId: "tfg-milonario",
  storageBucket: "tfg-milonario.firebasestorage.app",
  messagingSenderId: "527650063519",
  appId: "1:527650063519:web:88d8f4e8ae254b8b728eaa",
  measurementId: "G-EXHQ9RF0YM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // <--- Instancia de BAse de Datos (BBDD)

// Exporta las instancias para usarlas en otros módulos (login.js, registro.js, juego.js)
// Usamos 'db' para guardar los datos de 'nombre', 'apellido' y 'usuario'.
export { app, analytics, auth, db };