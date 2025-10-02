// JavaScript for Level 1
import { requireAuth } from "../../js/authGuard.js";

const chat = document.getElementById("chat");

const messages = [
  {
    text: "Olá! Os presets que tens são para o lightroom no telemóvel ou no pc? 😅",
    side: "right",
  },
  { text: "Olá", side: "left" },
  { text: "São no telemóvel", side: "left" },
  { text: "Eu só uso no telemóvel no computador não sei ahaha", side: "left" },
  {
    text: "Mas um preset tanto da para usar no pc ou telemóvel é exatamente igual!",
    side: "left",
  },
  {
    text: "Sim, eu costumo editar no pc xb Tenho a aplicação no telemóvel mas não tenho lá grandes presets 😅",
    side: "right",
  },
  {
    text: "Sabes que presets tanto faz no computador ou telemóvel, eu acho que quem percebe de edição no computador fica melhor mas para mim telemóvel é mais pratico",
    side: "left",
  },
  { text: "Eu posso te dar alguns presets se quiseres", side: "left" },
  {
    text: "Não quero estar a dar trabalho, mas de qualquer das maneiras obrigado mesmo!!",
    side: "right",
  },
  { text: "Eu posso dar te é mesmo chill xd", side: "left" },
  { text: "Nao custa nada mas se n queres okey", side: "left" },
  { text: "Sendo assim se não der grande trabalho agradeço 😅", side: "right" },
  { text: "Ahahhaha", side: "left" },
  { text: "Sabia que estavas a ser modesto", side: "left" },
  { text: "Escusas de ter vergonha, claro que dou", side: "left" },
  {
    text: "Well, tenho mesmo muitos, vou te mostrar alguns e escolhes okey?",
    side: "left",
  },
  {
    text: "A sério, se der muito trabalho deixa estar!! Estou a falar mesmo a sério 🙊",
    side: "right",
  },
  { text: "Não dá trabalho nenhum rapaz", side: "left" },
  {
    text: "Apenas teras que perder um pouco do teu tempo a falar cmg a escolher presets",
    side: "left",
  },
  { text: "😂", side: "left" },
  { text: "Obrigado então, bora lá 😂", side: "right" },
];

let i = 0;

// som da mensagem
function playMessageSound(side) {
  let soundFile;
  if (side === "left") {
    soundFile = "/media/messageReceive.mp3"; // mensagem recebida
  } else {
    soundFile = "/media/messageSend.mp3"; // mensagem enviada
  }

  const audio = new Audio(soundFile);
  audio.volume = 0.5; // não ser muito alto
  audio.play().catch((err) => console.warn("Sound play blocked:", err));
}

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

function showMessage() {
  if (i < messages.length) {
    const msg = messages[i];

    // 1) Adiciona "digitando..." no fundo
    const typing = document.createElement("div");
    typing.className = `bubble ${msg.side}`;
    typing.innerHTML = `
      <div class="typing">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;

    chat.appendChild(typing);
    scrollToBottom();
    if (msg.side === "right") {
      playMessageSound(msg.side);
    }

    // 2) Calcula tempo de typing proporcional ao tamanho da mensagem
    const baseTyping = msg.text.length * 50; // 50ms por caracter
    const typingTime = Math.min(2000, baseTyping + Math.random() * 500);
    // nunca passa de 2s

    // tempo entre mensagens também com variação
    const delay = 800 + Math.random() * 1200; // 0.8s–2s

    setTimeout(() => {
      typing.remove();

      if (i === 0) {
        const dateDiv = document.createElement("div");
        dateDiv.className = "chat-date";

        // Data atual formatada (ex: "24 September 2025")
        dateDiv.textContent = "21/08/2019";

        chat.appendChild(dateDiv);
      }

      const bubble = document.createElement("div");
      bubble.className = `bubble ${msg.side}`;
      bubble.textContent = msg.text;
      chat.appendChild(bubble);
      scrollToBottom();
      if (msg.side === "left") {
        playMessageSound(msg.side);
      }

      i++;
      setTimeout(showMessage, delay);
    }, typingTime);
  } else {
    // 3) No fim, mostra o input — também no fundo
    setTimeout(() => {
      const codeDiv = document.createElement("div");
      codeDiv.id = "code-input";
      codeDiv.innerHTML = `
        <input type="text" id="code" placeholder="Back to the year it all started..." />
        <button id="submit-code">Unlock</button>
        <p id="error-msg" class="error hidden"></p>
      `;
      chat.appendChild(codeDiv);
      scrollToBottom();

      document
        .getElementById("submit-code")
        .addEventListener("click", async () => {
          const inputCode = document.getElementById("code").value.trim();

          try {
            const res = await fetch("http://127.0.0.1:4000/levels/1/submit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ code: inputCode }),
            });

            const data = await res.json();
            
            if (res.ok && data.ok) {
              window.location.href = `../levels/level${data.next}/level${data.next}.html`;
            } else {
              const errorMsg = document.getElementById("error-msg");
              errorMsg.textContent = data.message=="Wrong code" ? "Not the beginning I remember." : data.message;
              errorMsg.classList.remove("hidden");
            }
          } catch (err) {
            console.error(err);
            const errorMsg = document.getElementById("error-msg");
            errorMsg.textContent = "⚠️ Error connecting to server.";
            errorMsg.classList.remove("hidden");
          }
        });
    }, 1500);
  }
}

// ✅ arranque protegido por requireAuth
document.addEventListener("DOMContentLoaded", async () => {
  const user = await requireAuth(1);
  if (!user) return;

  const overlay = document.getElementById("intro-overlay");
  const chatContainer = document.getElementById("chat");
  const introBtn = document.getElementById("startBtn");

  // mostra overlay inicial
  overlay.classList.remove("hidden");
  overlay.classList.add("visible");

  introBtn.addEventListener("click", () => {
    // inicia o fade-out do overlay
    overlay.style.transition = "opacity 3s ease";
    overlay.style.opacity = 0;

    // só depois de 3s (tempo do fade) é que toca o áudio
    setTimeout(() => {
      const audio = new Audio("/media/didIDreamWholeThing.mp3");
      audio.volume = 0.6;
      try {
        audio.play();
      } catch (err) {
        console.warn("Audio blocked:", err);
      }

      audio.addEventListener("ended", () => {
        overlay.remove();
        chatContainer.classList.remove("hidden");
        chatContainer.style.opacity = 0;
        chatContainer.style.transition = "opacity 2s ease";

        setTimeout(() => {
          chatContainer.style.opacity = 1;
          setTimeout(showMessage, 1000);
        }, 50);
      });
    }, 3000); // espera o tempo do fade-out antes de tocar
  });
});
