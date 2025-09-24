// ==============================
// Admin Dashboard Logic
// ==============================

import { requireAuth } from "../js/authGuard.js";

const API = "http://127.0.0.1:4000";

// ------------------------------
// Helpers for feedback messages
// ------------------------------
function showModalFeedback(message, type = "success") {
  const el = document.getElementById("modalFeedback");
  el.textContent = message;
  el.className = `feedback ${type}`;
  el.classList.remove("hidden");
  setTimeout(() => {
    el.classList.add("hidden");
    el.textContent = "";
  }, 3000); // auto-hide after 3s
}

function showLevelFeedback(message, type = "success") {
  const el = document.getElementById("levelFeedback");
  el.textContent = message;
  el.className = `feedback ${type}`;
  el.classList.remove("hidden");
  setTimeout(() => {
    el.classList.add("hidden");
    el.textContent = "";
  }, 3000); // auto-hide after 3s
}

// ------------------------------
// Load & Display Users Section
// ------------------------------
async function loadUsers() {
  const wrap = document.getElementById("sectionContent");

  wrap.innerHTML = `
    <h2>Users</h2>
    <div class="toolbar">
      <input id="newUsername" placeholder="username" />
      <div class="password-wrapper">
        <input id="newPassword" placeholder="password" type="password" />
        <button type="button" id="togglePassword" class="toggle-password">👁️</button>
      </div>
      <select id="newRole">
        <option value="user" selected>User</option>
        <option value="admin">Admin</option>
      </select>
      <button class="primary" id="btnCreateUser">Add User</button>
    </div>
    <div id="usersTable">Loading...</div>
  `;

  document.getElementById("btnCreateUser").addEventListener("click", createUser);

  // Toggle password visibility
  document.getElementById("togglePassword").addEventListener("click", () => {
    const input = document.getElementById("newPassword");
    input.type = input.type === "password" ? "text" : "password";
  });

  await refreshUsersTable();
}

async function refreshUsersTable() {
  const container = document.getElementById("usersTable");
  try {
    const resp = await fetch(`${API}/admin/users`, { credentials: "include" });
    if (!resp.ok) throw new Error("Failed to fetch users");
    const users = await resp.json();

    container.innerHTML = `
      <table class="users-table">
        <thead>
          <tr><th>ID</th><th>Username</th><th>Role</th><th>Level</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${users
            .map(
              (u) => `
            <tr>
              <td>${u.id}</td>
              <td>${u.username}</td>
              <td>${u.role || "user"}</td>
              <td>${u.level ?? 1}</td>
              <td>
                <button class="action-btn" 
                  onclick="openUserModal(${u.id}, '${u.username}', '${u.role || "user"}', ${u.level ?? 1})">
                  Manage
                </button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  } catch (e) {
    container.innerHTML = `<p style="color:#f66">${e.message}</p>`;
  }
}

// ------------------------------
// User Modal (edit/reset/delete)
// ------------------------------
let currentUserId = null;

window.openUserModal = function (id, username, role, level) {
  currentUserId = id;
  document.getElementById("modalUsername").textContent = `User: ${username}`;
  document.getElementById("modalRole").value = role || "user";
  document.getElementById("modalLevel").value = level || 1;
  document.getElementById("modalFeedback").classList.add("hidden"); // clear old feedback
  document.getElementById("userModal").classList.remove("hidden");
};

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("userModal").classList.add("hidden");
  document.getElementById("modalFeedback").classList.add("hidden"); // clear feedback
  document.getElementById("modalFeedback").textContent = ""; // clear text
});

// ✅ close modal when clicking outside the box
document.getElementById("userModal").addEventListener("click", (e) => {
  if (e.target.id === "userModal") {
    e.currentTarget.classList.add("hidden");
  }
});

