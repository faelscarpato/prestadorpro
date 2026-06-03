import { bySlug, getEmpresas, getVagas } from "../data.js";
import { button, escapeHtml as e, list, notFoundPage, sectionHead, setSeo, statusTag, tag, trustNotice } from "../templates.js";
import { whatsappUrl } from "../config.js";

function contactButton(vaga, empresa) {
  const message = `Olá, vi a vaga de ${vaga.titulo} no Prestador Pro e quero me candidatar. Meu nome é:`;
  const whatsapp = vaga.contato?.whatsapp || empresa?.whatsapp;

  if (whatsapp) {
    return button("Candidatar agora", whatsappUrl(whatsapp, message), "primary", 'target="_blank" rel="noopener"');
  }

  const email = vaga.contato?.email || empresa?.email;
  if (email) {
    const subject = encodeURIComponent(`Candidatura para ${vaga.titulo}`);
    const body = encodeURIComponent(message);
    return button("Candidatar por e-mail", `mailto:${email}?subject=${subject}&body=${body}`, "primary");
  }

  return button("Ver outras vagas", "/vagas", "secondary");
}

export async function renderVaga(slug) {
  const [vagas, empresas] = await Promise.all([getVagas(), getEmpresas()]);
  const vaga = bySlug(vagas, slug);

  if (!vaga || vaga.ativo === false) {
    return notFoundPage("vaga");
  }

  const empresa = bySlug(empresas, vaga.empresaSlug);

  setSeo({
    title: vaga.titulo,
    description: `${vaga.titulo} em ${vaga.cidade}/${vaga.estado}. ${vaga.salario || ""}`
  });

  const local = [vaga.bairro, vaga.cidade, vaga.estado].filter(Boolean).join(" · ");

  return `
    <section class="detail-hero">
      <div class="container detail-grid">
        <div>
          <span class="eyebrow">Vaga de obra</span>
          <h1>${e(vaga.titulo)}</h1>
          <p class="lead">${e(empresa?.nome || "Empresa cadastrada")} · ${e(local)}</p>
          <div class="tag-row">
            ${statusTag(vaga.status)}
            ${[vaga.funcao, vaga.categoria, vaga.regime].filter(Boolean).map((item) => tag(item)).join("")}
          </div>

          <div class="hero-actions">
            ${contactButton(vaga, empresa)}
            ${button("Ver todas as vagas", "/vagas", "secondary")}
          </div>
          ${trustNotice("vaga")}
        </div>

        <aside class="card detail-aside">
          <h3>Resumo da vaga</h3>
          <div class="kv-grid">
            <div class="kv">
              <small>Salário</small>
              <strong>${e(vaga.salario || "A combinar")}</strong>
            </div>
            <div class="kv">
              <small>Regime</small>
              <strong>${e(vaga.regime || "Consultar")}</strong>
            </div>
            <div class="kv">
              <small>Tipo de contrato</small>
              <strong>${e(vaga.tipoContrato || "Consultar")}</strong>
            </div>
            <div class="kv">
              <small>Publicação</small>
              <strong>${e(vaga.dataPublicacao || "Data não informada")}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container grid grid-2">
        <article class="card">
          ${sectionHead("Atividades", "", "", "Rotina")}
          ${list(vaga.atividades)}
        </article>
        <article class="card">
          ${sectionHead("Requisitos", "", "", "Perfil")}
          ${list(vaga.requisitos)}
        </article>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container grid grid-2">
        <article class="card">
          ${sectionHead("Benefícios", "", "", "Pacote")}
          ${list(vaga.beneficios)}
        </article>
        <article class="card">
          ${sectionHead("Horário e contato", "", "", "Contato")}
          <div class="kv-grid">
            <div class="kv">
              <small>Horário</small>
              <strong>${e(vaga.horario || "Consultar")}</strong>
            </div>
            <div class="kv">
              <small>Contato</small>
              <strong>${e(vaga.contato?.nome || empresa?.nome || "Responsável pela vaga")}</strong>
            </div>
            <div class="kv">
              <small>Empresa</small>
              <strong>${empresa ? `<a href="/empresa/${e(empresa.slug)}" data-link>${e(empresa.nome)}</a>` : "Empresa não encontrada"}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>

    ${vaga.observacoes ? `
      <section class="section section-tight">
        <div class="container">
          <div class="notice">${e(vaga.observacoes)}</div>
        </div>
      </section>
    ` : ""}
  `;
}
