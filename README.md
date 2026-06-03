# Prestador Pro

Site estático de serviços digitais, banco de prestadores, empresas e vagas para construção civil.

## Posicionamento

O Prestador Pro é um **MVP estático de validação comercial**. Ele deve ser tratado como uma vitrine curada com geração de contato pelo WhatsApp, não como marketplace completo.

Promessa central:

> Ajudar prestadores e empresas da construção civil a terem presença digital simples e gerar contatos pelo WhatsApp.

## Stack

- HTML5
- CSS3
- JavaScript Vanilla com módulos ES
- JSON local
- GitHub
- Cloudflare Pages

Sem Supabase, sem backend, sem login, sem painel administrativo e sem build obrigatório.

## Estrutura

```txt
/
├─ index.html
├─ _redirects
├─ _headers
├─ README.md
├─ assets/
│  ├─ css/styles.css
│  ├─ js/
│  │  ├─ app.js
│  │  ├─ router.js
│  │  ├─ data.js
│  │  ├─ config.js
│  │  ├─ templates.js
│  │  ├─ filters.js
│  │  └─ pages/
│  └─ img/
└─ data/
   ├─ servicos.json
   ├─ prestadores.json
   ├─ empresas.json
   └─ vagas.json
```

## Como publicar no Cloudflare Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste projeto para o repositório.
3. No Cloudflare Pages, conecte o repositório.
4. Configure:
   - Build command: deixe vazio.
   - Output directory: `/` ou raiz do projeto.
5. Publique.
6. Teste rotas diretas como `/vagas`, `/prestadores`, `/como-funciona` e `/vaga/pedreiro-obras-interlagos-sp`.

## Como atualizar dados

Edite os arquivos JSON dentro da pasta `data/`:

- `data/servicos.json`
- `data/prestadores.json`
- `data/empresas.json`
- `data/vagas.json`

Depois faça commit e push no GitHub. O Cloudflare Pages publica a nova versão automaticamente.

## Regras importantes

- Não use acentos, espaços ou letras maiúsculas em slugs.
- Cada `slug` deve ser único dentro do mesmo arquivo.
- Em vagas, `empresaSlug` deve existir em `empresas.json`.
- Para remover uma vaga da vitrine, prefira alterar `status` para `Encerrada` ou `ativo` para `false`.
- Comprima imagens antes de enviar para `assets/img/`.
- Publique dados pessoais e WhatsApp apenas com autorização do titular.
- Use `verificado` em prestadores e `verificada` em empresas apenas quando houver conferência manual.

## Rotas

```txt
/
 /como-funciona
 /termos
 /privacidade

/kit-divulgacao
/cartao-digital
/radar-vagas
/banco-prestadores
/curriculo-obra
/portfolio-tecnico

/prestadores
/prestador/{slug}

/empresas
/empresa/{slug}

/vagas
/vaga/{slug}
```

## Personalização rápida

Edite `assets/js/config.js` para trocar:

- telefone principal de WhatsApp;
- nome do produto;
- descrição;
- cidade padrão;
- mensagens comerciais.

## Rastreamento simples de WhatsApp

Esta versão registra localmente no navegador os últimos cliques em links de WhatsApp usando `localStorage`.

Chave usada:

```txt
prestadorpro:whatsappClicks
```

Também é disparado um evento JS:

```txt
prestadorpro:whatsapp-click
```

Isso não envia dados para servidor. Para Analytics, Tag Manager, Pixel ou ferramenta externa, integre depois no `bindWhatsAppTracking()` em `assets/js/app.js`.

## Formulário sem backend

A página `/como-funciona` possui um formulário simples que não salva dados. Ele apenas monta uma mensagem e abre o WhatsApp do responsável.

## SEO e compartilhamento

Esta é uma SPA estática. Título e descrição mudam via JavaScript para quem navega no site, mas prévias de WhatsApp, Facebook e buscadores podem mostrar metadados genéricos da home.

Para uma próxima versão, considere gerar páginas HTML estáticas por prestador, empresa e vaga.

## Observações

Este projeto é um MVP estático. Ele não possui cadastro automático, painel, login, upload ou banco de dados externo. A edição é manual via JSON.
