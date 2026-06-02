import { loadingState, notFoundPage, errorState } from "./templates.js";
import { renderHome } from "./pages/home.js";
import { renderServico } from "./pages/servico.js";
import { renderPrestadores } from "./pages/prestadores.js";
import { renderPrestador } from "./pages/prestador.js";
import { renderEmpresas } from "./pages/empresas.js";
import { renderEmpresa } from "./pages/empresa.js";
import { renderVagas } from "./pages/vagas.js";
import { renderVaga } from "./pages/vaga.js";

const serviceRoutes = new Set([
  "kit-divulgacao",
  "cartao-digital",
  "radar-vagas",
  "banco-prestadores",
  "curriculo-obra",
  "portfolio-tecnico"
]);

export async function route() {
  const app = document.querySelector("#app");
  const path = normalizePath(window.location.pathname);

  app.innerHTML = loadingState();

  try {
    let html = "";

    if (path === "/") {
      html = await renderHome();
    } else if (path === "/prestadores") {
      html = await renderPrestadores();
    } else if (path.startsWith("/prestador/")) {
      html = await renderPrestador(path.split("/")[2]);
    } else if (path === "/empresas") {
      html = await renderEmpresas();
    } else if (path.startsWith("/empresa/")) {
      html = await renderEmpresa(path.split("/")[2]);
    } else if (path === "/vagas") {
      html = await renderVagas();
    } else if (path.startsWith("/vaga/")) {
      html = await renderVaga(path.split("/")[2]);
    } else if (serviceRoutes.has(path.slice(1))) {
      html = await renderServico(path.slice(1));
    } else {
      html = notFoundPage();
    }

    app.innerHTML = html;
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    setActiveNav(path);
  } catch (error) {
    console.error(error);
    app.innerHTML = errorState("Erro ao carregar página", "Verifique se os arquivos JSON estão válidos e publicados corretamente.");
  }
}

function normalizePath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return path;
}

export function navigateTo(path) {
  window.history.pushState({}, "", path);
  route();
}

export function bindNavigation() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-link]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    event.preventDefault();
    navigateTo(href);
    closeMobileNav();
  });

  window.addEventListener("popstate", route);
}

function setActiveNav(path) {
  document.querySelectorAll(".main-nav a[data-link]").forEach((link) => {
    const href = normalizePath(link.getAttribute("href"));
    const isActive = href === "/" ? path === "/" : path.startsWith(href);
    link.classList.toggle("is-active", isActive);
  });
}

export function closeMobileNav() {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  document.body.classList.remove("nav-open");
  nav?.classList.remove("is-open");
  toggle?.setAttribute("aria-expanded", "false");
}
