// Yakshavahini site — loads bilingual content from /content/*.json and renders it.
// No build step, no framework: works on any static host that serves plain files.

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
  const saved = localStorage.getItem("yv-lang") || "kn";
  setLang(saved);
  document.querySelectorAll(".lang-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

// ---------- Section renderers ----------

function renderHome(data) {
  const el = document.getElementById("home-content");
  if (!el) return;
  el.innerHTML = `
    <div class="hero-grid">
      <div>
        <div class="badge" data-rv>${bi(data.badge)}</div>
        <h1 data-rv>${bi(data.title)}</h1>
        <p class="lede" data-rv>${bi(data.subtitle)}</p>
        <p class="lede muted" data-rv>${bi(data.lede)}</p>
        <div class="hero-cta" data-rv>
          <a class="btn btn-gold" href="#projects">${bi(data.cta.primary)}</a>
          <a class="btn btn-donate" href="#donate">${bi(data.cta.donate)}</a>
        </div>
      </div>
      <div class="hero-photos" data-rv>
        <div class="photo photo-tall">
          <img src="images/prasanga.jpg" alt="Prasanga book page">
          <span class="caption">${bi(data.featuredPrasangaLabel)}</span>
        </div>
        <div class="photo-row">
          <div class="photo"><img src="images/tenku.JPG" alt="Tenku tittu performance"><span class="caption" lang="en">tenku tittu</span></div>
          <div class="photo"><img src="images/badagu.jpeg" alt="Badagu tittu performance"><span class="caption" lang="en">badagu tittu</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderAbout(data) {
  const el = document.getElementById("about-content");
  if (!el) return;
  el.innerHTML = `
    <div class="eyebrow" data-rv>${bi(data.eyebrow)}</div>
    <h2 data-rv>${bi(data.heading)}</h2>
    <div class="about-grid">
      <div data-rv>
        <div class="about-photo"><img src="images/DSC07311.JPG" alt="Yakshagana vesha"></div>
        ${data.body.map(p => `<p>${bi(p)}</p>`).join("")}
      </div>
      <div class="stat-cards" data-rv>
        ${data.stats.map(s => `<div class="stat-card"><div class="stat-value">${s.value}</div><div class="stat-label">${bi(s.label)}</div></div>`).join("")}
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
          ${p.blogUrl ? `<a class="card-link" href="${p.blogUrl}" target="_blank" rel="noopener">Visit blog →</a>` : ""}
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

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
          ${data.coordinators.map(c => `<li>${c.name} (${c.nameEn}) — ${c.phone}</li>`).join("")}
        </ul>
      </div>
      <div class="ways-grid" data-rv>
        ${data.ways.map(w => `<div class="way-card"><div class="code">${w.code}</div>${bi(w.label)}</div>`).join("")}
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
    <div class="donor-names" data-rv>
      ${data.names.map(n => `<span>${n}</span>`).join("")}
    </div>
    <p class="donors-cta"><a class="card-link" href="#donate">${bi(data.cta)} →</a></p>
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

// ---------- Scroll reveal ----------

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
