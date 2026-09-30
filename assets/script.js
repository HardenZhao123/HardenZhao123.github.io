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
  const isDark = theme === "dark";

  root.dataset.theme = isDark ? "dark" : "light";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isDark ? "Dark" : "Light";
  }
}

if (themeToggle) {
  setTheme(getSavedTheme() === "dark" ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

const sectionLinks = Array.from(document.querySelectorAll("[data-section-link]"));
const trackedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateActiveSection() {
  if (!trackedSections.length) return;

  const marker = window.scrollY + Math.min(window.innerHeight * 0.3, 240);
  let activeSection = trackedSections[0];

  trackedSections.forEach((section) => {
    if (section.offsetTop <= marker) activeSection = section;
  });

  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeSection.id}`;

    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

let sectionUpdateQueued = false;

window.addEventListener(
  "scroll",
  () => {
    if (sectionUpdateQueued) return;

    sectionUpdateQueued = true;
    window.requestAnimationFrame(() => {
      updateActiveSection();
      sectionUpdateQueued = false;
    });
  },
  { passive: true }
);

window.addEventListener("resize", updateActiveSection);
updateActiveSection();
