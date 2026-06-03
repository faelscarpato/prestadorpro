import { button, sectionHead, setSeo } from "../templates.js";

export function renderTermos() {
  setSeo({
    title: "Termos de uso",
    description: "Termos simples de uso do Prestador Pro para prestadores, empresas, candidatos e visitantes."
  });

  return `
    <section class="detail-hero">
      <div class="container">
        <span class="eyebrow">Termos de uso</span>
        <h1>Regras simples para uso da vitrine Prestador Pro.</h1>
        <p class="lead">Este texto é um modelo inicial para MVP. Antes de escalar a operação, revise com apoio jurídico.</p>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container legal-content">
        ${sectionHead("1. Natureza do serviço", "")}
        <p>O Prestador Pro é uma vitrine digital para divulgação de prestadores, empresas e vagas da construção civil, com foco em contato direto pelo WhatsApp.</p>

        ${sectionHead("2. Sem intermediação", "")}
        <p>O site não intermedeia pagamentos, contratos, entrevistas, garantias, execução de serviços ou relação trabalhista. Toda negociação deve ser confirmada diretamente entre as partes.</p>

        ${sectionHead("3. Dados publicados", "")}
        <p>Prestadores e empresas devem fornecer apenas dados verdadeiros e autorizados para publicação, incluindo nome, cidade, WhatsApp, descrição, imagens e informações de vaga.</p>

        ${sectionHead("4. Vagas e oportunidades", "")}
        <p>As vagas podem ser alteradas, pausadas ou encerradas sem aviso prévio. Candidatos devem confirmar requisitos, salário, benefícios, local e status diretamente com o responsável.</p>

        ${sectionHead("5. Remoção e atualização", "")}
        <p>O titular dos dados pode solicitar correção, atualização ou remoção das informações publicadas pelo canal de atendimento do Prestador Pro.</p>

        ${sectionHead("6. Uso indevido", "")}
        <p>Conteúdos falsos, ofensivos, ilegais, discriminatórios ou sem autorização podem ser removidos manualmente.</p>

        <div class="actions">
          ${button("Voltar para a home", "/", "secondary")}
          ${button("Ver privacidade", "/privacidade", "primary")}
        </div>
      </div>
    </section>
  `;
}
