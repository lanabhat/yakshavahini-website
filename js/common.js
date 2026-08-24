// Shared helpers used by both index.html (main.js) and project.html (project.js).

const CONTENT_BASE = "content";

const SOCIAL_ICONS = {
  youtube: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5L15.8 12Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="m21.9 4.3-3.3 15.6c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.3-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 12.4l-5-1.6c-1.1-.3-1.1-1.1.2-1.6L20.5 3c.9-.3 1.7.2 1.4 1.3Z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17 14.3c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.4ZM12 22a10 10 0 0 1-5.1-1.4L3 21.6l1-3.8A10 10 0 1 1 12 22Z"/></svg>',
};

function bi(field, tag = "span") {
  if (!field) return "";
  const kn = field.kn ?? "";
  const en = field.en ?? "";
  return `<${tag} lang="kn">${kn}</${tag}><${tag} lang="en">${en}</${tag}>`;
}

async function loadJSON(name) {
  const res = await fetch(`${CONTENT_BASE}/${name}.json`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load ${name}.json (${res.status})`);
  return res.json();
}

function setLang(lang) {
  document.body.classList.remove("lang-kn", "lang-en");
  document.body.classList.add(`lang-${lang}`);
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-toggle button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  localStorage.setItem("yv-lang", lang);
}

function initLangToggle() {
  // Language switching is temporarily disabled (Kannada-only) - ignore any saved preference.
  setLang("kn");
  document.querySelectorAll(".lang-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initReveal() {
  const els = Array.from(document.querySelectorAll("[data-rv]"));
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.animation = "yvRise 0.75s cubic-bezier(0.16,0.84,0.28,1) both";
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.06 });
  els.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.style.animation = `yvRise 0.8s cubic-bezier(0.16,0.84,0.28,1) ${Math.min(i * 0.09, 0.5)}s both`;
    } else {
      io.observe(el);
    }
  });
}

// ---------- Shared header: Projects dropdown ----------

function renderNavProjectsDropdown(projectsData) {
  const menu = document.getElementById("nav-projects-menu");
  if (!menu || !projectsData?.items) return;
  menu.innerHTML = projectsData.items
    .map((p) => `<a href="project.html?slug=${encodeURIComponent(p.slug)}">${bi(p.title)}</a>`)
    .join("");
}

function initBackToTop() {
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "↑";
  document.body.appendChild(btn);

  function update() {
    btn.classList.toggle("visible", window.scrollY > 500);
  }
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initMobileNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!header || !toggle || !nav) return;

  function close() {
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && !e.target.classList.contains("nav-dropdown-trigger")) close();
  });
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) close();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) close();
  });
}

function initNavDropdowns() {
  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-dropdown-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.toggle("open");
    });
  });
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => {
      if (!dropdown.contains(e.target)) dropdown.classList.remove("open");
    });
  });
}
