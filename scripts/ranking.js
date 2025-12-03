// scripts/ranking.js
import { db } from "./firebaseConfig.js";
import { collection, query, orderBy, limit, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

async function cargarRanking() {
  const panel = document.getElementById("panelConcursantes");
  if (!panel) return;

  try {
    // Consulta top 10 puntuaciones
    const q = query(
      collection(db, "scores"),
      orderBy("score", "desc"),
      limit(10)
    );

    const snapshot = await getDocs(q);
    panel.innerHTML = ""; // limpiar

    let posicion = 1;
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "card contestant-card";
      card.innerHTML = `
        <strong>#${posicion} — ${data.username}</strong>
        <p>💰 $${data.score}</p>
      `;
      panel.appendChild(card);
      posicion++;
    });

    if (snapshot.empty) {
      panel.innerHTML = "<p>No hay puntuaciones todavía.</p>";
    }

  } catch (error) {
    console.error("❌ Error al cargar ranking:", error);
    panel.innerHTML = "<p>Error cargando ranking.</p>";
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarRanking);
