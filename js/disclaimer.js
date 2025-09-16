// disclaimer.js
const disclaimer = document.getElementById("disclaimer");
const continueBtn = document.getElementById("continue-btn");
const appContent = document.getElementById("app-content"); // container que engloba login + frases

// garante que tudo começa desfocado
if (appContent && !appContent.classList.contains("blurred")) {
  appContent.classList.add("blurred");
}

// adiciona a classe show após o carregamento da página
window.addEventListener("DOMContentLoaded", () => {
  disclaimer.classList.add("show");
});

continueBtn.addEventListener("click", () => {
  // anima e faz fade-out do disclaimer
  disclaimer.classList.add("fade-out");

  // pequena espera para terminar a animação, depois esconde e remove blur
  setTimeout(() => {
    disclaimer.style.display = "none";
    if (appContent) appContent.classList.remove("blurred");

    // inicia o áudio aqui (startAudio foi exposto em addAudio.js)
    if (typeof window.startAudio === "function") {
      window.startAudio();
    }
  }, 450); // deve corresponder ao tempo de transition do CSS
});