document.getElementById("btnSaveChanges").addEventListener("click", async () => {
  const newLevel = parseInt(document.getElementById("modalLevel").value, 10);
  const newRole = document.getElementById("modalRole").value;

  const resp = await fetch(`${API}/admin/users/${currentUserId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ level: newLevel, role: newRole }),
  });

  if (resp.ok) {
    showModalFeedback("Changes saved ✅", "success");
    await refreshUsersTable();
  } else {
    showModalFeedback("Failed to save changes ❌", "error");
  }
});

document.getElementById("btnReset").addEventListener("click", async () => {
  if (!confirm("Reset this user’s level?")) return;
  await fetch(`${API}/admin/users/${currentUserId}/reset`, {
    method: "PATCH",
    credentials: "include",
  });
  showModalFeedback("User reset to level 1 ✅", "success");
  await refreshUsersTable();
});

document.getElementById("btnDelete").addEventListener("click", async () => {
  if (!confirm("Delete this user?")) return;
  await fetch(`${API}/admin/users/${currentUserId}`, {
    method: "DELETE",
    credentials: "include",
  });
  showModalFeedback("User deleted ✅", "success");
  await refreshUsersTable();
});

// ------------------------------
// Create User
// ------------------------------
async function createUser() {
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const role = document.getElementById("newRole").value;

  if (!username || !password) {
    alert("username and password required");
    return;
  }

  const resp = await fetch(`${API}/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, role }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    alert(err.message || "Failed to create user");
    return;
  }

  document.getElementById("newUsername").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("newRole").value = "user";
  await refreshUsersTable();
}

// ------------------------------
// Levels Section
// ------------------------------
async function loadLevels() {
  const wrap = document.getElementById("sectionContent");
  wrap.innerHTML = `<h2>Levels</h2><div id="levelsTable">Loading...</div>`;
  await refreshLevelsTable();
}

async function refreshLevelsTable() {
  const container = document.getElementById("levelsTable");
  try {
    const resp = await fetch(`${API}/admin/levels`, { credentials: "include" });
    if (!resp.ok) throw new Error("Failed to fetch levels");
    const levels = await resp.json();

    container.innerHTML = `
      <table class="users-table">
        <thead>
          <tr><th>Level</th><th>Code</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${levels
            .map(
              (lvl) => `
            <tr>
              <td>${lvl.level}</td>
              <td>${lvl.code}</td>
              <td>
                <button class="action-btn" onclick="openLevelModal(${lvl.level}, '${lvl.code}')">
                  Manage
                </button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  } catch (e) {
    container.innerHTML = `<p style="color:#f66">${e.message}</p>`;
  }
}

let currentLevelId = null;

window.openLevelModal = function (level, code) {
  currentLevelId = level;
  document.getElementById("modalLevelTitle").textContent = `Level ${level}`;
  document.getElementById("modalCode").value = code || "";
  document.getElementById("levelFeedback").classList.add("hidden");
  document.getElementById("levelModal").classList.remove("hidden");
};

document.getElementById("closeLevelModal").addEventListener("click", () => {
  document.getElementById("levelModal").classList.add("hidden");
  document.getElementById("levelFeedback").classList.add("hidden"); // clear feedback
  document.getElementById("levelFeedback").textContent = ""; // clear text
});

// ✅ close level modal when clicking outside
document.getElementById("levelModal").addEventListener("click", (e) => {
  if (e.target.id === "levelModal") {
    e.currentTarget.classList.add("hidden");
  }
});

document.getElementById("btnSaveLevel").addEventListener("click", async () => {
  const newCode = document.getElementById("modalCode").value.trim();
  if (!newCode) {
    showLevelFeedback("Code cannot be empty ❌", "error");
    return;
  }

  const resp = await fetch(`${API}/admin/levels/${currentLevelId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ code: newCode }),
  });

  if (resp.ok) {
    showLevelFeedback("Level updated ✅", "success");
    await refreshLevelsTable();
  } else {
    showLevelFeedback("Failed to update level ❌", "error");
  }
});

// ------------------------------
// Sidebar, Navigation & Logout
// ------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const user = await requireAuth();
  if (!user || user.role !== "admin") {
    window.location.href = "/";
    return;
  }

  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const navButtons = document.querySelectorAll(".sidebar nav button");
  const cards = document.querySelectorAll(".card");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.dataset.section === "users") loadUsers();
      else if (btn.dataset.section === "levels") loadLevels();
      else document.getElementById("sectionContent").innerHTML = "";
    });
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (card.dataset.section === "users") loadUsers();
      else if (card.dataset.section === "levels") loadLevels();
      else document.getElementById("sectionContent").innerHTML = "";
    });
  });

  document.getElementById("logout").addEventListener("click", () => {
    fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      window.location.href = "../index.html";
    });
  });
});
