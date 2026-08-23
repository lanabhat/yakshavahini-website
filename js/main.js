// Yakshavahini home page - loads bilingual content from /content/*.json and renders it.
// No build step, no framework: works on any static host that serves plain files.
// Shared helpers (bi, loadJSON, lang toggle, reveal, nav dropdown) live in common.js.

// ---------- Section renderers ----------

function renderHome(data) {
  const el = document.getElementById("home-content");
  if (!el) return;
  el.innerHTML = `
    <div class="hero-grid">
      <div>
        <h1 data-rv>${bi(data.title)}</h1>
        <div class="badge badge-sub" data-rv>${bi(data.badge)}</div>
        <p class="lede" data-rv>${bi(data.subtitle)}</p>
        <p class="lede muted" data-rv>${bi(data.lede)}</p>
        <p class="hero-highlight" data-rv>${bi(data.highlight)}</p>
        <div class="hero-cta" data-rv>
          <a class="btn btn-gold" href="#projects">${bi(data.cta.primary)}</a>
          <a class="btn btn-donate" href="#donate">${bi(data.cta.donate)}</a>
        </div>
      </div>
      <div class="hero-photos" data-rv>
        ${renderHeroCarousel(data.slideshow)}
      </div>
    </div>
  `;
  initHeroCarousel(data.slideshow);
}

function renderHeroCarousel(slideshow) {
  const slides = slideshow?.slides || [];
  if (!slides.length) return "";
  const slideImg = (s) => `<div class="carousel-slide"><img src="images/slideshow/${encodeURIComponent(s.file)}" alt=""></div>`;
  return `
    <div class="carousel photo-tall" id="hero-carousel">
      <div class="carousel-track" id="hero-carousel-track">
        ${slides.map(slideImg).join("")}
      </div>
      <button class="carousel-nav carousel-prev" id="hero-carousel-prev" type="button" aria-label="Previous image">‹</button>
      <button class="carousel-nav carousel-next" id="hero-carousel-next" type="button" aria-label="Next image">›</button>
      <button class="carousel-expand" id="hero-carousel-expand" type="button" aria-label="View larger">⤢</button>
      <span class="caption" id="hero-carousel-caption">${bi(slides[0].caption)}</span>
    </div>
  `;
}

function initHeroCarousel(slideshow) {
  const slides = slideshow?.slides || [];
  const n = slides.length;
  const track = document.getElementById("hero-carousel-track");
  const caption = document.getElementById("hero-carousel-caption");
  const carouselEl = document.getElementById("hero-carousel");
  const prevBtn = document.getElementById("hero-carousel-prev");
  const nextBtn = document.getElementById("hero-carousel-next");
  const expandBtn = document.getElementById("hero-carousel-expand");
  if (!track || n < 1) return;

  const intervalMs = slideshow.intervalMs || 4000;
  let index = 0;
  let timer = null;

  track.style.transition = "transform 0.7s cubic-bezier(0.65,0,0.35,1)";

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    caption.innerHTML = bi(slides[index].caption);
  }
  function goTo(i) {
    index = (i + n) % n;
    render();
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }
  function startAutoplay() {
    stopAutoplay();
    if (n > 1) timer = setInterval(next, intervalMs);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  if (n > 1) {
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prev(); startAutoplay(); });
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); next(); startAutoplay(); });
  } else {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }

  const openLightbox = () => {
    stopAutoplay();
    Lightbox.open(slides, index, {
      onIndexChange: (i) => { index = i; render(); },
      onClose: startAutoplay,
    });
  };
  carouselEl.addEventListener("click", openLightbox);
  expandBtn.addEventListener("click", (e) => { e.stopPropagation(); openLightbox(); });

  startAutoplay();
}

// ---------- Lightbox (click-to-zoom image viewer) ----------

