# Prestador Pro

Site estático de serviços digitais, banco de prestadores, empresas e vagas para construção civil.

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
6. Teste rotas diretas como `/vagas`, `/prestadores` e `/vaga/pedreiro-obras-interlagos-sp`.

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

## Rotas

```txt
/
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

## Observações

Este projeto é um MVP estático. Ele não possui cadastro automático, painel, login, upload ou banco de dados externo. A edição é manual via JSON.
