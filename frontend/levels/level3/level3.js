// JavaScript for Level 3
import { requireAuth } from "../../js/authGuard.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = await requireAuth(3);
  if (!user) return;

  const wordBlock = document.getElementById("wordBlock");
  const wEl = document.getElementById("wLetter");
  const bEl = document.getElementById("bLetter");
  const wRest = document.getElementById("wRest");
  const bRest = document.getElementById("bRest");

  // Frases do nível
  const pairs = [
    { w: "WROTE", b: "BACK" },
    { w: "WAS", b: "BEAUTIFUL" },
    { w: "WE'RE", b: "BACK" },
  ];

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const nextFrame = () => new Promise((r) => requestAnimationFrame(r));

  // posiciona visualmente os restos ao lado direito das letras
  function placeRests() {
    const parent = wordBlock.getBoundingClientRect();
    const wRect = wEl.getBoundingClientRect();
    const bRect = bEl.getBoundingClientRect();

    // Medir alturas dos restos depois de terem texto
    const wH =
      wRest.offsetHeight || parseFloat(getComputedStyle(wRest).fontSize);
    const bH =
      bRest.offsetHeight || parseFloat(getComputedStyle(bRest).fontSize);

    // Alinhar aproximadamente pela base das letras
    const wTop = wRect.bottom - parent.top - wH * 0.88;
    const bTop = bRect.bottom - parent.top - bH * 0.88;

    // Colocar imediatamente à direita de cada letra
    wRest.style.left = `${wRect.right - parent.left}px`;
    wRest.style.top = `${wTop}px`;

    bRest.style.left = `${bRect.right - parent.left}px`;
    bRest.style.top = `${bTop}px`;
  }

  async function animatePair({ w, b }) {
    // 1) Reset (fechado)
    wordBlock.classList.remove("show");
    wRest.textContent = "";
    bRest.textContent = "";
    wEl.style.transform = "translateX(0px)";
    bEl.style.transform = "translateX(0px)";
    wRest.style.transform = "translateX(0px)";
    bRest.style.transform = "translateX(0px)";
    await nextFrame();

    // 2) Preencher textos dos restos
    wRest.textContent = w.slice(1); // sem a primeira letra
    bRest.textContent = b.slice(1);

    // 3) Posicionar restos ao lado das letras (invisíveis mas medíveis)
    placeRests();
    await nextFrame();

    // 4) Medir gap atual entre W e B, e quanto precisamos para caber o wRest
    const wRect = wEl.getBoundingClientRect();
    const bRect = bEl.getBoundingClientRect();
    const gapAtual = bRect.left - wRect.right; // espaço entre W e B
    const larguraWrest = wRest.offsetWidth;
    const GAP_EXTRA = 14; // folga estética no meio
    const MIN_SLIDE = 8; // mesmo que já haja espaço, dá um "toque" de movimento

    const gapNecessario = larguraWrest + GAP_EXTRA;
    const extra = Math.max(0, gapNecessario - gapAtual);
    const slide = Math.max(MIN_SLIDE, extra); // quanto vamos abrir no total

    // 5) Deslizar letras (e restos, para ficarem colados às letras)
    const half = slide / 2;
    wEl.style.transform = `translateX(${-half}px)`;
    bEl.style.transform = `translateX(${half}px)`;
    wRest.style.transform = `translateX(${-half}px)`;
    bRest.style.transform = `translateX(${half}px)`;

    await wait(520); // tempo da transição de transform

    // 6) Mostrar restos com fade-in
    wordBlock.classList.add("show");
    await wait(1200);

    // 7) Esconder restos e voltar a fechar
    wordBlock.classList.remove("show");
    await wait(260); // tempo do fade-out

    // 8) Fechar (deslizar de volta)
    wEl.style.transform = "translateX(0px)";
    bEl.style.transform = "translateX(0px)";
    wRest.style.transform = "translateX(0px)";
    bRest.style.transform = "translateX(0px)";
    await wait(520);

    // 9) Limpar textos dos restos (volta a ficar só "WB")
    wRest.textContent = "";
    bRest.textContent = "";
    await nextFrame();
  }

  // Sequência
  (async () => {
    for (const pair of pairs) {
      await animatePair(pair);
      await wait(500);
    }
    // 👉 Mostrar coordenadas + input
    const coordsBlock = document.getElementById("coords-block");
    coordsBlock.classList.remove("hidden");
  })().catch(console.error);

  // Submeter código
  const submitBtn = document.getElementById("submit-code");
  const errorMsg = document.getElementById("errorMsg");
  const codeInput = document.getElementById("code");

  submitBtn.addEventListener("click", async () => {
    const inputCode = codeInput.value.trim();

    try {
      const res = await fetch("http://127.0.0.1:4000/levels/3/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: inputCode }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        window.location.href = `../level${data.next}/level${data.next}.html`;
      } else {
        errorMsg.textContent = data.message=="Wrong code" ? "Th-th-that’s WRONG!" : data.message;
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

  // Opcional: reposicionar se a janela for redimensionada a meio
  window.addEventListener("resize", () => {
    if (wRest.textContent || bRest.textContent) {
      placeRests();
    }
  });
});
