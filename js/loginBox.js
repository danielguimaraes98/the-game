class GradientWaveLoginForm {
  constructor() {
    this.form = document.getElementById("loginForm");
    this.usernameInput = document.getElementById("username");
    this.passwordInput = document.getElementById("password");
    this.passwordToggle = document.getElementById("passwordToggle");
    this.submitButton = this.form.querySelector(".gradient-button");
    this.successMessage = document.getElementById("successMessage");
    this.card = document.querySelector(".login-card");

    this.init();
  }

  init() {
    this.bindEvents();
    this.animateParticles();
  }

  bindEvents() {
    // Form submit
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Inputs
    [this.usernameInput, this.passwordInput].forEach((input) => {
      input.addEventListener("blur", () =>
        input === this.usernameInput
          ? this.validateUsername()
          : this.validatePassword()
      );
      input.addEventListener("input", () => this.clearError(input.id));
      input.addEventListener("focus", (e) => this.addInputFocusEffect(e));
      input.addEventListener("blur", (e) => this.removeInputFocusEffect(e));
    });

    // Password toggle
    this.passwordToggle.addEventListener("click", (e) =>
      this.togglePassword(e)
    );

    // Card wave effect
    if (this.card) {
      this.card.addEventListener("mousemove", (e) => this.updateCardWave(e));
      this.card.addEventListener("mouseleave", () => this.resetCardWave());
    }

    // Main button ripple
    this.submitButton.addEventListener("click", (e) =>
      this.createRipple(e, this.submitButton)
    );
  }

  // ---------- Password Toggle ----------
  togglePassword(event) {
    this.passwordInput.type =
      this.passwordInput.type === "password" ? "text" : "password";
    this.passwordToggle.classList.toggle(
      "show-password",
      this.passwordInput.type === "text"
    );
    this.createRipple(event, this.passwordToggle);
  }

  // ---------- Card Wave ----------
  updateCardWave(e) {
    const rect = this.card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    this.card.style.transform = `perspective(1000px) rotateX(${
      (-y / rect.height) * 10
    }deg) rotateY(${(x / rect.width) * 10}deg)`;
  }

  resetCardWave() {
    this.card.style.transform = "";
  }

  // ---------- Input Effects ----------
  addInputFocusEffect(e) {
    const container = e.target.closest(".input-container");
    container.classList.add("input-focus");
  }

  removeInputFocusEffect(e) {
    const container = e.target.closest(".input-container");
    container.classList.remove("input-focus");
  }

  // ---------- Ripple ----------
  createRipple(event, element, type = "default") {
    const rect = element.getBoundingClientRect();
    const size =
      Math.max(rect.width, rect.height) * (type === "gradient" ? 2 : 1);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement("div");
    ripple.className = type === "gradient" ? "ripple gradient" : "ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = ripple.style.height = `${size}px`;

    // ⚠️ Só ajusta se for 'static'
    const currentPos = getComputedStyle(element).position;
    if (currentPos === "static") {
      element.style.position = "relative";
    }

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }

  // ---------- Validations ----------
  validateUsername() {
    const result = FormUtils.validateUsername(this.usernameInput.value.trim());
    if (!result.isValid) {
      this.showError("username", result.message);
      return false;
    }
    this.clearError("username");
    return true;
  }

  validatePassword() {
    const result = FormUtils.validatePassword(this.passwordInput.value.trim());
    if (!result.isValid) {
      this.showError("password", result.message);
      return false;
    }
    this.clearError("password");
    return true;
  }

  showError(field, message) {
    const formGroup = document.getElementById(field).closest(".form-group");
    const errorElement = document.getElementById(`${field}Error`);
    formGroup.classList.add("error");
    errorElement.textContent = message;
    errorElement.classList.add("show");

    const container = formGroup.querySelector(".input-container");
    container.classList.add("shake");
    setTimeout(() => container.classList.remove("shake"), 500);
  }

  clearError(field) {
    const formGroup = document.getElementById(field).closest(".form-group");
    const errorElement = document.getElementById(`${field}Error`);
    formGroup.classList.remove("error");
    errorElement.classList.remove("show");
    errorElement.textContent = "";
  }

  // ---------- Form Submit ----------
  async handleSubmit(e) {
  e.preventDefault();

  const validusername = this.validateUsername();
  const validPassword = this.validatePassword();
  if (!validusername || !validPassword) return;

  this.setLoading(true);

  try {
    const resp = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.usernameInput.value.trim(),
        password: this.passwordInput.value.trim()
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      // se o backend devolveu erro → mostrar no login
      this.showError(data.message || "Invalid credentials");
      return;
    }

    // guardar token no localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", this.usernameInput.value.trim());

    // animação de sucesso
    this.showSuccessWave();

    // redirecionar após animação
    setTimeout(() => {
      window.location.href = "level1.html";
    }, 2500);

  } catch (err) {
    this.showError("Connection error. Please try again.");
  } finally {
    this.setLoading(false);
  }
}


  // ---------- Loading ----------
  setLoading(loading) {
    this.submitButton.classList.toggle("loading", loading);
    this.submitButton.disabled = loading;
  }

  // ---------- Success ----------
  showSuccessWave() {
    this.form.style.display = "none";
    this.successMessage.classList.add("show");
  }

  // ---------- Particle Animation ----------
  animateParticles() {
    document.querySelectorAll(".particle").forEach((p) => {
      const x = Math.random() * 10 - 5;
      const y = Math.random() * 10 - 5;
      p.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => new GradientWaveLoginForm()
);
