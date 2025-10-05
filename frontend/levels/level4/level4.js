// JavaScript for Level 4
import { requireAuth } from "../../js/authGuard.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ---------- AUTH ----------
  const user = await requireAuth(4);
  if (!user) return;

  // ---------- ELEMENTOS ----------
  const audio = document.getElementById("song");
  const lyricsStage = document.getElementById("lyricsStage");
  const inputSection = document.getElementById("inputSection");
  const errorMsg = document.getElementById("errorMsg");
  const startOverlay = document.getElementById("startOverlay");
  const submitBtn = document.getElementById("submit-code");
  const albumFrame = document.querySelector(".album-frame");
  const frameFooter = document.querySelector(".frame-footer");

  // ---------- TIMINGS (ms) ----------
  const SHOW_FRAME_AT_MS = 10000; // 10s — mostrar moldura
  const SHOW_INPUT_AT_MS = 20000; // 20s — mostrar input
  const SHOW_BUTTON_AT_MS = 20000; // 10s — mostrar botão
  const RESTART_DELAY_MS = 5000; // 5s  — recomeçar música após acabar

  // ---------- ESTADO ----------
  let lrcData = [];
  let currentIndex = 0;
  let started = false;
  let seqTimers = [];

  // ---------- LRC LOADER ----------
  async function loadLRC() {
    const res = await fetch("/media/Into You.lrc");
    const text = await res.text();
    lrcData = text
      .split("\n")
      .map((line) => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\]\s*(.*)/);
        if (!match) return null;
        const min = parseInt(match[1], 10);
        const sec = parseFloat(match[2]);
        const time = min * 60 + sec;
        return { time, text: match[3].trim() };
      })
      .filter(Boolean);
  }

  // ---------- LYRICS ----------
  function showLyricFragment(text) {
    const fragment = document.createElement("div");
    fragment.className = "lyric-fragment";
    fragment.textContent = text;
    fragment.style.whiteSpace = "nowrap";

    // tamanho e posição aleatórios
    const size = 2 + Math.random() * 2;
    fragment.style.fontSize = size + "rem";

    lyricsStage.appendChild(fragment);

    const fragmentWidth = fragment.offsetWidth;
    const margin = 40;
    const maxLeft = Math.max(
      window.innerWidth - fragmentWidth - margin,
      margin
    );
    const x = Math.floor(Math.random() * maxLeft);
    const y = 10 + Math.random() * 70;

    fragment.style.left = x + "px";
    fragment.style.top = y + "vh";

    setTimeout(() => fragment.remove(), 6000);
  }

  function updateLyric() {
    if (!lrcData.length || audio.paused) return;

    const t = audio.currentTime;

    if (currentIndex === 0 && t >= lrcData[0].time) {
      showLyricFragment(lrcData[0].text);
      currentIndex = 1;
    }

    if (currentIndex < lrcData.length && t >= lrcData[currentIndex].time) {
      showLyricFragment(lrcData[currentIndex].text);
      currentIndex++;
    }

    requestAnimationFrame(updateLyric);
  }

  // ---------- UI SEQUENCE ----------
  function scheduleSequence() {
    seqTimers.forEach(clearTimeout);
    seqTimers = [];

    // Moldura aos 10s
    if (albumFrame) {
      seqTimers.push(
        setTimeout(() => {
          albumFrame.classList.remove("hidden");
          setTimeout(() => albumFrame.classList.add("visible"), 100);
        }, SHOW_FRAME_AT_MS)
      );
    }

    // Input + botão aos 20s
    seqTimers.push(
      setTimeout(() => {
        showInput(); // fade do input

        const unlockBtn = document.querySelector(".unlock-btn");
        const errorMsg = document.querySelector(".error-msg");

        if (unlockBtn) unlockBtn.classList.add("visible");
        if (errorMsg) errorMsg.classList.add("visible");
      }, SHOW_INPUT_AT_MS)
    );
  }

  function showInput() {
    if (!inputSection) return;
    inputSection.classList.remove("hidden");
    setTimeout(() => inputSection.classList.add("visible"), 50);
  }

  // ---------- START ----------
  async function startLevel() {
    if (started) return;
    started = true;

    await loadLRC();

    try {
      await audio.play();
      if (startOverlay) startOverlay.classList.add("fade-out");
      requestAnimationFrame(updateLyric);
      scheduleSequence();
    } catch (e) {
      console.warn("Autoplay bloqueado. Clica no ecrã para começar.", e);
      started = false;
    }
  }

  // ---------- RESTART ----------
  function restartAfterEnd() {
    setTimeout(() => {
      currentIndex = 0;
      lyricsStage.innerHTML = "";
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          requestAnimationFrame(updateLyric);
          scheduleSequence();
        })
        .catch((e) => console.warn("Autoplay bloqueado no restart:", e));
    }, RESTART_DELAY_MS);
  }

  // ---------- SUBMIT ----------
  submitBtn?.addEventListener("click", async () => {
    const inputCode = document.getElementById("code").value.trim();

    try {
      const res = await fetch("http://127.0.0.1:4000/levels/4/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: inputCode }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        window.location.href = `../level${data.next}/level${data.next}.html`;
      } else {
        errorMsg.textContent =
          data.message === "Wrong code"
            ? "That doesn’t sound right..."
            : data.message || "Wrong code";
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

  // ---------- EVENTOS ----------
  if (startOverlay) {
    startOverlay.addEventListener("click", startLevel);
  } else {
    startLevel(); // fallback
  }

  audio.addEventListener("ended", () => {
    showInput();
    if (frameFooter) frameFooter.classList.add("visible");
    restartAfterEnd();
  });
});
