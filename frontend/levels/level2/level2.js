// JavaScript for Level 2
import { requireAuth } from "../../js/authGuard.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = await requireAuth(2);
  if (!user) return;

  const overlay = document.getElementById("intro-overlay");
  const startBtn = document.getElementById("startBtn");
  const videoContainer = document.getElementById("video-container");
  const video = document.getElementById("memory-video");
  const darkOverlay = document.getElementById("dark-overlay");
  const codeDiv = document.getElementById("code-input");
  const errorMsg = document.getElementById("error-msg");
  const replayBtn = document.getElementById("replay-btn");

  
  // ▶️ Clique no botão "Remember"
  startBtn.addEventListener("click", () => {
    overlay.style.opacity = 0;
    setTimeout(() => overlay.remove(), 2000);

    videoContainer.classList.remove("hidden");
    videoContainer.classList.add("visible");
    video.play().catch(err => console.warn("Autoplay blocked:", err));
  });

  
  // Ao terminar o vídeo → escurece, mostra input + replay
  video.addEventListener("ended", () => {
    darkOverlay.classList.remove("hidden");
    setTimeout(() => darkOverlay.classList.add("visible"), 50);

    setTimeout(() => {
      codeDiv.classList.remove("hidden");
      codeDiv.style.opacity = 0;
      codeDiv.style.transition = "opacity 2s ease";
      setTimeout(() => codeDiv.style.opacity = 1, 50);
      document.getElementById("code").focus();

      // Mostrar botão replay
      replayBtn.classList.remove("hidden");
    }, 2000);
  });

  // Replay do vídeo
  replayBtn.addEventListener("click", () => {
    codeDiv.classList.add("hidden"); // esconde input
    replayBtn.classList.add("hidden"); // esconde replay
    darkOverlay.classList.add("hidden");

    video.currentTime = 0;
    video.play();
  });


  // 🔑 Submeter código
  document.getElementById("submit-code").addEventListener("click", async () => {
    const inputCode = document.getElementById("code").value.trim();

    try {
      const res = await fetch("http://127.0.0.1:4000/levels/2/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: inputCode }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        window.location.href = `../level${data.next}/level${data.next}.html`;
      } else {
        errorMsg.textContent = data.message=="Wrong code" ? "That doesn’t sound right..." : data.message;
        errorMsg.classList.remove("hidden");
        errorMsg.classList.add("shake");
        setTimeout(() => errorMsg.classList.remove("shake"), 500);
      }
    } catch (err) {
      console.error(err);
      errorMsg.textContent = "⚠️ Error connecting to server.";
      errorMsg.classList.remove("hidden");
    }
  });
});
