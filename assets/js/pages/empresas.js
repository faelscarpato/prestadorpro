import { activeItems, getEmpresas, getVagas, sortItems } from "../data.js";
import { filterBySelect, getSearchBlob, includesText, uniqueSorted } from "../filters.js";
import { button, card, emptyState, escapeHtml as e, sectionHead, setSeo, statusTag, whatsappButton } from "../templates.js";

function empresaCard(empresa, vagas) {
  const linked = vagas.filter((vaga) => vaga.empresaSlug === empresa.slug && vaga.ativo !== false);
  const abertas = linked.filter((vaga) => vaga.status === "Aberta").length;
  const local = [empresa.cidade, empresa.estado].filter(Boolean).join("/");

  return card({
    title: empresa.nome,
    text: `${empresa.tipo} · ${local}. ${empresa.descricao}`,
    tags: [empresa.verificada ? "Verificada manualmente" : empresa.status, `${abertas} vagas abertas`].filter(Boolean),
    kicker: "Empresa cadastrada",
    className: "listing-card company-card",
    actions: `
      ${button("Ver empresa", `/empresa/${empresa.slug}`, "secondary")}
      ${button("Ver vagas", `/empresa/${empresa.slug}`, "primary")}
    `
  });
}

function renderFilters(empresas) {
  const cidades = uniqueSorted(empresas.map((item) => item.cidade));
  const tipos = uniqueSorted(empresas.map((item) => item.tipo));

  return `
    <div class="filters" data-empresas-filters>
      <label class="filter-field">
        <span class="field-label">Buscar empresa</span>
        <input class="input" type="search" aria-label="Buscar empresa por nome, cidade ou segmento" placeholder="Empresa, cidade ou segmento" data-search>
      </label>
      <label class="filter-field">
        <span class="field-label">Cidade</span>
        <select class="select" data-city>
          <option value="">Todas as cidades</option>
          ${cidades.map((city) => `<option value="${e(city)}">${e(city)}</option>`).join("")}
        </select>
      </label>
      <label class="filter-field">
        <span class="field-label">Tipo</span>
        <select class="select" data-type>
          <option value="">Todos os tipos</option>
          ${tipos.map((type) => `<option value="${e(type)}">${e(type)}</option>`).join("")}
        </select>
      </label>
      <button class="btn btn-secondary" type="button" data-clear disabled>Limpar filtros</button>
    </div>
  `;
}

export async function renderEmpresas() {
  setSeo({
    title: "Empresas",
    description: "Empresas, RHs, empreiteiras e contratantes com páginas públicas e vagas vinculadas."
  });

  const [empresasRaw, vagas] = await Promise.all([getEmpresas(), getVagas()]);
  const empresas = sortItems(activeItems(empresasRaw));

  setTimeout(() => bindEmpresasFilters(empresas, vagas), 0);

  return `
    <section class="detail-hero">
      <div class="container">
        <span class="eyebrow">Empresas e RHs</span>
        <h1>Empresas com vagas e oportunidades cadastradas.</h1>
        <p class="lead">Páginas públicas para agências, empreiteiras, construtoras e contratantes divulgarem vagas.</p>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        ${renderFilters(empresas)}
        <div class="result-bar">
          <span aria-live="polite"><strong data-result-count>${empresas.length}</strong> empresas encontradas</span>
        </div>
        <div class="grid grid-3" data-empresas-list>
          ${empresas.length ? empresas.map((empresa) => empresaCard(empresa, vagas)).join("") : emptyState("Nenhuma empresa cadastrada", "Cadastre a primeira empresa pelo JSON.")}
        </div>
      </div>
    </section>
  `;
}

function bindEmpresasFilters(empresas, vagas) {
  const root = document.querySelector("[data-empresas-filters]");
  const list = document.querySelector("[data-empresas-list]");
  const count = document.querySelector("[data-result-count]");
  if (!root || !list || !count) return;

  const search = root.querySelector("[data-search]");
  const city = root.querySelector("[data-city]");
  const type = root.querySelector("[data-type]");
  const clear = root.querySelector("[data-clear]");

  function apply() {
    const query = search.value;
    const selectedCity = city.value;
    const selectedType = type.value;
    clear.disabled = !(query || selectedCity || selectedType);

    const filtered = empresas.filter((empresa) => {
      const blob = getSearchBlob([
        empresa.nome,
        empresa.tipo,
        empresa.cidade,
        empresa.estado,
        empresa.regiaoAtendimento,
        empresa.descricao,
        empresa.segmentos,
        empresa.status
      ]);

      return includesText(blob, query)
        && filterBySelect(empresa.cidade, selectedCity)
        && filterBySelect(empresa.tipo, selectedType);
    });

    count.textContent = filtered.length;
    list.innerHTML = filtered.length
      ? filtered.map((empresa) => empresaCard(empresa, vagas)).join("")
      : emptyState("Nenhuma empresa encontrada", "Tente outra busca ou limpe os filtros.");
  }

  [search, city, type].forEach((input) => input.addEventListener("input", apply));
  clear.addEventListener("click", () => {
    search.value = "";
    city.value = "";
    type.value = "";
    apply();
  });
}
