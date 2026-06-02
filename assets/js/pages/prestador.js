import { bySlug, getPrestadores } from "../data.js";
import { button, avatar, list, notFoundPage, sectionHead, setSeo, statusTag, tags, whatsappButton } from "../templates.js";

function renderPortfolio(items = []) {
  if (!items.length) {
    return `<p>Ainda não há imagens no portfólio deste prestador.</p>`;
  }

  return `
    <div class="grid grid-3">
      ${items.map((item) => `
        <article class="card">
          ${item.imagem ? `<div class="card-image"><img src="${item.imagem}" alt="${item.titulo}" loading="lazy"></div>` : ""}
          <h3>${item.titulo}</h3>
          <p>${item.descricao || ""}</p>
        </article>
      `).join("")}
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
              <h1>${prestador.nome}</h1>
              <p class="lead">${prestador.titulo}</p>
            </div>
          </div>

          ${tags([prestador.categoria])}
          <p>${prestador.chamada}</p>

          <div class="meta">
            <span>📍 ${[prestador.cidade, prestador.estado].filter(Boolean).join("/")}</span>
            <span>🧰 ${prestador.experiencia || "Experiência sob consulta"}</span>
          </div>

          <div class="hero-actions">
            ${whatsappButton("Chamar no WhatsApp", prestador.whatsapp, message, "primary")}
            ${button("Ver outros prestadores", "/prestadores", "secondary")}
          </div>
        </div>

        <aside class="card detail-aside">
          <h3>Resumo profissional</h3>
          <div class="tag-row">${statusTag(prestador.status)}</div>
          <div class="kv-grid">
            <div class="kv">
              <small>Região de atendimento</small>
              <strong>${prestador.regiaoAtendimento || "Consultar disponibilidade"}</strong>
            </div>
            <div class="kv">
              <small>Preço referência</small>
              <strong>${prestador.precoReferencia || "Sob orçamento"}</strong>
            </div>
            <div class="kv">
              <small>Contato</small>
              <strong>${prestador.whatsapp || prestador.email || "Contato sob consulta"}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container grid grid-2">
        <article class="card">
          ${sectionHead("Serviços principais", "")}
          ${list(prestador.servicos)}
        </article>
        <article class="card">
          ${sectionHead("Diferenciais", "")}
          ${list(prestador.diferenciais)}
        </article>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container grid grid-2">
        <article class="card">
          ${sectionHead("Experiências", "")}
          ${(prestador.experiencias || []).length ? `
            <div class="grid">
              ${prestador.experiencias.map((item) => `
                <div class="kv">
                  <strong>${item.titulo}</strong>
                  <p>${item.descricao}</p>
                </div>
              `).join("")}
            </div>
          ` : `<p>Nenhuma experiência cadastrada.</p>`}
        </article>

        <article class="card">
          ${sectionHead("Cursos", "")}
          ${list(prestador.cursos)}
        </article>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        ${sectionHead("Portfólio visual", "Exemplos de trabalhos realizados ou imagens demonstrativas.")}
        ${renderPortfolio(prestador.portfolio)}
        ${prestador.observacoes ? `<div class="notice">${prestador.observacoes}</div>` : ""}
      </div>
    </section>
  `;
}
