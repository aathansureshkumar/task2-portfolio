// Theme toggle, mobile menu, scroll reveal and active link highlight.
const root = document.documentElement;
const themeBtn = document.getElementById("theme-btn");
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage may be blocked */ }
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const dark = theme === "dark";
  themeBtn.textContent = dark ? "☀" : "☾";
  themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}

const saved = safeGet("theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(saved || (prefersDark ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  safeSet("theme", next);
});

menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
menu.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// Reveal sections as they scroll into view
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Highlight the nav link of the section currently on screen
const links = [...menu.querySelectorAll("a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
window.addEventListener("scroll", () => {
  const y = window.scrollY + 120;
  let current = -1;
  sections.forEach((s, i) => { if (s && s.offsetTop <= y) current = i; });
  links.forEach((a, i) => a.classList.toggle("active", i === current));
}, { passive: true });
