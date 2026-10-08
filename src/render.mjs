const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const hasItems = (list) => Array.isArray(list) && list.length > 0;

const dateRange = ({ start, end }) => [start, end].filter(Boolean).join(" – ");

const bullets = (items) =>
  hasItems(items)
    ? `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
    : "";

const section = (id, heading, body) => `
      <section id="${id}" aria-labelledby="${id}-heading">
        <h2 id="${id}-heading">${esc(heading)}</h2>
        ${body}
      </section>`;

const entry = ({ title, org, tag, dates, meta, highlights }) => `
        <article class="entry">
          <div class="entry-head">
            <h3>${esc(title)}${org ? ` <span class="org">${esc(org)}</span>` : ""}${tag ? ` <span class="tag">${esc(tag)}</span>` : ""}</h3>
            ${dates ? `<p class="dates">${esc(dates)}</p>` : ""}
          </div>
          ${meta ? `<p class="entry-meta">${esc(meta)}</p>` : ""}
          ${bullets(highlights)}
        </article>`;

function renderHeader(basics) {
  const contact = [
    `<a href="mailto:${esc(basics.email)}">${esc(basics.email)}</a>`,
    basics.phone &&
      `<a href="tel:${esc(basics.phone.replace(/[^\d+]/g, ""))}">${esc(basics.phone)}</a>`,
    ...(basics.links ?? []).map(
      (link) =>
        `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`,
    ),
    basics.location && esc(basics.location),
  ].filter(Boolean);

  return `
    <header>
      <h1>${esc(basics.name)}</h1>
      ${basics.title ? `<p class="title">${esc(basics.title)}</p>` : ""}
      <ul class="contact">${contact.map((item) => `<li>${item}</li>`).join("")}</ul>
    </header>`;
}

const renderSummary = ({ summary }) =>
  summary ? section("summary", "Summary", `<p>${esc(summary)}</p>`) : "";

const renderExperience = (experience) =>
  hasItems(experience)
    ? section(
        "experience",
        "Experience",
        experience
          .map((job) =>
            entry({
              title: job.role,
              org: job.company,
              dates: dateRange(job),
              highlights: job.highlights,
            }),
          )
          .join(""),
      )
    : "";

const renderSkills = (skills) =>
  hasItems(skills)
    ? section(
        "skills",
        "Skills",
        skills
          .map(
            (group) => `
        <div class="skill-row">
          <h3>${esc(group.category)}</h3>
          <ul class="chips">${group.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        </div>`,
          )
          .join(""),
      )
    : "";

const renderProjects = (projects) =>
  hasItems(projects)
    ? section(
        "projects",
        "Projects",
        projects
          .map((project) =>
            entry({
              title: project.name,
              tag: project.tag,
              meta: hasItems(project.tech) ? project.tech.join(" · ") : "",
              highlights: project.highlights,
            }),
          )
          .join(""),
      )
    : "";

const renderEducation = (education) =>
  hasItems(education)
    ? section(
        "education",
        "Education",
        education
          .map((school) =>
            entry({
              title: school.degree,
              dates: dateRange(school),
              meta: [school.school, school.gpa && `GPA ${school.gpa}`]
                .filter(Boolean)
                .join(" · "),
              highlights: school.highlights,
            }),
          )
          .join(""),
      )
    : "";

const renderReferences = (references) =>
  references ? section("references", "References", `<p>${esc(references)}</p>`) : "";

function renderHead({ meta = {}, basics }) {
  const initials = basics.name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1e3a5f"/><text x="16" y="22" font-family="Segoe UI,Arial,sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#fff">${esc(initials)}</text></svg>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: basics.name,
    jobTitle: basics.title,
    email: `mailto:${basics.email}`,
    url: meta.siteUrl,
    sameAs: (basics.links ?? []).map((link) => link.url),
  };

  const title = `${basics.name} – CV`;

  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="author" content="${esc(basics.name)}" />
    ${meta.description ? `<meta name="description" content="${esc(meta.description)}" />` : ""}
    ${hasItems(meta.keywords) ? `<meta name="keywords" content="${esc(meta.keywords.join(", "))}" />` : ""}
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:type" content="profile" />
    ${meta.description ? `<meta property="og:description" content="${esc(meta.description)}" />` : ""}
    ${meta.siteUrl ? `<meta property="og:url" content="${esc(meta.siteUrl)}" />\n    <link rel="canonical" href="${esc(meta.siteUrl)}" />` : ""}
    ${meta.locale ? `<meta property="og:locale" content="${esc(meta.locale)}" />` : ""}
    <link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}" />
    <link rel="stylesheet" href="styles.css" />
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`;
}

export function renderPage(resume) {
  const lang = (resume.meta?.locale ?? "en").split("_")[0];

  return `<!DOCTYPE html>
<html lang="${esc(lang)}">
  <head>${renderHead(resume)}
  </head>
  <body>
    <div class="page">${renderHeader(resume.basics)}
    <main>${renderSummary(resume.basics)}${renderExperience(resume.experience)}${renderSkills(resume.skills)}${renderProjects(resume.projects)}${renderEducation(resume.education)}${renderReferences(resume.references)}
    </main>
    </div>
  </body>
</html>
`;
}
