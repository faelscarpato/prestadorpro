const cache = new Map();

async function loadJson(path) {
  if (cache.has(path)) return cache.get(path);

  const response = await fetch(path, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`Erro ao carregar ${path}`);
  }

  const data = await response.json();
  const items = Array.isArray(data) ? data : data.items || [];
  cache.set(path, items);
  return items;
}

export function getServices() {
  return loadJson("./data/servicos.json");
}

export function getPrestadores() {
  return loadJson("./data/prestadores.json");
}

export function getEmpresas() {
  return loadJson("./data/empresas.json");
}

export function getVagas() {
  return loadJson("./data/vagas.json");
}

export async function getAllData() {
  const [services, prestadores, empresas, vagas] = await Promise.all([
    getServices(),
    getPrestadores(),
    getEmpresas(),
    getVagas()
  ]);

  return { services, prestadores, empresas, vagas };
}

export function bySlug(items, slug) {
  return items.find((item) => item.slug === slug);
}

export function activeItems(items) {
  return items.filter((item) => item.ativo !== false);
}

export function sortItems(items) {
  return [...items].sort((a, b) => {
    const orderA = Number.isFinite(Number(a.ordem)) ? Number(a.ordem) : 9999;
    const orderB = Number.isFinite(Number(b.ordem)) ? Number(b.ordem) : 9999;

    if (orderA !== orderB) return orderA - orderB;

    if (a.dataPublicacao || b.dataPublicacao) {
      return String(b.dataPublicacao || "").localeCompare(String(a.dataPublicacao || ""));
    }

    return String(a.nome || a.titulo || "").localeCompare(String(b.nome || b.titulo || ""), "pt-BR");
  });
}
