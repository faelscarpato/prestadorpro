export function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function includesText(source, query) {
  if (!query) return true;
  return normalizeText(source).includes(normalizeText(query));
}

export function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
}

export function getSearchBlob(parts) {
  return parts
    .filter(Boolean)
    .map((part) => {
      if (Array.isArray(part)) return part.join(" ");
      if (typeof part === "object") return Object.values(part).join(" ");
      return String(part);
    })
    .join(" ");
}

export function filterBySelect(value, selected) {
  if (!selected) return true;
  return normalizeText(value) === normalizeText(selected);
}
