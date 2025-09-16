// ==== addAudio.js ====
// Lista das músicas a capella
const musicas = ["media/login-music.mp3", "media/login-music-2.mp3","media/login-music-3.mp3"];

// Cria o audio dinamicamente (muted por enquanto)
const audio = document.createElement("audio");
audio.id = "bg-audio";
audio.loop = true;
audio.muted = true; // vai permanecer muted até startAudio ser chamado
audio.preload = "auto";
audio.style.display = "none";
document.body.appendChild(audio);

// Botão de som (pode existir no DOM)
const soundBtn = document.getElementById("sound-btn");

// Inicializa ícone do botão a partir do localStorage (se existir)
const savedMuted = localStorage.getItem("bgAudioMuted");
if (soundBtn) {
  if (savedMuted === "true") {
    soundBtn.textContent = "🔇";
  } else {
    soundBtn.textContent = "🔊";
  }

  soundBtn.addEventListener("click", () => {
    // quando clicas no botão, se ainda não houver src, escolhe uma música
    if (!audio.src) {
      const randomIndex = Math.floor(Math.random() * musicas.length);
      audio.src = musicas[randomIndex];
    }

    // alterna mute/unmute
    audio.muted = !audio.muted;
    soundBtn.textContent = audio.muted ? "🔇" : "🔊";
    localStorage.setItem("bgAudioMuted", audio.muted ? "true" : "false");

    // tenta tocar caso esteja pausado (alguns browsers exigem play dentro de evento de clique)
    audio.play().catch(() => {
      /* ignore */
    });
  });
}

// Expor função global startAudio() que o disclaimer chama
window.startAudio = function startAudio() {
  if (!audio.src) {
    const randomIndex = Math.floor(Math.random() * musicas.length);
    audio.src = musicas[randomIndex];
  }

  // Se o utilizador tinha deixado muted explicitamente, respeita
  const saved = localStorage.getItem("bgAudioMuted");
  if (saved === "true") {
    audio.muted = true;
    if (soundBtn) soundBtn.textContent = "🔇";
  } else {
    audio.muted = false;
    if (soundBtn) soundBtn.textContent = "🔊";
  }

  // tenta tocar (será permitido porque startAudio é chamada dentro de clique do user)
  audio.play().catch((err) => {
    console.log("Não foi possível iniciar áudio: ", err);
  });
};
