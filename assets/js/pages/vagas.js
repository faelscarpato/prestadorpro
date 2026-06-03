import { activeItems, getEmpresas, getVagas, sortItems } from "../data.js";
import { filterBySelect, getSearchBlob, includesText, uniqueSorted } from "../filters.js";
import { button, card, emptyState, escapeHtml as e, sectionHead, setSeo, whatsappButton } from "../templates.js";

function vagaCard(vaga, empresa) {
  const local = [vaga.bairro, vaga.cidade, vaga.estado].filter(Boolean).join(" · ");
  const message = `Olá, vi a vaga de ${vaga.titulo} no Prestador Pro e quero me candidatar. Meu nome é:`;

  return card({
    title: vaga.titulo,
    text: `${empresa?.nome || "Empresa"} · ${local}. ${vaga.tipoContrato || ""}`,
    price: vaga.salario || "Salário a combinar",
    tags: [vaga.funcao, vaga.categoria, vaga.status].filter(Boolean),
    kicker: "Vaga aberta",
    className: "listing-card job-card",
    actions: `
      ${button("Ver detalhes", `/vaga/${vaga.slug}`, "secondary")}
      ${whatsappButton("Candidatar agora", vaga.contato?.whatsapp || empresa?.whatsapp, message, "primary")}
    `
  });
}

function renderFilters(vagas) {
  const cidades = uniqueSorted(vagas.map((item) => item.cidade));
  const funcoes = uniqueSorted(vagas.map((item) => item.funcao));
  const categorias = uniqueSorted(vagas.map((item) => item.categoria));

  return `
    <div class="filters" data-vagas-filters>
      <label class="filter-field">
        <span class="field-label">Buscar vaga</span>
        <input class="input" type="search" aria-label="Buscar vaga por título, empresa, cidade ou função" placeholder="Vaga, empresa, cidade ou função" data-search>
      </label>
      <label class="filter-field">
        <span class="field-label">Cidade</span>
        <select class="select" data-city>
          <option value="">Todas as cidades</option>
          ${cidades.map((city) => `<option value="${e(city)}">${e(city)}</option>`).join("")}
        </select>
      </label>
      <label class="filter-field">
        <span class="field-label">Função</span>
        <select class="select" data-role>
          <option value="">Todas as funções</option>
          ${funcoes.map((role) => `<option value="${e(role)}">${e(role)}</option>`).join("")}
        </select>
      </label>
      <label class="filter-field">
        <span class="field-label">Categoria</span>
        <select class="select" data-category>
          <option value="">Todas as categorias</option>
          ${categorias.map((category) => `<option value="${e(category)}">${e(category)}</option>`).join("")}
        </select>
      </label>
    </div>
  `;
}

export async function renderVagas() {
  setSeo({
    title: "Radar de Vagas",
    description: "Vagas da construção civil com busca por cidade, função, categoria, empresa e status."
  });

  const [vagasRaw, empresas] = await Promise.all([getVagas(), getEmpresas()]);
  const vagas = sortItems(activeItems(vagasRaw));

  setTimeout(() => bindVagasFilters(vagas, empresas), 0);

  return `
    <section class="detail-hero">
      <div class="container">
        <span class="eyebrow">Radar de Vagas</span>
        <h1>Vagas de obra organizadas para candidatura rápida.</h1>
        <p class="lead">Busque por cidade, função, empresa, categoria ou tipo de contrato. Clique em candidatar para abrir o WhatsApp com mensagem pronta.</p>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        ${renderFilters(vagas)}
        <div class="result-bar">
          <span aria-live="polite"><strong data-result-count>${vagas.length}</strong> vagas encontradas</span>
          <button class="btn btn-small btn-secondary" type="button" data-clear disabled>Limpar filtros</button>
        </div>
        <div class="grid grid-3" data-vagas-list>
          ${vagas.length ? vagas.map((vaga) => vagaCard(vaga, empresas.find((empresa) => empresa.slug === vaga.empresaSlug))).join("") : emptyState("Nenhuma vaga cadastrada", "Cadastre a primeira vaga pelo JSON.")}
        </div>
      </div>
    </section>
  `;
}

function bindVagasFilters(vagas, empresas) {
  const root = document.querySelector("[data-vagas-filters]");
  const list = document.querySelector("[data-vagas-list]");
  const count = document.querySelector("[data-result-count]");
  const clear = document.querySelector("[data-clear]");
  if (!root || !list || !count) return;

  const search = root.querySelector("[data-search]");
  const city = root.querySelector("[data-city]");
  const role = root.querySelector("[data-role]");
  const category = root.querySelector("[data-category]");

  function getEmpresa(vaga) {
    return empresas.find((empresa) => empresa.slug === vaga.empresaSlug);
  }

  function apply() {
    const query = search.value;
    const selectedCity = city.value;
    const selectedRole = role.value;
    const selectedCategory = category.value;
    if (clear) clear.disabled = !(query || selectedCity || selectedRole || selectedCategory);

    const filtered = vagas.filter((vaga) => {
      const empresa = getEmpresa(vaga);
      const blob = getSearchBlob([
        vaga.titulo,
        empresa?.nome,
        vaga.funcao,
        vaga.servico,
        vaga.categoria,
        vaga.cidade,
        vaga.estado,
        vaga.bairro,
        vaga.tipoContrato,
        vaga.regime,
        vaga.status,
        vaga.salario
      ]);

      return includesText(blob, query)
        && filterBySelect(vaga.cidade, selectedCity)
        && filterBySelect(vaga.funcao, selectedRole)
        && filterBySelect(vaga.categoria, selectedCategory);
    });

    count.textContent = filtered.length;
    list.innerHTML = filtered.length
      ? filtered.map((vaga) => vagaCard(vaga, getEmpresa(vaga))).join("")
      : emptyState("Nenhuma vaga encontrada", "Tente outra busca ou limpe os filtros.");
  }

  [search, city, role, category].forEach((input) => input.addEventListener("input", apply));
  clear?.addEventListener("click", () => {
    search.value = "";
    city.value = "";
    role.value = "";
    category.value = "";
    apply();
  });
}
