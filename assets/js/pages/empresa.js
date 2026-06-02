import { bySlug, getEmpresas, getVagas, sortItems } from "../data.js";
import { button, avatar, card, list, notFoundPage, sectionHead, setSeo, statusTag, tags, whatsappButton } from "../templates.js";

function vagaCard(vaga, empresa) {
  const local = [vaga.bairro, vaga.cidade, vaga.estado].filter(Boolean).join(" · ");
  const message = `Olá, vi a vaga de ${vaga.titulo} no Prestador Pro e quero me candidatar. Meu nome é:`;

  return card({
    title: vaga.titulo,
    text: `${local}. ${vaga.tipoContrato || ""}`,
    price: vaga.salario || "Salário a combinar",
    tags: [vaga.funcao, vaga.status].filter(Boolean),
    actions: `
      ${button("Ver vaga", `/vaga/${vaga.slug}`, "secondary")}
      ${whatsappButton("Candidatar", vaga.contato?.whatsapp || empresa.whatsapp, message, "primary")}
    `
  });
}

export async function renderEmpresa(slug) {
  const [empresas, vagasRaw] = await Promise.all([getEmpresas(), getVagas()]);
  const empresa = bySlug(empresas, slug);

  if (!empresa || empresa.ativo === false) {
    return notFoundPage("empresa");
  }

  const vagas = sortItems(vagasRaw.filter((vaga) => vaga.empresaSlug === empresa.slug && vaga.ativo !== false));

  setSeo({
    title: empresa.nome,
    description: empresa.descricao
  });

  return `
    <section class="detail-hero">
      <div class="container detail-grid">
        <div>
          <div class="profile-head">
            ${avatar({ image: empresa.logo, initial: empresa.avatarInicial, label: empresa.nome })}
            <div>
              <span class="eyebrow">Empresa cadastrada</span>
              <h1>${empresa.nome}</h1>
              <p class="lead">${empresa.tipo}</p>
            </div>
          </div>

          ${tags(empresa.segmentos)}
          <p>${empresa.descricao}</p>

          <div class="meta">
            <span>📍 ${[empresa.cidade, empresa.estado].filter(Boolean).join("/")}</span>
            <span>💼 ${vagas.filter((vaga) => vaga.status === "Aberta").length} vagas abertas</span>
          </div>

          <div class="hero-actions">
            ${whatsappButton("Contato da empresa", empresa.whatsapp, `Olá, vi a página da ${empresa.nome} no Prestador Pro.`, "primary")}
            ${button("Ver todas as empresas", "/empresas", "secondary")}
          </div>
        </div>

        <aside class="card detail-aside">
          <h3>Resumo da empresa</h3>
          <div class="tag-row">${statusTag(empresa.status)}</div>
          <div class="kv-grid">
            <div class="kv">
              <small>Região de atendimento</small>
              <strong>${empresa.regiaoAtendimento || "Consultar"}</strong>
            </div>
            <div class="kv">
              <small>Contato</small>
              <strong>${empresa.whatsapp || empresa.email || empresa.site || "Contato sob consulta"}</strong>
            </div>
            <div class="kv">
              <small>Vagas vinculadas</small>
              <strong>${vagas.length}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container grid grid-2">
        <article class="card">
          ${sectionHead("Segmentos", "")}
          ${tags(empresa.segmentos)}
        </article>
        <article class="card">
          ${sectionHead("Diferenciais", "")}
          ${list(empresa.diferenciais)}
        </article>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        ${sectionHead("Vagas desta empresa", "Oportunidades vinculadas a esta página pública.")}
        <div class="grid grid-3">
          ${vagas.length ? vagas.map((vaga) => vagaCard(vaga, empresa)).join("") : `<div class="state-card"><h3>Nenhuma vaga ativa</h3><p>Esta empresa ainda não possui vagas cadastradas.</p></div>`}
        </div>
      </div>
    </section>
  `;
}
