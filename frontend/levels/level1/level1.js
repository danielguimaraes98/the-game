const chat = document.getElementById("chat");

const messages = [
  { text: "Olá! Os presets que tens são para o lightroom no telemóvel ou no pc? 😅", side: "right" },
  { text: "Olá", side: "left" },
  { text: "São no telemóvel", side: "left" },
  { text: "Eu só uso no telemóvel no computador não sei ahaha", side: "left" },
  { text: "Mas um preset tanto da para usar no pc ou telemóvel é exatamente igual!", side: "left" },
  { text: "Sim, eu costumo editar no pc xb Tenho a aplicação no telemóvel mas não tenho lá grandes presets 😅", side: "right" },
  { text: "Sabes que presets tanto faz no computador ou telemóvel, eu acho que quem percebe de edição no computador fica melhor mas para mim telemóvel é mais pratico", side: "left" },
  { text: "Eu posso te dar alguns presets se quiseres", side: "left" },
  { text: "Não quero estar a dar trabalho, mas de qualquer das maneiras obrigado mesmo!!", side: "right" },
  { text: "Eu posso dar te é mesmo chill xd", side: "left" },
  { text: "Nao custa nada mas se n queres okey", side: "left" },
  { text: "Sendo assim se não der grande trabalho agradeço 😅", side: "right" },
  { text: "Ahahhaha", side: "left" },
  { text: "Sabia que estavas a ser modesto", side: "left" },
  { text: "Escusas de ter vergonha, claro que dou", side: "left" },
  { text: "Well, tenho mesmo muitos, vou te mostrar alguns e escolhes okey?", side: "left" },
  { text: "A sério, se der muito trabalho deixa estar!! Estou a falar mesmo a sério 🙊", side: "right" },
  { text: "Não dá trabalho nenhum rapaz", side: "left" },
  { text: "Apenas teras que perder um pouco do teu tempo a falar cmg a escolher presets", side: "left" },
  { text: "😂", side: "left" },
  { text: "Obrigado então, bora lá 😂", side: "right" },
];

const correctCode = "2019"; // código do ano
let i = 0;

// som da mensagem
const messageSound = new Audio("../assets/sounds/message.mp3");
function playMessageSound() {
  try {
    messageSound.currentTime = 0;
    messageSound.play();
  } catch (_) {}
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

    // 2) Substitui por mensagem real
    setTimeout(() => {
      typing.remove();

      const bubble = document.createElement("div");
      bubble.className = `bubble ${msg.side}`;
      bubble.textContent = msg.text;
      chat.appendChild(bubble);
      scrollToBottom();
      playMessageSound();

      i++;
      setTimeout(showMessage, 2500);
    }, 2000);
  } else {
    // 3) No fim, mostra o input — também no fundo
    setTimeout(() => {
      const codeDiv = document.createElement("div");
      codeDiv.id = "code-input";
      codeDiv.innerHTML = `
        <input type="text" id="code" placeholder="Enter the code..." />
        <button id="submit-code">Submit</button>
        <p id="error-msg" class="error hidden"></p>
      `;
      chat.appendChild(codeDiv);   // ✅ append (fundo), não prepend
      scrollToBottom();

      document.getElementById("submit-code").addEventListener("click", () => {
        const inputCode = document.getElementById("code").value.trim();
        if (inputCode === correctCode) {
          window.location.href = "../level2/level2.html";
        } else {
          const errorMsg = document.getElementById("error-msg");
          errorMsg.textContent = "Wrong code. Try again.";
          errorMsg.classList.remove("hidden");
        }
      });
    }, 1500);
  }
}

// arranca
setTimeout(showMessage, 600);
