import { bindNavigation, route, closeMobileNav } from "./router.js";
import { CONFIG, whatsappUrl } from "./config.js";

function bindMenu() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });
}

function bindWhatsAppTracking() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href*="wa.me"]');
    if (!link) return;

    const payload = {
      at: new Date().toISOString(),
      path: window.location.pathname,
      label: link.textContent.trim(),
      href: link.href
    };

    try {
      const key = "prestadorpro:whatsappClicks";
      const previous = JSON.parse(localStorage.getItem(key) || "[]");
      previous.push(payload);
      localStorage.setItem(key, JSON.stringify(previous.slice(-100)));
    } catch (error) {
      console.warn("Não foi possível registrar o clique localmente.", error);
    }

    window.dispatchEvent(new CustomEvent("prestadorpro:whatsapp-click", { detail: payload }));
    console.info("[Prestador Pro] Clique WhatsApp", payload);
  });
}

function bindWhatsAppForms() {
  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-whatsapp-form]");
    if (!form) return;

    event.preventDefault();

    const data = new FormData(form);
    const tipo = data.get("tipo") || "Solicitação";
    const nome = data.get("nome") || "";
    const cidade = data.get("cidade") || "";
    const contato = data.get("contato") || "";
    const detalhes = data.get("detalhes") || "";
    const submitButton = form.querySelector('button[type="submit"]');
    const submitLabel = submitButton?.dataset.submitLabel || submitButton?.textContent || "Enviar";

    const message = [
      `Olá, vim pelo Prestador Pro e quero enviar uma solicitação.`,
      `Tipo: ${tipo}`,
      nome ? `Nome: ${nome}` : "",
      cidade ? `Cidade: ${cidade}` : "",
      contato ? `Contato: ${contato}` : "",
      detalhes ? `Detalhes: ${detalhes}` : ""
    ].filter(Boolean).join("\n");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Abrindo WhatsApp...";
    }

    window.open(whatsappUrl(CONFIG.mainWhatsApp, message), "_blank", "noopener");

    window.setTimeout(() => {
      if (!submitButton) return;
      submitButton.disabled = false;
      submitButton.textContent = submitLabel;
    }, 1200);
  });
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

bindNavigation();
bindMenu();
bindWhatsAppTracking();
bindWhatsAppForms();
setYear();
route();
