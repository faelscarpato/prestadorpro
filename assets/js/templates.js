import { whatsappUrl } from "./config.js";

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function safeUrl(value, fallback = "#") {
  const url = String(value || "").trim();
  if (!url) return fallback;
  if (url.startsWith("/") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url;
  }
  return fallback;
}

export function setSeo({ title, description } = {}) {
  const safeTitle = title ? `${title} — Prestador Pro` : "Prestador Pro — Serviços Digitais para Obra";
  const safeDescription = description || "Vitrine digital para divulgar prestadores, empresas e vagas da construção civil.";

  document.title = safeTitle;

  const descriptionTag = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');

  if (descriptionTag) descriptionTag.setAttribute("content", safeDescription);
  if (ogTitle) ogTitle.setAttribute("content", safeTitle);
  if (ogDescription) ogDescription.setAttribute("content", safeDescription);
}

export function tag(label, type = "") {
  if (!label) return "";
  const className = type ? `tag tag-${type}` : "tag";
  return `<span class="${className}">${escapeHtml(label)}</span>`;
}

export function tags(items = [], type = "") {
  if (!items?.length) return "";
  return `<div class="tag-row">${items.map((item) => tag(item, type)).join("")}</div>`;
}

export function button(label, href, variant = "primary", attrs = "") {
  return `<a class="btn btn-${variant}" href="${safeUrl(href)}" ${attrs}>${escapeHtml(label)}</a>`;
}

export function whatsappButton(label, number, message, variant = "primary") {
  return button(label, whatsappUrl(number, message), variant, 'target="_blank" rel="noopener"');
}

export function sectionHead(title, text = "", action = "") {
  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">Prestador Pro</span>
        <h2>${escapeHtml(title)}</h2>
        ${text ? `<p>${escapeHtml(text)}</p>` : ""}
      </div>
      ${action || ""}
    </div>
  `;
}

export function loadingState(text = "Carregando informações...") {
  return `
    <section class="section">
      <div class="container">
        <div class="state-card">
          <div class="spinner"></div>
          <p>${escapeHtml(text)}</p>
        </div>
      </div>
    </section>
  `;
}

export function emptyState(title = "Nada encontrado", text = "Tente ajustar os filtros ou voltar mais tarde.") {
  return `
    <div class="state-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

export function errorState(title = "Erro ao carregar", text = "Não foi possível carregar os dados do site.") {
  return `
    <section class="section">
      <div class="container">
        <div class="state-card">
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(text)}</p>
          <div class="actions">
            ${button("Voltar para a home", "/", "secondary")}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function card({ title, text, tags: cardTags = [], price = "", actions = "", image = "" }) {
  return `
    <article class="card">
      ${image ? `<div class="card-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy"></div>` : ""}
      ${cardTags.length ? tags(cardTags) : ""}
      <h3>${escapeHtml(title)}</h3>
      ${text ? `<p>${escapeHtml(text)}</p>` : ""}
      ${price ? `<p class="price">${escapeHtml(price)}</p>` : ""}
      ${actions ? `<div class="card-actions">${actions}</div>` : ""}
    </article>
  `;
}

export function list(items = []) {
  if (!items?.length) return "";
  return `<ul class="info-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

export function avatar({ image = "", initial = "P", label = "" } = {}) {
  if (image) {
    return `<div class="avatar"><img src="${escapeHtml(image)}" alt="${escapeHtml(label)}" loading="lazy"></div>`;
  }
  return `<div class="avatar" aria-hidden="true">${escapeHtml(initial || "P")}</div>`;
}

export function statusTag(status = "") {
  const normalized = String(status).toLowerCase();
  let type = "";
  if (normalized.includes("aberta") || normalized.includes("dispon")) type = "success";
  if (normalized.includes("paus") || normalized.includes("vaga")) type = "warning";
  if (normalized.includes("encerr") || normalized.includes("preench")) type = "danger";
  return tag(status, type);
}

export function notFoundPage(kind = "página") {
  setSeo({
    title: "Página não encontrada",
    description: "A página solicitada não foi encontrada no Prestador Pro."
  });

  return `
    <section class="section">
      <div class="container">
        <div class="state-card">
          <span class="eyebrow">404</span>
          <h1>Página não encontrada</h1>
          <p>Não encontramos esta ${escapeHtml(kind)}. Verifique o link ou volte para a home.</p>
          <div class="actions">
            ${button("Voltar para a home", "/", "primary")}
            ${button("Ver vagas", "/vagas", "secondary")}
          </div>
        </div>
      </div>
    </section>
  `;
}
