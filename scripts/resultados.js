import { db } from "./firebaseConfig.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";


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