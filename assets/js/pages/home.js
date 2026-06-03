import { getAllData, activeItems, sortItems } from "../data.js";
import { button, card, escapeHtml as e, sectionHead, setSeo, tags, trustNotice, whatsappButton } from "../templates.js";
import { CONFIG, whatsappUrl } from "../config.js";

function serviceCard(service) {
  const message = `Olá, vim pelo Prestador Pro e quero saber mais sobre ${service.nome}.`;
  return card({
    title: service.nome,
    text: service.subtitulo,
    price: service.preco,
    tags: service.destaque ? ["Destaque"] : [],
    kicker: "Serviço digital",
    className: "service-card",
    image: service.imagem,
    actions: `
      ${button("Ver detalhes", `/${service.slug}`, "secondary")}
      ${whatsappButton("Pedir no WhatsApp", CONFIG.mainWhatsApp, message, "primary")}
    `
  });
}

function vagaCard(vaga, empresa) {
  const cidade = [vaga.bairro, vaga.cidade, vaga.estado].filter(Boolean).join(" · ");
  const message = `Olá, vi a vaga de ${vaga.titulo} no Prestador Pro e quero me candidatar. Meu nome é:`;
  return card({
    title: vaga.titulo,
    text: `${empresa?.nome || "Empresa"} · ${cidade}`,
    price: vaga.salario || "Salário a combinar",
    tags: [vaga.funcao, vaga.status].filter(Boolean),
    kicker: "Vaga aberta",
    className: "listing-card job-card",
    actions: `
      ${button("Ver vaga", `/vaga/${vaga.slug}`, "secondary")}
      ${whatsappButton("Candidatar", vaga.contato?.whatsapp || empresa?.whatsapp, message, "primary")}
    `
  });
}

function prestadorCard(prestador) {
  const local = [prestador.cidade, prestador.estado].filter(Boolean).join("/");
  const message = `Olá, vi seu perfil no Prestador Pro e quero solicitar um orçamento.`;
  return card({
    title: prestador.nome,
    text: `${prestador.titulo} em ${local}. ${prestador.chamada}`,
    tags: [prestador.categoria, prestador.verificado ? "Verificado manualmente" : prestador.status].filter(Boolean),
    kicker: "Prestador cadastrado",
    className: "listing-card provider-card",
    actions: `
      ${button("Ver portfólio", `/prestador/${prestador.slug}`, "secondary")}
      ${whatsappButton("WhatsApp", prestador.whatsapp, message, "primary")}
    `
  });
}

