import { button, sectionHead, setSeo, trustNotice } from "../templates.js";
import { CONFIG, whatsappUrl } from "../config.js";

export function renderComoFunciona() {
  setSeo({
    title: "Como funciona",
    description: "Entenda como o Prestador Pro divulga prestadores, empresas e vagas com contato direto pelo WhatsApp."
  });

  return `
    <section class="detail-hero">
      <div class="container detail-grid">
        <div>
          <span class="eyebrow">Como funciona</span>
          <h1>Uma vitrine curada para gerar contatos pelo WhatsApp.</h1>
          <p class="lead">
            O Prestador Pro não é um marketplace completo nesta fase. É uma vitrine profissional, simples e organizada
            para prestadores, empresas e vagas da construção civil.
          </p>
          <div class="hero-actions">
            ${button("Enviar solicitação", "#solicitar", "primary")}
            ${button("Falar no WhatsApp", whatsappUrl(CONFIG.mainWhatsApp, "Olá, quero entender como funciona o Prestador Pro."), "secondary", 'target="_blank" rel="noopener"')}
          </div>
        </div>

        <aside class="card detail-aside">
          <h3>O que entra no MVP</h3>
          <ul class="info-list">
            <li>Perfil ou página pública simples</li>
            <li>Divulgação com link compartilhável</li>
            <li>Contato direto pelo WhatsApp</li>
            <li>Atualização manual dos dados pelo responsável</li>
            <li>Sem login, sem pagamento online e sem intermediação</li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        ${sectionHead("Fluxo de atendimento", "O objetivo é publicar informações claras e gerar contato direto pelo WhatsApp.", "", "Atendimento")}
        <div class="grid grid-4">
          <article class="card">
            <span class="step-number">1</span>
            <h3>Você envia os dados</h3>
            <p>Nome, serviço, cidade, WhatsApp, descrição, vaga ou informações da empresa.</p>
          </article>
          <article class="card">
            <span class="step-number">2</span>
            <h3>O conteúdo é organizado</h3>
            <p>As informações são revisadas e transformadas em uma página ou divulgação clara.</p>
          </article>
          <article class="card">
            <span class="step-number">3</span>
            <h3>A página é publicada</h3>
            <p>O link fica disponível no site e pode ser compartilhado em grupos, status e redes sociais.</p>
          </article>
          <article class="card">
            <span class="step-number">4</span>
            <h3>O contato vem pelo WhatsApp</h3>
            <p>Clientes, candidatos ou empresas entram em contato diretamente com o responsável.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="solicitar">
      <div class="container">
        <div class="grid grid-2">
          <article class="card">
            ${sectionHead("Enviar solicitação", "Este formulário não salva dados no site. Ele monta uma mensagem para WhatsApp.", "", "Solicitação")}
            <form class="contact-form" data-whatsapp-form>
              <label for="solicitacao-tipo">
                <span class="field-label">Tipo de solicitação</span>
                <select class="select" id="solicitacao-tipo" name="tipo" required>
                  <option value="Cadastrar prestador">Cadastrar prestador</option>
                  <option value="Divulgar vaga">Divulgar vaga</option>
                  <option value="Criar página de empresa">Criar página de empresa</option>
                  <option value="Contratar serviço digital">Contratar serviço digital</option>
                </select>
              </label>
              <label for="solicitacao-nome">
                <span class="field-label">Nome</span>
                <input class="input" id="solicitacao-nome" name="nome" type="text" placeholder="Seu nome ou nome da empresa" required>
              </label>
              <label for="solicitacao-cidade">
                <span class="field-label">Cidade/Estado</span>
                <input class="input" id="solicitacao-cidade" name="cidade" type="text" placeholder="Ex: São Paulo/SP">
              </label>
              <label for="solicitacao-contato">
                <span class="field-label">Telefone ou WhatsApp</span>
                <span class="field-hint">Use o número em que deseja receber retorno.</span>
                <input class="input" id="solicitacao-contato" name="contato" type="text" placeholder="Ex: 11 99999-9999">
              </label>
              <label for="solicitacao-detalhes">
                <span class="field-label">Detalhes</span>
                <textarea class="input textarea" id="solicitacao-detalhes" name="detalhes" rows="5" placeholder="Descreva serviço, vaga, região ou objetivo."></textarea>
              </label>
              <button class="btn btn-primary" type="submit" data-submit-label="Enviar pelo WhatsApp">Enviar pelo WhatsApp</button>
            </form>
          </article>

          <article class="card">
            ${sectionHead("Importante", "", "", "Antes de publicar")}
            <ul class="info-list">
              <li>O cadastro é manual nesta fase.</li>
              <li>O Prestador Pro não intermedeia pagamento, contratação ou garantia do serviço.</li>
              <li>Dados de contato só devem ser publicados com autorização.</li>
              <li>Vagas podem mudar; confirme sempre com o responsável.</li>
            </ul>
            ${trustNotice("geral")}
          </article>
        </div>
      </div>
    </section>
  `;
}
