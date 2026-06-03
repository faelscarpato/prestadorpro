import { bySlug, getPrestadores } from "../data.js";
import { button, avatar, escapeHtml as e, list, notFoundPage, safeUrl, sectionHead, setSeo, statusTag, tags, trustNotice, whatsappButton } from "../templates.js";

function renderPortfolio(items = []) {
  if (!items.length) {
    return `<p>Ainda não há imagens no portfólio deste prestador.</p>`;
  }

  return `
    <div class="grid grid-3">
      ${items.map((item) => {
        const image = safeUrl(item.imagem, "");
        return `
          <article class="card">
            ${image ? `<div class="card-image"><img src="${e(image)}" alt="${e(item.titulo)}" loading="lazy"></div>` : ""}
            <h3>${e(item.titulo)}</h3>
            <p>${e(item.descricao || "")}</p>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

export async function renderPrestador(slug) {
  const prestadores = await getPrestadores();
  const prestador = bySlug(prestadores, slug);

  if (!prestador || prestador.ativo === false) {
    return notFoundPage("prestador");
  }

  setSeo({
    title: `${prestador.nome} — ${prestador.titulo}`,
    description: prestador.chamada
  });

  const message = `Olá ${prestador.nome}, vi seu perfil no Prestador Pro e quero solicitar um orçamento.`;

  return `
    <section class="detail-hero">
      <div class="container detail-grid">
        <div>
          <div class="profile-head">
            ${avatar({ image: prestador.foto, initial: prestador.avatarInicial, label: prestador.nome })}
            <div>
              <span class="eyebrow">Prestador cadastrado</span>
              <h1>${e(prestador.nome)}</h1>
              <p class="lead">${e(prestador.titulo)}</p>
            </div>
          </div>

          ${tags([prestador.categoria, prestador.verificado ? "Verificado manualmente" : ""])}
          <p>${e(prestador.chamada)}</p>

          <div class="meta">
            <span><strong>Local:</strong> ${e([prestador.cidade, prestador.estado].filter(Boolean).join("/"))}</span>
            <span><strong>Experiência:</strong> ${e(prestador.experiencia || "sob consulta")}</span>
          </div>

          <div class="hero-actions">
            ${whatsappButton("Chamar no WhatsApp", prestador.whatsapp, message, "primary")}
            ${button("Ver outros prestadores", "/prestadores", "secondary")}
          </div>
          ${trustNotice("perfil")}
        </div>

        <aside class="card detail-aside">
          <h3>Resumo profissional</h3>
          <div class="tag-row">${statusTag(prestador.status)}</div>
          <div class="kv-grid">
            <div class="kv">
              <small>Região de atendimento</small>
              <strong>${e(prestador.regiaoAtendimento || "Consultar disponibilidade")}</strong>
            </div>
            <div class="kv">
              <small>Preço referência</small>
              <strong>${e(prestador.precoReferencia || "Sob orçamento")}</strong>
            </div>
            <div class="kv">
              <small>Contato</small>
              <strong>${e(prestador.whatsapp || prestador.email || "Contato sob consulta")}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container grid grid-2">
        <article class="card">
          ${sectionHead("Serviços principais", "", "", "Atuação")}
          ${list(prestador.servicos)}
        </article>
        <article class="card">
          ${sectionHead("Diferenciais", "", "", "Confiança")}
          ${list(prestador.diferenciais)}
        </article>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container grid grid-2">
        <article class="card">
          ${sectionHead("Experiências", "", "", "Histórico")}
          ${(prestador.experiencias || []).length ? `
            <div class="timeline">
              ${prestador.experiencias.map((item) => `
                <div class="timeline-item">
                  <strong>${e(item.titulo)}</strong>
                  <p>${e(item.descricao)}</p>
                </div>
              `).join("")}
            </div>
          ` : "<p>Experiências sob consulta.</p>"}
        </article>

        <article class="card">
          ${sectionHead("Cursos", "", "", "Formação")}
          ${list(prestador.cursos)}
        </article>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead("Portfólio visual", "Exemplos de trabalhos realizados ou imagens demonstrativas.", "", "Trabalhos")}
        ${renderPortfolio(prestador.portfolio)}
        ${prestador.observacoes ? `<div class="notice">${e(prestador.observacoes)}</div>` : ""}
      </div>
    </section>
  `;
}
