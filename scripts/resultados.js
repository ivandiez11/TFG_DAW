import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGlAxyLzrMPyTFK-HeHRAm2G76rz6YnrA",
  authDomain: "tfg-milonario.firebaseapp.com",
  projectId: "tfg-milonario",
  storageBucket: "tfg-milonario.firebasestorage.app",
  messagingSenderId: "527650063519",
  appId: "1:527650063519:web:88d8f4e8ae254b8b728eaa",
  measurementId: "G-EXHQ9RF0YM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para guardar el resultado
async function guardarResultado(usuario, puntuacion) {
  try {
    const docRef = await addDoc(collection(db, "resultados"), {
      usuario: usuario,
      puntuacion: puntuacion,
      fecha: serverTimestamp() // timestamp automático de Firebase
    });
    console.log("Resultado guardado con ID:", docRef.id);
  } catch (e) {
    console.error("Error al guardar resultado:", e);
  }
}

export { guardarResultado };