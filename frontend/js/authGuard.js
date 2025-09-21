// js/authGuard.js
export async function requireAuth() {
  try {
    const resp = await fetch("http://127.0.0.1:4000/me", {
      credentials: "include" // cookies httpOnly
    });

    if (!resp.ok) throw new Error("Not authenticated");

    const user = await resp.json();
    return user; // { id, username }
  } catch (err) {
    window.location.href = "../index.html";
  }
}