export async function renderHome() {
  setSeo({
    title: "Vitrine para prestadores, empresas e vagas",
    description: "Presença digital simples para profissionais da construção civil, empresas e vagas, com contato direto pelo WhatsApp."
  });

  const { services, prestadores, empresas, vagas } = await getAllData();
  const activeServices = sortItems(activeItems(services));
  const activePrestadores = sortItems(activeItems(prestadores));
  const activeVagas = sortItems(activeItems(vagas)).filter((vaga) => vaga.status !== "Encerrada");
  const featuredPrestadores = activePrestadores.slice(0, 3);
  const recentVagas = activeVagas.slice(0, 3);
  const heroServices = activeServices.slice(0, 3);
  const boardPrestador = featuredPrestadores[0];
  const boardVaga = recentVagas[0];
  const boardService = activeServices[0];

  return `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">Prestador Pro</span>
          <h1>Vitrine digital para serviços de obra.</h1>
          <p class="lead">
            Páginas públicas, portfólios, vagas e materiais de divulgação para prestadores,
            empresas e candidatos da construção civil entrarem em contato sem cadastro complexo.
          </p>
          <div class="hero-actions">
            ${button("Divulgar meu serviço", whatsappUrl(CONFIG.mainWhatsApp, "Olá, quero divulgar meu serviço no Prestador Pro."), "primary", 'target="_blank" rel="noopener"')}
            ${button("Ver vagas abertas", "/vagas", "secondary")}
          </div>
          <div class="hero-proof" aria-label="Características do atendimento">
            <span class="proof-item">Contato direto pelo WhatsApp</span>
            <span class="proof-item">Dados publicados com autorização</span>
            <span class="proof-item">Edição manual e curada</span>
          </div>
          <div class="metric-grid">
            <div class="metric">
              <strong>${activeServices.length}</strong>
              <span>serviços digitais</span>
            </div>
            <div class="metric">
              <strong>${activePrestadores.length}</strong>
              <span>prestadores ativos</span>
            </div>
            <div class="metric">
              <strong>${empresas.length}</strong>
              <span>empresas cadastradas</span>
            </div>
            <div class="metric">
              <strong>${activeVagas.length}</strong>
              <span>vagas abertas</span>
            </div>
          </div>
        </div>

        <aside class="work-board" aria-label="Resumo da vitrine Prestador Pro">
          <div class="work-board-header">
            <div>
              <strong>Hoje na vitrine</strong>
              <small>Itens reais cadastrados nos arquivos JSON</small>
            </div>
            <span class="board-status">Contato aberto</span>
          </div>
          <div class="board-list">
            ${boardPrestador ? `
              <div class="board-row">
                <span class="board-code">PR</span>
                <div>
                  <strong>${e(boardPrestador.nome)}</strong>
                  <span>${e(boardPrestador.titulo)} · ${e(boardPrestador.cidade || CONFIG.defaultCity)}</span>
                </div>
                <a class="board-link" href="/prestador/${e(boardPrestador.slug)}" data-link>Ver perfil</a>
              </div>
            ` : ""}
            ${boardVaga ? `
              <div class="board-row">
                <span class="board-code">VG</span>
                <div>
                  <strong>${e(boardVaga.titulo)}</strong>
                  <span>${e(boardVaga.cidade || CONFIG.defaultCity)} · ${e(boardVaga.salario || "A combinar")}</span>
                </div>
                <a class="board-link" href="/vaga/${e(boardVaga.slug)}" data-link>Ver vaga</a>
              </div>
            ` : ""}
            ${boardService ? `
              <div class="board-row">
                <span class="board-code">SV</span>
                <div>
                  <strong>${e(boardService.nome)}</strong>
                  <span>${e(boardService.preco || "Preço sob consulta")}</span>
                </div>
                <a class="board-link" href="/${e(boardService.slug)}" data-link>Ver serviço</a>
              </div>
            ` : ""}
          </div>
          <div class="hero-media-strip">
            ${heroServices.map((service) => `
              <a class="media-tile" href="/${e(service.slug)}" data-link>
                <img src="${e(service.imagem)}" alt="${e(service.nome)}" loading="lazy">
                <span>${e(service.nome)}</span>
              </a>
            `).join("")}
          </div>
        </aside>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        <div class="trust-band">
          <div>
            <span class="eyebrow">Publicação responsável</span>
            <h2>Uma vitrine curada, sem intermediação.</h2>
            <p>
              O site organiza informações e facilita o primeiro contato. Preço, prazo, contratação,
              disponibilidade e condições devem ser confirmados diretamente com o responsável.
            </p>
          </div>
          ${button("Entender o fluxo", "/como-funciona", "secondary")}
        </div>
      </div>
    </section>

    <section class="section" id="servicos">
      <div class="container">
        ${sectionHead("Serviços digitais", "Formatos simples para prestadores se apresentarem melhor e empresas divulgarem oportunidades com link compartilhável.", "", "Serviços")}
        <div class="grid grid-3">
          ${activeServices.map(serviceCard).join("")}
        </div>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        <div class="grid grid-3">
          <article class="card">
            ${tags(["Para prestadores"], "success")}
            <h3>Prestadores autônomos</h3>
            <p>Página profissional, currículo online, cartão digital, portfólio e divulgação pronta para WhatsApp.</p>
            <div class="card-actions">
              ${button("Ver prestadores", "/prestadores", "secondary")}
              ${button("Cadastrar perfil", whatsappUrl(CONFIG.mainWhatsApp, "Olá, quero cadastrar meu perfil no Banco de Prestadores."), "primary", 'target="_blank" rel="noopener"')}
            </div>
          </article>

          <article class="card">
            ${tags(["Para empresas"], "warning")}
            <h3>Empresas, RHs e obras</h3>
            <p>Página pública de empresa e vagas organizadas para compartilhamento e candidatura rápida.</p>
            <div class="card-actions">
              ${button("Ver empresas", "/empresas", "secondary")}
              ${button("Divulgar vaga", whatsappUrl(CONFIG.mainWhatsApp, "Olá, quero divulgar uma vaga no Prestador Pro."), "primary", 'target="_blank" rel="noopener"')}
            </div>
          </article>

          <article class="card">
            ${tags(["Para clientes e candidatos"])}
            <h3>Clientes e candidatos</h3>
            <p>Informações organizadas para encontrar profissionais, consultar vagas e chamar diretamente pelo WhatsApp.</p>
            <div class="card-actions">
              ${button("Ver vagas", "/vagas", "primary")}
            </div>
          </article>
        </div>
        ${trustNotice("geral")}
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead("Prestadores em destaque", "Perfis cadastrados com serviço, região, diferenciais e contato direto.", button("Ver todos", "/prestadores", "secondary"), "Banco de Prestadores")}
        <div class="grid grid-3">
          ${featuredPrestadores.map(prestadorCard).join("")}
        </div>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        ${sectionHead("Vagas recentes", "Oportunidades organizadas por cidade, função, empresa e status.", button("Ver todas", "/vagas", "secondary"), "Radar de Vagas")}
        <div class="grid grid-3">
          ${recentVagas.map((vaga) => vagaCard(vaga, empresas.find((empresa) => empresa.slug === vaga.empresaSlug))).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <span class="eyebrow">Comece simples</span>
            <h2>Publique um perfil, vaga ou material de divulgação.</h2>
            <p>Envie os dados básicos, revise a mensagem pronta e use o link para divulgar em grupos, status e redes sociais.</p>
          </div>
          ${button("Enviar solicitação", "/como-funciona#solicitar", "primary")}
        </div>
      </div>
    </section>
  `;
}
