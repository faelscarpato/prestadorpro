/**
 * Utilities para slugs
 * Sanitiza, valida e normaliza slugs
 */

/**
 * Converte string em slug válido
 * Exemplo: "João da Silva" → "joao-da-silva"
 * @param {string} text - texto a converter
 * @returns {string} slug válido
 */
export function slugify(text) {
  if (!text) return "";

  return String(text)
    // Converter para minúsculas
    .toLowerCase()
    // Remover acentos
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Remover caracteres especiais (manter apenas letras, números, hífens)
    .replace(/[^a-z0-9\-\s]/g, "")
    // Substituir espaços por hífens
    .replace(/\s+/g, "-")
    // Remover hífens duplicados
    .replace(/-+/g, "-")
    // Remover hífens no início e fim
    .replace(/^-+|-+$/g, "");
}

/**
 * Valida se slug está em formato correto
 * @param {string} slug - slug a validar
 * @returns {boolean} true se válido
 */
export function isValidSlug(slug) {
  if (!slug) return false;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Sanitiza e valida slug, retornando resultado validado ou erro
 * @param {string} slug - slug a sanitizar
 * @returns {object} {valid: boolean, slug: string, error?: string}
 */
export function sanitizeSlug(slug) {
  const clean = slugify(slug);

  if (!clean) {
    return {
      valid: false,
      slug: "",
      error: "Slug não pode estar vazio"
    };
  }

  if (!isValidSlug(clean)) {
    return {
      valid: false,
      slug: clean,
      error: `Slug inválido: "${clean}" (use apenas letras minúsculas, números e hífens)`
    };
  }

  if (clean.length > 100) {
    return {
      valid: false,
      slug: clean.substring(0, 100),
      error: "Slug não pode ter mais de 100 caracteres"
    };
  }

  return {
    valid: true,
    slug: clean
  };
}

/**
 * Sugere um slug a partir de um nome
 * Útil para admin panel
 * @param {string} name - nome completo
 * @returns {object} {suggested: string, isValid: boolean}
 */
export function suggestSlug(name) {
  const suggested = slugify(name);
  return {
    suggested,
    isValid: isValidSlug(suggested)
  };
}

/**
 * Extrai slug da URL
 * Exemplo: "/prestador/joao-silva" → "joao-silva"
 * @param {string} pathname - window.location.pathname
 * @param {string} prefix - prefixo da rota (ex: "prestador")
 * @returns {string|null} slug ou null se não encontrado
 */
export function extractSlugFromUrl(pathname, prefix) {
  const pattern = new RegExp(`^/${prefix}/([^/]+)/?$`);
  const match = pathname.match(pattern);
  return match ? match[1] : null;
}

/**
 * Normaliza slug remascara hífens inválidos
 * @param {string} slug - slug a normalizar
 * @returns {string} slug normalizado
 */
export function normalizeSlug(slug) {
  return slugify(slug);
}
