export function logout() {
  // Clear the cookie by setting it expired
  document.cookie = "token=; path=/; max-age=0;";

  // if there is localStorage then it will clear that as well
  localStorage.removeItem("token");

  // Redirect to sign-in page
  window.location.href = "/auth/sign-in";
}

/** Usage
 * <button
        onClick={logout}
        className="text-sm font-medium text-red-500 hover:text-red-700"
      >
        Logout
      </button>
 */