const Lightbox = (() => {
  let overlay = null;
  let slides = [];
  let index = 0;
  let scale = 1;
  let onIndexChange = null;
  let onClose = null;

  function render() {
    const img = overlay.querySelector(".lightbox-img");
    img.src = `images/slideshow/${encodeURIComponent(slides[index].file)}`;
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

function renderAbout(data) {
  const el = document.getElementById("about-content");
  if (!el) return;
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <div class="about-grid">
      <div class="about-copy" data-rv>
        ${data.body.map(p => p.type === "quote" ? `<blockquote class="about-quote">${bi(p)}</blockquote>` : `<p>${bi(p)}</p>`).join("")}
      </div>
      <div data-rv>
        <div class="stat-cards">
          ${data.stats.map(s => `<div class="stat-card"><div class="stat-value">${s.value}</div><div class="stat-label">${bi(s.label)}</div></div>`).join("")}
        </div>
        <div class="about-photo"><img src="images/tenku.JPG" alt="Yakshagana performance"></div>
      </div>
    </div>
  `;
}

function renderProjects(data) {
  const el = document.getElementById("projects-content");
  if (!el) return;
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <p class="muted" data-rv>${bi(data.intro)}</p>
    <div class="project-grid" data-rv>
      ${data.items.map(p => `
        <div class="project-card">
          <div class="code">${p.code}</div>
          <h3>${bi(p.title)}</h3>
          <p>${bi(p.description)}</p>
          <div class="stat">${bi(p.stat)}</div>
          <span class="coordinator">${p.coordinator}</span>
          <div class="project-card-links">
            ${p.slug ? `<a class="card-link" href="project.html?slug=${encodeURIComponent(p.slug)}">${bi({ kn: "ವಿವರ ನೋಡಿ", en: "Read more" })} →</a>` : ""}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderApps(data) {
  const el = document.getElementById("apps-content");
  if (!el) return;
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <p class="muted" data-rv>${bi(data.intro)}</p>
    <div class="app-grid" data-rv>
      ${data.items.map(a => `
        <div class="app-card">
          <div class="app-platform">${a.platform === "android" ? "▲ Android" : "🌐 Web"}</div>
          <h3>${bi(a.name)}</h3>
          <p>${bi(a.description)}</p>
          ${a.status === "live"
            ? `<a class="btn btn-gold" href="${a.url}" target="_blank" rel="noopener">${bi(a.cta)}</a>`
            : `<span class="btn btn-outline btn-disabled">${bi(a.cta)}</span>`}
        </div>
      `).join("")}
    </div>
  `;
}

function renderAchievements(data) {
  const el = document.getElementById("achievements-content");
  if (!el) return;
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <div class="achv-stats" data-rv>
      ${data.stats.map(s => `<div class="achv-stat"><div class="stat-value">${s.value}</div><div class="stat-label">${bi(s.label)}</div></div>`).join("")}
    </div>
    <div class="achv-highlight" data-rv>${bi(data.highlight)}</div>
  `;
}

function renderLeadership(data) {
  const el = document.getElementById("leadership-content");
  if (!el) return;
  const groups = data.groups.map(g => `
    <div class="leader-group" data-rv>
      <h3>${bi(g.title)}</h3>
      <div class="leader-cards">
        ${g.members.map(m => `
          <div class="leader-card">
            ${m.photo ? `<div class="leader-photo"><img src="images/portraits/${encodeURIComponent(m.photo)}" alt="${m.nameEn}" style="object-position: ${m.photoPosition || "center"}"></div>` : ""}
            <div class="name"><span lang="kn">${m.name}</span><span lang="en">${m.nameEn}</span></div>
            <div class="role">${bi(m.role)}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    ${groups}
    <div class="leader-group" data-rv>
      <h3>${bi(data.advisoryBoard.heading)}</h3>
      <p class="muted">${bi(data.advisoryBoard.note)}</p>
      <div class="advisory-names">
        ${data.advisoryBoard.names.map(n => `<span>${n}</span>`).join("")}
      </div>
    </div>
    <p class="volunteers-note">${bi(data.volunteersNote)}</p>
  `;
}

function renderNews(data) {
  const el = document.getElementById("news-content");
  if (!el) return;
  const highlightCards = data.highlights.map(h => `
    <div class="news-card">
      <div class="tag">${bi(h.tag)}</div>
      <h3>${bi(h.title)}</h3>
      <p>${bi(h.description)}</p>
    </div>
  `).join("");

  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <div id="blogger-posts"></div>
    <div class="news-grid" id="news-fallback" data-rv>${highlightCards}</div>
  `;

  const sources = data.blogger?.sources || [];
  if (sources.length) {
    loadBloggerFeeds(sources, data.blogger.maxPerSource || 4, data.blogger.maxTotal || 9);
  }
}

function fetchBloggerSource(source, maxPerSource) {
  // Blogger's JSON feed only allows cross-origin reads via JSONP (alt=json-in-script).
  return new Promise((resolve) => {
    const callbackName = `__yvBloggerCallback_${source.id}`;
    const sep = source.feedUrl.includes("?") ? "&" : "?";
    const script = document.createElement("script");

    const cleanup = () => {
      delete window[callbackName];
      script.remove();
      clearTimeout(timer);
    };
    const timer = setTimeout(() => {
      console.warn(`Blogger feed timed out: ${source.id}`);
      cleanup();
      resolve([]);
    }, 8000);

    window[callbackName] = (feed) => {
      try {
        const entries = (feed?.feed?.entry || []).map(e => normalizeBloggerEntry(e, source));
        resolve(entries);
      } catch (e) {
        console.warn(`Blogger feed parse failed: ${source.id}`, e);
        resolve([]);
      } finally {
        cleanup();
      }
    };
    script.src = `${source.feedUrl}${sep}alt=json-in-script&callback=${callbackName}&max-results=${maxPerSource}`;
    script.onerror = () => {
      console.warn(`Could not load Blogger feed: ${source.id}`);
      cleanup();
      resolve([]);
    };
    document.body.appendChild(script);
  });
}

async function loadBloggerFeeds(sources, maxPerSource, maxTotal) {
  const results = await Promise.all(sources.map(s => fetchBloggerSource(s, maxPerSource)));
  const entries = results.flat()
    .sort((a, b) => (b.publishedRaw || "").localeCompare(a.publishedRaw || ""))
    .slice(0, maxTotal);

  const container = document.getElementById("blogger-posts");
  const fallback = document.getElementById("news-fallback");
  if (!entries.length) return; // leave the static fallback highlights visible
  container.innerHTML = `<div class="news-grid">${entries.map(renderBloggerEntry).join("")}</div>`;
  if (fallback) fallback.style.display = "none";
}

function normalizeBloggerEntry(entry, source) {
  const title = entry.title?.$t || "";
  const link = (entry.link || []).find(l => l.rel === "alternate")?.href || "#";
  const summaryRaw = entry.summary?.$t || entry.content?.$t || "";
  const summary = summaryRaw.replace(/<[^>]+>/g, "").slice(0, 160);
  const publishedRaw = entry.published?.$t || "";
  const published = publishedRaw ? new Date(publishedRaw).toLocaleDateString() : "";
  return { title, link, summary, published, publishedRaw, sourceName: source.name };
}

function renderBloggerEntry(entry) {
  return `
    <div class="news-card">
      <div class="tag">${bi(entry.sourceName)} · ${entry.published}</div>
      <h3>${entry.title}</h3>
      <p>${entry.summary}…</p>
      <a class="card-link" href="${entry.link}" target="_blank" rel="noopener">Read more →</a>
    </div>
  `;
}

function renderVideos(data) {
  const el = document.getElementById("videos-content");
  if (!el) return;
  const picked = shuffle(data.items).slice(0, data.showCount || 6);
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <p class="muted" data-rv>${bi(data.intro)}</p>
    <div class="video-grid" data-rv>
      ${picked.map(v => `
        <div class="video-card" data-video-id="${v.id}">
          <div class="video-thumb">
            <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
            <span class="play-btn" aria-hidden="true">▶</span>
          </div>
          <div class="video-subject">${bi(v.subject)}</div>
          <h3>${v.title}</h3>
        </div>
      `).join("")}
    </div>
    <a class="card-link" href="${data.channelUrl}" target="_blank" rel="noopener">${bi(data.channelLabel)} →</a>
  `;
  el.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.videoId;
      card.innerHTML = `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${id}?autoplay=1" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }, { once: true });
  });
}

function renderVolunteer(data) {
  const el = document.getElementById("volunteer-content");
  if (!el) return;
  el.innerHTML = `
    <div class="eyebrow">${bi(data.eyebrow)}</div>
    <div class="volunteer-grid">
      <div data-rv>
        <h2>${bi(data.heading)}</h2>
        <p class="muted">${bi(data.intro)}</p>
        <a class="btn btn-outline" href="#contact">${bi(data.cta)} →</a>
        <ul class="coordinator-list">
          ${data.coordinators.map(c => `<li>${c.name} (${c.nameEn}) - ${c.phone}</li>`).join("")}
        </ul>
      </div>
      <div class="ways-grid" data-rv>
        ${data.ways.map(w => `<div class="way-card"><div class="code">${w.code}</div>${bi(w.label)}</div>`).join("")}
      </div>
    </div>
    ${renderNameGroup(data.volunteerNames)}
    ${renderNameGroup(data.organizationNames)}
    ${renderNameGroup(data.contributorNames)}
  `;
}

function renderNameGroup(group) {
  if (!group) return "";
  return `
    <div class="name-group" data-rv>
      <h3>${bi(group.heading)}</h3>
      <p class="muted">${bi(group.note)}</p>
      <div class="name-tags">
        ${group.names.map(n => `<span>${n}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderDonate(data) {
  const el = document.getElementById("donate-content");
  if (!el) return;
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <div class="donate-grid">
      <div data-rv>
        <h2>${bi(data.heading)}</h2>
        <p>${bi(data.body)}</p>
        <p class="footnote">${bi(data.footnote)}</p>
      </div>
      <div class="donate-card" data-rv>
        <dl>
          <dt>${bi(data.bank.bankLabel)}</dt><dd>${data.bank.bankName}</dd>
          <dt>${bi(data.bank.accountNameLabel)}</dt><dd>${data.bank.accountName}</dd>
          <dt>${bi(data.bank.accountNumberLabel)}</dt><dd>${data.bank.accountNumber}</dd>
          <dt>${bi(data.bank.ifscLabel)}</dt><dd>${data.bank.ifsc}</dd>
        </dl>
      </div>
    </div>
  `;
}

function renderDonors(data) {
  const el = document.getElementById("donors-content");
  if (!el) return;
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <p class="muted" data-rv>${bi(data.intro)}</p>
    <div class="donors-layout">
      ${data.photo ? `
        <div class="donor-photo-frame" data-rv>
          <div class="donor-photo">
            <img src="images/${encodeURIComponent(data.photo.file)}" alt="Yakshagana performer">
          </div>
        </div>
      ` : ""}
      <div>
        <div class="donor-names" data-rv>
          ${data.names.map(n => `<span>${n}</span>`).join("")}
        </div>
        <p class="donors-cta"><a class="card-link" href="#donate">${bi(data.cta)} →</a></p>
      </div>
    </div>
  `;
}

function renderContact(data) {
  const el = document.getElementById("contact-content");
  if (!el) return;
  const year = new Date().getFullYear();
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <div class="contact-grid" data-rv>
      <div>
        <div class="label">${bi(data.email.label)}</div>
        <div class="value"><a href="mailto:${data.email.value}">${data.email.value}</a></div>
        <div class="label" style="margin-top:18px">${bi(data.website.label)}</div>
        <div class="value"><a href="https://${data.website.value}">${data.website.value}</a></div>
        <div class="label" style="margin-top:18px">${bi(data.prasangaLibrary.label)}</div>
        <div class="value"><a href="https://${data.prasangaLibrary.value}" target="_blank" rel="noopener">${data.prasangaLibrary.value}</a></div>
      </div>
      <div>
        <div class="label">${bi(data.address.label)}</div>
        <div class="value">${bi(data.address.value)}</div>
      </div>
      <div class="social-links">
        ${data.social.map(s => `<a href="${s.href}" target="_blank" rel="noopener">${SOCIAL_ICONS[s.icon] || ""}<span>${s.label}</span></a>`).join("")}
      </div>
    </div>
    <div class="copyright">${bi(data.copyright).replace(/\{year\}/g, year)}</div>
  `;
}

// ---------- Boot ----------

async function boot() {
  initLangToggle();
  const [home, about, projects, apps, achievements, leadership, news, videos, volunteer, donate, donors, contact] = await Promise.all([
    loadJSON("home"), loadJSON("about"), loadJSON("projects"), loadJSON("apps"), loadJSON("achievements"),
    loadJSON("leadership"), loadJSON("news"), loadJSON("videos"), loadJSON("volunteer"), loadJSON("donate"), loadJSON("donors"), loadJSON("contact"),
  ]);
  renderHome(home);
  renderAbout(about);
  renderProjects(projects);
  renderNavProjectsDropdown(projects);
  initNavDropdowns();
  renderApps(apps);
  renderAchievements(achievements);
  renderLeadership(leadership);
  renderNews(news);
  renderVideos(videos);
  renderVolunteer(volunteer);
  renderDonate(donate);
  renderDonors(donors);
  renderContact(contact);
  initReveal();
}

boot().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML("afterbegin", `<div style="background:#5c2b2e;color:#ff8a80;padding:12px;text-align:center;font:14px monospace">Failed to load site content: ${err.message}</div>`);
});
