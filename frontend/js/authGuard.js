// js/authGuard.js

/**
 * Ensure user is authenticated and allowed to access the current level.
 * - If not authenticated → redirect to login
 * - If user is not admin and tries to skip ahead → redirect back to their last unlocked level
 *
 * @param {number|null} currentLevel - the level number of the current page
 * @returns {Promise<object|null>} user info or null if redirected
 */
export async function requireAuth(currentLevel = null) {
  try {
    const resp = await fetch("http://127.0.0.1:4000/me", {
      credentials: "include", // send cookies (JWT stored in cookie)
    });

    // Se não estiver autenticado → redirect para login
    if (resp.status === 401 || resp.status === 403) {
      window.location.href = "/";
      return null;
    }

    if (!resp.ok) {
      throw new Error(`Auth check failed with status ${resp.status}`);
    }

    const user = await resp.json(); // { id, username, role, level }

    // Se estivermos numa página de nível, verificar progressão
    if (currentLevel && user.role !== "admin") {
      if (currentLevel > user.level) {
        alert("🚫 Nice try… you haven’t unlocked this level yet!");
        window.location.href = `../level${user.level}/level${user.level}.html`;
        return null;
      }
    }

    return user;
  } catch (err) {
    console.error("AuthGuard error:", err);
    window.location.href = "/";
    return null;
  }
}
