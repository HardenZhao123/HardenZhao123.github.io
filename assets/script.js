const year = document.querySelector("#year");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeToggleLabel = document.querySelector(".theme-toggle-label");
const root = document.documentElement;
const themeStorageKey = "zihao-theme";

if (year) {
  year.textContent = new Date().getFullYear();
}

function getSavedTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {}
}

function setTheme(theme) {
  const isLight = theme === "light";

  root.dataset.theme = isLight ? "light" : "dark";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
  }

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isLight ? "Light" : "Dark";
  }
}

setTheme(getSavedTheme() === "light" ? "light" : "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    saveTheme(nextTheme);
  });
}
