import { button, sectionHead, setSeo } from "../templates.js";

export function renderPrivacidade() {
  setSeo({
    title: "Privacidade",
    description: "Política simples de privacidade do Prestador Pro para o MVP estático."
  });

  return `
    <section class="detail-hero">
      <div class="container">
        <span class="eyebrow">Privacidade</span>
        <h1>Como os dados são usados nesta versão estática.</h1>
        <p class="lead">Este texto é um modelo operacional inicial. Revise com apoio jurídico antes de escalar.</p>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container legal-content">
        ${sectionHead("1. Dados publicados", "")}
        <p>O site pode exibir nome, função, cidade, estado, WhatsApp, descrição profissional, dados de empresa, vagas e imagens enviadas para divulgação.</p>

        ${sectionHead("2. Consentimento", "")}
        <p>Dados pessoais e contatos só devem ser adicionados aos arquivos JSON quando houver autorização do titular ou da empresa responsável.</p>

        ${sectionHead("3. Finalidade", "")}
        <p>Os dados são usados para divulgação pública, geração de contatos pelo WhatsApp e organização de prestadores, empresas e vagas.</p>

        ${sectionHead("4. Armazenamento", "")}
        <p>Nesta fase, os dados ficam em arquivos JSON locais dentro do repositório do projeto e são publicados como conteúdo estático no Cloudflare Pages.</p>

        ${sectionHead("5. Cliques em WhatsApp", "")}
        <p>O site registra localmente no navegador os últimos cliques em links de WhatsApp para teste operacional. Esse registro não é enviado para servidor próprio nesta versão.</p>

        ${sectionHead("6. Remoção de dados", "")}
        <p>O titular pode solicitar correção ou remoção dos dados publicados pelo canal de atendimento informado no site.</p>

        <div class="actions">
          ${button("Voltar para a home", "/", "secondary")}
          ${button("Ver termos", "/termos", "primary")}
        </div>
      </div>
    </section>
  `;
}
