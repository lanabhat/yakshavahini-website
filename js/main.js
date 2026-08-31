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
        ${renderCarousel(data.slideshow?.slides || [], "hero-carousel", { basePath: "images/slideshow/", tall: true })}
      </div>
    </div>
  `;
  initCarousel(data.slideshow?.slides || [], "hero-carousel", { basePath: "images/slideshow/", intervalMs: data.slideshow?.intervalMs || 4000 });
}

// ---------- Horizontal scroll carousel (no zoom) ----------
// Shows as many cards as fit the available width; arrows scroll by one card.

function renderHCarousel(itemHtmls, idPrefix) {
  if (!itemHtmls.length) return "";
  return `
    <div class="h-carousel" id="${idPrefix}-carousel">
      <div class="h-carousel-track" id="${idPrefix}-track">
        ${itemHtmls.map(h => `<div class="h-carousel-slide">${h}</div>`).join("")}
      </div>
      ${itemHtmls.length > 1 ? `
        <button class="carousel-nav carousel-prev" id="${idPrefix}-prev" type="button" aria-label="Previous">‹</button>
        <button class="carousel-nav carousel-next" id="${idPrefix}-next" type="button" aria-label="Next">›</button>
      ` : ""}
    </div>
  `;
}

function initHCarousel(idPrefix, count) {
  const track = document.getElementById(`${idPrefix}-track`);
  const prevBtn = document.getElementById(`${idPrefix}-prev`);
  const nextBtn = document.getElementById(`${idPrefix}-next`);
  if (!track || count < 2 || !prevBtn || !nextBtn) return;

  function step() {
    const slide = track.querySelector(".h-carousel-slide");
    if (!slide) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0");
    return slide.getBoundingClientRect().width + gap;
  }
  function updateButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
    prevBtn.style.display = maxScroll > 0 ? "" : "none";
    nextBtn.style.display = maxScroll > 0 ? "" : "none";
  }
  prevBtn.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  nextBtn.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  track.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);
  updateButtons();
}

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

  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <div id="blogger-posts"></div>
    <div id="news-fallback" data-rv>${renderHCarousel(data.highlights.map(h => `
      <div class="news-card">
        <div class="tag">${bi(h.tag)}</div>
        <h3>${bi(h.title)}</h3>
        <p>${bi(h.description)}</p>
      </div>
    `), "news-fallback")}</div>
    ${data.blogLink ? `<a class="card-link" href="${data.blogLink.url}" target="_blank" rel="noopener" data-rv>${bi(data.blogLink.label)} →</a>` : ""}
  `;
  initHCarousel("news-fallback", data.highlights.length);

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
  container.innerHTML = renderHCarousel(entries.map(renderBloggerEntry), "news-live");
  initHCarousel("news-live", entries.length);
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
    <div data-rv>${renderHCarousel(picked.map(v => `
      <div class="video-card" data-video-id="${v.id}">
        <div class="video-thumb">
          <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
          <span class="play-btn" aria-hidden="true">▶</span>
        </div>
        <div class="video-subject">${bi(v.subject)}</div>
        <h3>${v.title}</h3>
      </div>
    `), "videos")}</div>
    <a class="card-link" href="${data.channelUrl}" target="_blank" rel="noopener">${bi(data.channelLabel)} →</a>
  `;
  initHCarousel("videos", picked.length);
  el.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", () => {
      VideoModal.open(card.dataset.videoId, card.querySelector("h3")?.textContent || "");
    });
  });
}

// ---------- Video modal (popup player) ----------

const VideoModal = (() => {
  let overlay = null;

  function onKey(e) { if (e.key === "Escape") close(); }

  function close() {
    if (!overlay) return;
    document.removeEventListener("keydown", onKey);
    overlay.remove();
    overlay = null;
    document.body.style.overflow = "";
  }

  function open(id, title) {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay video-modal-overlay";
    overlay.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close">✕</button>
      <div class="video-modal-stage">
        <div class="video-embed">
          <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        ${title ? `<div class="video-modal-title">${title}</div>` : ""}
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    overlay.querySelector(".lightbox-close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", onKey);
  }

  return { open, close };
})();

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
  initPreLaunchRedirect();
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
  initMobileNav();
  initBackToTop();
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
