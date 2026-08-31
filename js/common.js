// Shared helpers used by both index.html (main.js) and project.html (project.js).

const CONTENT_BASE = "content";

// Site launch date - until this passes, visitors get redirected to the interim blog.
// To change the launch date, edit this line only; the redirect turns itself off
// automatically once the date passes, no other cleanup needed.
const LAUNCH_DATE = new Date("2026-09-12T00:00:00");

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

const PRELAUNCH_SLIDES = [
  { file: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxZbelGLtX75kWglY_N7_SI6ufP4jMpw13JCRtiaUd0g1GGzImNsLlAkaebG6olIJS2Z0UxcMDqLEHQSPk3Auiv80HEa8_WydKtCkPlC4kG8Eqdm9XK8_2tvbZaFKrLwZ68iZmQ3G3qVTcZ7mTZHES827KyaepgZ2BzRFyg2EIu4qaBnFQjVNwozPFhvsE/s1600/WhatsApp%20Image%202026-08-30%20at%2010.23.41.jpeg" },
  { file: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEixh4rRAH1iDyk9x7x84hN4Tu287UymHeLDDDvirNwEzF8W902Zl0WHcVN4oF_YilRwBUH4iWyXt5UrJYGjobvr7DbIxpYQDKoKDPaEERCsHgLtcl-30-84d0crbuvj27FfJ3wkVcRpkKicAr1OuEPoty_WfUpZXKUdI8pQjJ0oB_MgODs9HdugApduZlVS/w397-h640/img12.jpg" },
  { file: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPFkCxOZY0ZdXixJ2_J1XsOjKfgB-eYZ9pJtD1QQHnELFzQXk_zSoQViFQu09XVRWuStTQGw3u_yLu1l6_D1wl32Z6eoZ4UnY6tcWbQ1quPLaIex_u_a8Ia5x7DcJ05-ewA4WHLbvnIkEx7-IEeOBcqXOWbRakqnqRTRGZcmqxs3Yj_MXl3bqMRwYVk_St/w588-h640/img17.jpg" },
  { file: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjOdXZTWYjiwZkrCGA9vZAnLgrdH1EPtanTqO2B02bSDpMt-5xouKnDRzv0fNMagyDVkhOEKqsGr_Z9COioz9Zz4kPbA6bvvLQG0wo_xNc0Oh9MFvMaWqkJQ7Pzw_w7fGE8i8aVLdzfQ-y2LqhyphenhyphenVNXlPIo-CuLkNULmIpR4fvrClBit0fBHXCC2qxen2dCO/w640-h480/img24.jpg" },
];

function initPreLaunchRedirect() {
  if (new Date() >= LAUNCH_DATE) return;

  const overlay = document.createElement("div");
  overlay.className = "prelaunch-overlay";
  overlay.innerHTML = `
    <div class="prelaunch-message">
      <div class="prelaunch-carousel-wrap">${renderCarousel(PRELAUNCH_SLIDES, "prelaunch-carousel")}</div>
      <p lang="kn" class="prelaunch-bypass">ಯಕ್ಷವಾಹಿನಿಯ ನವೀಕೃತ ಅಂತರ್ಜಾಲ ತಾಣ ಮತ್ತು ತಂತ್ರಾಂಶದ ಲೋಕಾರ್ಪಣೆ ಸೆಪ್ಟೆಂಬರ್ 12 2026 ರಂದು</p>
      <a class="btn btn-gold" href="https://yakshavahini.blogspot.com" target="_blank" rel="noopener">ಬ್ಲಾಗ್‌ಗೆ ಭೇಟಿ ನೀಡಿ</a>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
  initCarousel(PRELAUNCH_SLIDES, "prelaunch-carousel");

  // Hidden bypass: 5 clicks on the message text (within 1.5s of each other) dismisses the overlay.
  let clickCount = 0;
  let lastClickTime = 0;
  overlay.querySelector(".prelaunch-bypass").addEventListener("click", () => {
    const now = Date.now();
    clickCount = now - lastClickTime > 1500 ? 1 : clickCount + 1;
    lastClickTime = now;
    if (clickCount >= 5) {
      overlay.remove();
      document.body.style.overflow = "";
    }
  });
}

// ---------- Reusable image carousel + Lightbox (click-to-zoom viewer) ----------
// Used by the homepage hero slideshow and the pre-launch overlay gallery.

function resolveImageSrc(file, basePath) {
  return /^https?:\/\//.test(file) ? file : `${basePath}${encodeURIComponent(file)}`;
}

function renderCarousel(slides, idPrefix, { basePath = "", tall = false } = {}) {
  if (!slides.length) return "";
  const slideImg = (s) => `<div class="carousel-slide"><img src="${resolveImageSrc(s.file, basePath)}" alt=""></div>`;
  return `
    <div class="carousel${tall ? " photo-tall" : ""}" id="${idPrefix}">
      <div class="carousel-track" id="${idPrefix}-track">
        ${slides.map(slideImg).join("")}
      </div>
      ${slides.length > 1 ? `
        <button class="carousel-nav carousel-prev" id="${idPrefix}-prev" type="button" aria-label="Previous image">‹</button>
        <button class="carousel-nav carousel-next" id="${idPrefix}-next" type="button" aria-label="Next image">›</button>
      ` : ""}
      <button class="carousel-expand" id="${idPrefix}-expand" type="button" aria-label="View larger">⤢</button>
      ${slides[0].caption ? `<span class="caption" id="${idPrefix}-caption">${bi(slides[0].caption)}</span>` : ""}
    </div>
  `;
}

function initCarousel(slides, idPrefix, { intervalMs = 4000, basePath = "" } = {}) {
  const n = slides.length;
  const track = document.getElementById(`${idPrefix}-track`);
  const caption = document.getElementById(`${idPrefix}-caption`);
  const carouselEl = document.getElementById(idPrefix);
  const prevBtn = document.getElementById(`${idPrefix}-prev`);
  const nextBtn = document.getElementById(`${idPrefix}-next`);
  const expandBtn = document.getElementById(`${idPrefix}-expand`);
  if (!track || n < 1) return;

  let index = 0;
  let timer = null;
  track.style.transition = "transform 0.7s cubic-bezier(0.65,0,0.35,1)";

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    if (caption) caption.innerHTML = bi(slides[index].caption);
  }
  function goTo(i) { index = (i + n) % n; render(); }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }
  function startAutoplay() { stopAutoplay(); if (n > 1) timer = setInterval(next, intervalMs); }
  function stopAutoplay() { if (timer) clearInterval(timer); timer = null; }

  if (n > 1 && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prev(); startAutoplay(); });
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); next(); startAutoplay(); });
  }

  const openLightbox = () => {
    stopAutoplay();
    Lightbox.open(slides, index, { basePath, onIndexChange: (i) => { index = i; render(); }, onClose: startAutoplay });
  };
  carouselEl.addEventListener("click", openLightbox);
  if (expandBtn) expandBtn.addEventListener("click", (e) => { e.stopPropagation(); openLightbox(); });

  startAutoplay();
}

const Lightbox = (() => {
  let overlay = null;
  let slides = [];
  let index = 0;
  let scale = 1;
  let basePath = "";
  let onIndexChange = null;
  let onClose = null;

  function render() {
    const img = overlay.querySelector(".lightbox-img");
    img.src = resolveImageSrc(slides[index].file, basePath);
    img.style.transform = `scale(${scale})`;
    overlay.querySelector(".lightbox-caption").innerHTML = bi(slides[index].caption);
    overlay.querySelector(".lightbox-counter").textContent = `${index + 1} / ${slides.length}`;
  }

  function setScale(s) {
    scale = Math.min(3, Math.max(1, s));
    overlay.querySelector(".lightbox-img").style.transform = `scale(${scale})`;
    overlay.querySelector(".lightbox-img").classList.toggle("zoomed", scale > 1);
  }

  function go(delta) {
    index = (index + delta + slides.length) % slides.length;
    scale = 1;
    render();
    if (onIndexChange) onIndexChange(index);
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "+" || e.key === "=") setScale(scale + 0.5);
    else if (e.key === "-") setScale(scale - 0.5);
  }

  function close() {
    if (!overlay) return;
    document.removeEventListener("keydown", onKey);
    overlay.remove();
    overlay = null;
    document.body.style.overflow = "";
    if (onClose) onClose();
  }

  function open(slideList, startIndex, opts = {}) {
    slides = slideList;
    index = startIndex;
    scale = 1;
    basePath = opts.basePath || "";
    onIndexChange = opts.onIndexChange || null;
    onClose = opts.onClose || null;

    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close">✕</button>
      <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">‹</button>
      <div class="lightbox-stage">
        <img class="lightbox-img" src="" alt="">
      </div>
      <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">›</button>
      <div class="lightbox-footer">
        <span class="lightbox-caption"></span>
        <div class="lightbox-zoom">
          <button class="lightbox-zoom-out" type="button" aria-label="Zoom out">−</button>
          <button class="lightbox-zoom-in" type="button" aria-label="Zoom in">+</button>
        </div>
        <span class="lightbox-counter"></span>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    overlay.querySelector(".lightbox-close").addEventListener("click", close);
    overlay.querySelector(".lightbox-prev").addEventListener("click", () => go(-1));
    overlay.querySelector(".lightbox-next").addEventListener("click", () => go(1));
    overlay.querySelector(".lightbox-zoom-in").addEventListener("click", () => setScale(scale + 0.5));
    overlay.querySelector(".lightbox-zoom-out").addEventListener("click", () => setScale(scale - 0.5));
    overlay.querySelector(".lightbox-img").addEventListener("dblclick", () => setScale(scale === 1 ? 2 : 1));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", onKey);

    render();
  }

  return { open, close };
})();

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

  let hideTimer = null;
  function show() {
    if (window.scrollY <= 500) return;
    btn.classList.add("visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove("visible"), 2000);
  }
  window.addEventListener("scroll", show, { passive: true });
  btn.addEventListener("mouseenter", () => clearTimeout(hideTimer));
  btn.addEventListener("mouseleave", show);
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
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
