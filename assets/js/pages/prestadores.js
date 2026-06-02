import { activeItems, getPrestadores, sortItems } from "../data.js";
import { filterBySelect, getSearchBlob, includesText, uniqueSorted } from "../filters.js";
import { button, card, emptyState, sectionHead, setSeo, whatsappButton } from "../templates.js";

function prestadorCard(prestador) {
  const local = [prestador.cidade, prestador.estado].filter(Boolean).join("/");
  const message = `Olá, vi seu perfil no Prestador Pro e quero solicitar um orçamento.`;

  return card({
    title: prestador.nome,
    text: `${prestador.titulo} · ${local}. ${prestador.chamada}`,
    tags: [prestador.categoria, prestador.status].filter(Boolean),
    actions: `
      ${button("Ver portfólio", `/prestador/${prestador.slug}`, "secondary")}
      ${whatsappButton("WhatsApp", prestador.whatsapp, message, "primary")}
    `
  });
}

function renderFilters(prestadores) {
  const cidades = uniqueSorted(prestadores.map((item) => item.cidade));
  const categorias = uniqueSorted(prestadores.map((item) => item.categoria));

  return `
    <div class="filters" data-prestadores-filters>
      <input class="input" type="search" placeholder="Buscar por nome, serviço, cidade..." data-search>
      <select class="select" data-city>
        <option value="">Todas as cidades</option>
        ${cidades.map((city) => `<option value="${city}">${city}</option>`).join("")}
      </select>
      <select class="select" data-category>
        <option value="">Todas as categorias</option>
        ${categorias.map((category) => `<option value="${category}">${category}</option>`).join("")}
      </select>
      <button class="btn btn-secondary" type="button" data-clear>Limpar</button>
    </div>
  `;
}

export async function renderPrestadores() {
  setSeo({
    title: "Banco de Prestadores",
    description: "Encontre prestadores de serviço da construção civil com páginas profissionais e contato direto."
  });

  const prestadores = sortItems(activeItems(await getPrestadores()));

  setTimeout(() => bindPrestadoresFilters(prestadores), 0);

  return `
    <section class="detail-hero">
      <div class="container">
        <span class="eyebrow">Banco de Prestadores</span>
        <h1>Profissionais cadastrados para orçamento e contratação.</h1>
        <p class="lead">Veja perfis com serviços, diferenciais, experiência, cursos, portfólio e WhatsApp direto.</p>
      </div>
    </section>

    <section class="section section-tight">
      <div class="container">
        ${renderFilters(prestadores)}
        <div class="result-bar">
          <span><strong data-result-count>${prestadores.length}</strong> prestadores encontrados</span>
        </div>
        <div class="grid grid-3" data-prestadores-list>
          ${prestadores.length ? prestadores.map(prestadorCard).join("") : emptyState("Nenhum prestador cadastrado", "Cadastre o primeiro profissional pelo JSON.")}
        </div>
      </div>
    </section>
  `;
}

function bindPrestadoresFilters(prestadores) {
  const root = document.querySelector("[data-prestadores-filters]");
  const list = document.querySelector("[data-prestadores-list]");
  const count = document.querySelector("[data-result-count]");
  if (!root || !list || !count) return;

  const search = root.querySelector("[data-search]");
  const city = root.querySelector("[data-city]");
  const category = root.querySelector("[data-category]");
  const clear = root.querySelector("[data-clear]");

  function apply() {
    const query = search.value;
    const selectedCity = city.value;
    const selectedCategory = category.value;

    const filtered = prestadores.filter((prestador) => {
      const blob = getSearchBlob([
        prestador.nome,
        prestador.titulo,
        prestador.categoria,
        prestador.tags,
        prestador.cidade,
        prestador.estado,
        prestador.regiaoAtendimento,
        prestador.chamada,
        prestador.servicos,
        prestador.diferenciais,
        prestador.status
      ]);

      return includesText(blob, query)
        && filterBySelect(prestador.cidade, selectedCity)
        && filterBySelect(prestador.categoria, selectedCategory);
    });

    count.textContent = filtered.length;
    list.innerHTML = filtered.length
      ? filtered.map(prestadorCard).join("")
      : emptyState("Nenhum prestador encontrado", "Tente outra busca ou limpe os filtros.");
  }

  [search, city, category].forEach((input) => input.addEventListener("input", apply));
  clear.addEventListener("click", () => {
    search.value = "";
    city.value = "";
    category.value = "";
    apply();
  });
}
