import { getAllData, activeItems, sortItems } from "../data.js";
import { button, card, sectionHead, setSeo, statusTag, tags, whatsappButton } from "../templates.js";
import { CONFIG, whatsappUrl } from "../config.js";

function serviceCard(service) {
  const message = `Olá, vim pelo Prestador Pro e quero saber mais sobre ${service.nome}.`;
  return card({
    title: service.nome,
    text: service.subtitulo,
    price: service.preco,
    tags: service.destaque ? ["Mais vendido"] : [],
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
    tags: [prestador.categoria, prestador.status].filter(Boolean),
    actions: `
      ${button("Ver portfólio", `/prestador/${prestador.slug}`, "secondary")}
      ${whatsappButton("WhatsApp", prestador.whatsapp, message, "primary")}
    `
  });
}

export async function renderHome() {
  setSeo({
    title: "Serviços Digitais para Obra",
    description: "Divulgue seu serviço, encontre profissionais e cadastre vagas da construção civil com o Prestador Pro."
  });

  const { services, prestadores, empresas, vagas } = await getAllData();
  const activeServices = sortItems(activeItems(services));
  const activePrestadores = sortItems(activeItems(prestadores)).slice(0, 3);
  const activeVagas = sortItems(activeItems(vagas)).filter((vaga) => vaga.status !== "Encerrada").slice(0, 3);

  return `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">Serviços digitais para obra</span>
          <h1>Divulgue seu serviço. Encontre profissionais. Cadastre vagas.</h1>
          <p class="lead">
            O Prestador Pro é uma vitrine digital para prestadores, empresas e oportunidades da construção civil.
            Crie páginas profissionais, portfólios online, currículos e divulgações prontas para WhatsApp.
          </p>
          <div class="hero-actions">
            ${button("Falar no WhatsApp", whatsappUrl(CONFIG.mainWhatsApp, "Olá, vim pelo Prestador Pro e quero divulgar meu serviço ou minha vaga."), "primary", 'target="_blank" rel="noopener"')}
            ${button("Ver serviços", "#servicos", "secondary")}
          </div>
          <div class="metric-grid">
            <div class="metric">
              <strong>${activeServices.length}</strong>
              <span>serviços digitais</span>
            </div>
            <div class="metric">
              <strong>${activePrestadores.length}+</strong>
              <span>prestadores modelo</span>
            </div>
            <div class="metric">
              <strong>${empresas.length}</strong>
              <span>empresas cadastradas</span>
            </div>
            <div class="metric">
              <strong>${vagas.length}</strong>
              <span>vagas publicadas</span>
            </div>
          </div>
        </div>

        <div class="hero-panel">
          <div class="fake-phone">
            <div class="fake-screen">
              <div class="phone-top">
                <strong>Prestador Pro</strong>
                <span class="phone-pill"></span>
              </div>
              <div class="phone-card">
                <strong>Pedro Pinturas</strong>
                <span>Portfólio online + WhatsApp direto</span>
              </div>
              <div class="phone-card">
                <strong>Vaga: Pedreiro de Obras</strong>
                <span>Interlagos · São Paulo · CLT</span>
              </div>
              <div class="phone-card">
                <strong>Kit Divulgação</strong>
                <span>Arte pronta para status e grupos</span>
              </div>
              <div class="phone-cta">Chamar no WhatsApp</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="servicos">
      <div class="container">
        ${sectionHead("Serviços digitais", "Ofertas simples para vender rápido, divulgar melhor e organizar oportunidades.")}
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
            <h3>Ganhe uma página profissional</h3>
            <p>Mostre serviços, experiência, cursos, diferenciais e botão direto para WhatsApp.</p>
            <div class="card-actions">
              ${button("Ver banco", "/prestadores", "secondary")}
              ${button("Cadastrar perfil", whatsappUrl(CONFIG.mainWhatsApp, "Olá, quero cadastrar meu perfil no Banco de Prestadores."), "primary", 'target="_blank" rel="noopener"')}
            </div>
          </article>

          <article class="card">
            ${tags(["Para empresas"], "warning")}
            <h3>Divulgue vagas de obra</h3>
            <p>Tenha uma página de empresa com suas vagas organizadas e contato para candidatura.</p>
            <div class="card-actions">
              ${button("Ver empresas", "/empresas", "secondary")}
              ${button("Cadastrar vaga", whatsappUrl(CONFIG.mainWhatsApp, "Olá, quero divulgar uma vaga no Prestador Pro."), "primary", 'target="_blank" rel="noopener"')}
            </div>
          </article>

          <article class="card">
            ${tags(["Radar de Vagas"])}
            <h3>Encontre oportunidades</h3>
            <p>Lista simples de vagas com busca por cidade, função, empresa, categoria e status.</p>
            <div class="card-actions">
              ${button("Ver vagas", "/vagas", "primary")}
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead("Prestadores em destaque", "Perfis modelo para divulgar profissionais com aparência mais profissional.", button("Ver todos", "/prestadores", "secondary"))}
        <div class="grid grid-3">
          ${activePrestadores.map(prestadorCard).join("")}
        </div>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        ${sectionHead("Vagas recentes", "Oportunidades organizadas para candidatura rápida pelo WhatsApp.", button("Ver todas", "/vagas", "secondary"))}
        <div class="grid grid-3">
          ${activeVagas.map((vaga) => vagaCard(vaga, empresas.find((empresa) => empresa.slug === vaga.empresaSlug))).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <span class="eyebrow">Comece simples</span>
            <h2>Valide sua oferta com uma vitrine rápida, profissional e barata.</h2>
            <p>Sem login, sem painel e sem complicação. O foco é vender pelo WhatsApp e atualizar pelo GitHub.</p>
          </div>
          ${button("Falar com Rafa", whatsappUrl(CONFIG.mainWhatsApp, "Olá, quero usar o Prestador Pro para divulgar serviços, prestadores ou vagas."), "primary", 'target="_blank" rel="noopener"')}
        </div>
      </div>
    </section>
  `;
}
