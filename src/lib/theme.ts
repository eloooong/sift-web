export const THEME_STORAGE_KEY = "sift-theme";

// Runs in the document head so a saved night theme is applied before content paints.
export const THEME_INITIALIZER = `(() => {
  let saved;
  try { saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch {}
  const dark = saved === "dark" || (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
})();`;
