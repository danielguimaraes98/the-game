// ==============================
// Admin Dashboard Logic
// ==============================

// Import the AuthGuard to validate that the user is logged in and is an admin
import { requireAuth } from "../js/authGuard.js";

// Base URL of the backend API
const API = "http://127.0.0.1:4000";

// ------------------------------
// Load & Display Users Section
// ------------------------------
async function loadUsers() {
  const wrap = document.getElementById("sectionContent");

  // Render section header and "add user" toolbar
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

  // Register "create user" button
  document
    .getElementById("btnCreateUser")
    .addEventListener("click", createUser);

  // ✅ Add toggle password handler here
  document.getElementById("togglePassword").addEventListener("click", () => {
    const input = document.getElementById("newPassword");
    input.type = input.type === "password" ? "text" : "password";
  });

  await refreshUsersTable();
}

// Fetch and render the users table
async function refreshUsersTable() {
  const container = document.getElementById("usersTable");
  try {
    const resp = await fetch(`${API}/admin/users`, { credentials: "include" });
    if (!resp.ok) throw new Error("Failed to fetch users");
    const users = await resp.json();

    // Render table rows dynamically
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
                  onclick="openUserModal(${u.id}, '${u.username}', '${
                u.role || "user"
              }', ${u.level ?? 1})">
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

// Open modal with user data
window.openUserModal = function (id, username, role, level) {
  currentUserId = id;
  document.getElementById("modalUsername").textContent = `User: ${username}`;
  document.getElementById("modalRole").value = role || "user";
  document.getElementById("modalLevel").value = level || 1;
  document.getElementById("userModal").classList.remove("hidden");
};

// Close modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("userModal").classList.add("hidden");
});

// Save changes (role / level)
document
  .getElementById("btnSaveChanges")
  .addEventListener("click", async () => {
    const newLevel = parseInt(document.getElementById("modalLevel").value, 10);
    const newRole = document.getElementById("modalRole").value;

    const resp = await fetch(`${API}/admin/users/${currentUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ level: newLevel, role: newRole }),
    });

    if (resp.ok) {
      alert("Changes saved");
      document.getElementById("userModal").classList.add("hidden");
      await refreshUsersTable();
    } else {
      alert("Failed to save changes");
    }
  });

// Reset user level
document.getElementById("btnReset").addEventListener("click", async () => {
  if (!confirm("Reset this user’s level?")) return;
  await fetch(`${API}/admin/users/${currentUserId}/reset`, {
    method: "PATCH",
    credentials: "include",
  });
  document.getElementById("userModal").classList.add("hidden");
  await refreshUsersTable();
});

// Delete user
document.getElementById("btnDelete").addEventListener("click", async () => {
  if (!confirm("Delete this user?")) return;
  await fetch(`${API}/admin/users/${currentUserId}`, {
    method: "DELETE",
    credentials: "include",
  });
  document.getElementById("userModal").classList.add("hidden");
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

  // Clear inputs and refresh table
  document.getElementById("newUsername").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("newRole").value = "user";
  await refreshUsersTable();
}

// ------------------------------
// Sidebar, Navigation & Logout
// ------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  // ✅ Protect the dashboard: check if user is logged in and is admin
  const user = await requireAuth();
  if (!user || user.role !== "admin") {
    window.location.href = "/"; // redirect to login if not authorized
    return;
  }

  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const navButtons = document.querySelectorAll(".sidebar nav button");
  const cards = document.querySelectorAll(".card");

  // Toggle sidebar collapse
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Navigation via sidebar buttons
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.dataset.section === "users") {
        loadUsers();
      } else {
        document.getElementById("sectionContent").innerHTML = "";
      }
    });
  });

  // Navigation via cards
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (card.dataset.section === "users") {
        loadUsers();
      } else {
        document.getElementById("sectionContent").innerHTML = "";
      }
    });
  });

  // Logout button
  document.getElementById("logout").addEventListener("click", () => {
    fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      window.location.href = "../index.html";
    });
  });
});
