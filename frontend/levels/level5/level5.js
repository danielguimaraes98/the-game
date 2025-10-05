import { requireAuth } from "../../js/authGuard.js";

document.addEventListener("DOMContentLoaded", async () => {
  // --- AUTH ---
  const user = await requireAuth(5);
  if (!user) return;

  const term = document.getElementById("terminalOutput");
  let input = "";
  let locked = false;

  // Cursor dinâmico
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "█";

  // Texto inicial
  const introText = `> Can you see what's between the lines?\n> Enter code:`;
  term.textContent = "";

  // Efeito de escrita inicial
  let i = 0;
  function typeIntro() {
    if (i < introText.length) {
      term.textContent += introText[i++];
      setTimeout(typeIntro, 35);
    } else {
      term.appendChild(cursor);
    }
  }
  typeIntro();

  // --- Eventos de input ---
  document.addEventListener("keydown", async (e) => {
    if (locked || i < introText.length) return;

    if (e.key === "Enter") {
      locked = true;
      cursor.style.display = "none";

      // Mostra “Validating...” por baixo
      const base = `> Can you see what's between the lines?\n> Enter code: ${input}`;
      term.textContent = `${base}\n> Validating...`;
      term.appendChild(cursor);

      // Espera intencional (para que “Validating...” seja visível)
      await wait(1200);

      try {
        const res = await fetch("/levels/5/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code: input.trim() })
        });

        const data = await res.json();

        if (data.success) {
          showTemporaryMessage("> Access granted. Proceeding...");
          setTimeout(() => {
            window.location.href = `/levels/${data.nextLevel || 6}`;
          }, 1000);
        } else {
          showTemporaryMessage("> Invalid code.");
        }
      } catch {
        showTemporaryMessage("> Connection error.");
      }

    } else if (e.key === "Backspace") {
      input = input.slice(0, -1);
      updateInput();
    } 
    // Permite qualquer caracter normal (inclui espaço e símbolos)
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      input += e.key;
      updateInput();
    }
  });

  // --- Utilitários ---
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function updateInput() {
    const base = `> Can you see what's between the lines?\n> Enter code: ${input}`;
    term.textContent = base;
    term.appendChild(cursor);
  }

  function resetTerminal() {
    input = "";
    locked = false;
    term.textContent = `> Can you see what's between the lines?\n> Enter code:`;
    term.appendChild(cursor);
  }

  function showTemporaryMessage(message) {
    const base = `> Can you see what's between the lines?\n> Enter code: ${input}\n${message}`;
    term.textContent = base;
    term.appendChild(cursor);

    // Mantém a mensagem por 2.5 s e depois limpa
    setTimeout(() => {
      resetTerminal();
    }, 2500);
  }
});
