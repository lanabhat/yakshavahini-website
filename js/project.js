// Renders a single project's detail page (project.html?slug=...).
// Shared helpers (bi, loadJSON, lang toggle, reveal, nav dropdown) live in common.js.

function getSlug() {
  return new URLSearchParams(window.location.search).get("slug");
}

function renderParagraphs(paragraphs) {
  return (paragraphs || []).map((p) => `<p lang="kn">${p}</p>`).join("");
}

function renderProjectDetail(slug, projectsData, pagesData) {
  const el = document.getElementById("project-detail-content");
  if (!el) return;

  const summary = projectsData.items.find((p) => p.slug === slug);
  const page = pagesData.pages[slug];

  if (!summary || !page) {
    el.innerHTML = `
      <div class="eyebrow">${bi(projectsData.eyebrow)}</div>
      <h2 lang="kn">ಈ ಯೋಜನೆ ಕಂಡುಬಂದಿಲ್ಲ</h2>
      <h2 lang="en">Project not found</h2>
      <p><a class="card-link" href="index.html#projects">${bi({ kn: "ಎಲ್ಲಾ ಯೋಜನೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ", en: "Back to all projects" })} →</a></p>
    `;
    return;
  }

  document.title = `${page.title} - Yakshavahini`;

  const subsections = (page.subsections || []).map((s) => {
    const subLinks = (s.links || []).map((l) => `
      <a class="card-link" href="${l.url}" target="_blank" rel="noopener">${bi(l.label)} →</a>
    `).join("");
    return `
      <div class="project-subsection" data-rv>
        <h3 lang="kn">${s.heading}</h3>
        ${renderParagraphs(s.body)}
        ${subLinks ? `<div class="project-detail-links">${subLinks}</div>` : ""}
      </div>
    `;
  }).join("");

  const extraLinkButtons = (page.links || []).map((l) => `
    <a class="btn btn-gold" href="${l.url}" target="_blank" rel="noopener">${bi(l.label)}</a>
  `).join("");

  el.innerHTML = `
    <a class="card-link back-link" href="index.html#projects" data-rv>${bi(pagesData.backLabel)}</a>
    <div class="eyebrow" data-rv>${summary.code}</div>
    <h1 data-rv><span lang="kn">${page.title}</span><span lang="en">${page.titleEn}</span></h1>
    <div class="project-detail-meta" data-rv>
      <span class="stat">${bi(summary.stat)}</span>
      <span class="coordinator">${summary.coordinator}</span>
    </div>
    ${summary.blogUrl ? `<a class="card-link" href="${summary.blogUrl}" target="_blank" rel="noopener" data-rv>${bi({ kn: "ಬ್ಲಾಗ್ ನೋಡಿ", en: "Visit blog" })} →</a>` : ""}
    <div class="project-detail-body" data-rv>
      ${renderParagraphs(page.body)}
    </div>
    ${subsections}
    ${extraLinkButtons ? `<div class="project-detail-cta" data-rv>${extraLinkButtons}</div>` : ""}
    <p class="lang-note" lang="en" data-rv>${pagesData.languageNote?.en || ""}</p>
  `;
}

async function boot() {
  initLangToggle();
  const slug = getSlug();
  const [projects, pages] = await Promise.all([loadJSON("projects"), loadJSON("project-pages")]);
  renderNavProjectsDropdown(projects);
  initNavDropdowns();
  initMobileNav();
  initBackToTop();
  renderProjectDetail(slug, projects, pages);
  const year = new Date().getFullYear();
  const yk = document.getElementById("footer-year-kn");
  const ye = document.getElementById("footer-year-en");
  if (yk) yk.textContent = year;
  if (ye) ye.textContent = year;
  initReveal();
}

boot().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML("afterbegin", `<div style="background:#5c2b2e;color:#ff8a80;padding:12px;text-align:center;font:14px monospace">Failed to load project content: ${err.message}</div>`);
});
