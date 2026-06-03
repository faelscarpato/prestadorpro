import { bySlug, getServices } from "../data.js";
import { CONFIG, whatsappUrl } from "../config.js";
import { button, escapeHtml as e, list, notFoundPage, safeUrl, sectionHead, setSeo, tags, whatsappButton } from "../templates.js";

export async function renderServico(slug) {
  const services = await getServices();
  const service = bySlug(services, slug);

  if (!service || service.ativo === false) {
    return notFoundPage("serviço");
  }

  setSeo({
    title: service.nome,
    description: service.subtitulo
  });

  const message = `Olá, vim pelo Prestador Pro e quero contratar: ${service.nome}.`;
  const image = safeUrl(service.imagem, "");

  return `
    <section class="detail-hero">
      <div class="container detail-grid">
        <div>
          <span class="eyebrow">Serviço digital</span>
          <h1>${e(service.nome)}</h1>
          <p class="lead">${e(service.subtitulo)}</p>
          ${tags([service.publicoAlvo])}
          <div class="hero-actions">
            ${whatsappButton(service.ctaTexto || "Pedir no WhatsApp", CONFIG.mainWhatsApp, message, "primary")}
            ${button("Voltar para a home", "/", "secondary")}
          </div>
        </div>

        <aside class="card detail-aside">
          ${image ? `<div class="card-image"><img src="${e(image)}" alt="${e(service.nome)}" loading="lazy"></div>` : ""}
          <h3>Oferta</h3>
          <p class="price">${e(service.preco || "Preço sob consulta")}</p>
          ${service.precoAlternativo ? `<p>${e(service.precoAlternativo)}</p>` : ""}
          <div class="card-actions">
            ${button("Chamar no WhatsApp", whatsappUrl(CONFIG.mainWhatsApp, message), "primary", 'target="_blank" rel="noopener"')}
          </div>
        </aside>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container grid grid-2">
        <article class="card">
          ${sectionHead("Benefícios", "", "", "Entrega")}
          ${list(service.beneficios)}
        </article>

        <article class="card">
          ${sectionHead("Como funciona", "", "", "Processo")}
          ${list(service.comoFunciona)}
        </article>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <span class="eyebrow">Próximo passo</span>
            <h2>Quer vender ou divulgar com aparência mais profissional?</h2>
            <p>Envie os dados básicos pelo WhatsApp e receba orientação sobre o melhor formato para seu caso.</p>
          </div>
          ${button("Solicitar agora", whatsappUrl(CONFIG.mainWhatsApp, message), "primary", 'target="_blank" rel="noopener"')}
        </div>
      </div>
    </section>
  `;
}
