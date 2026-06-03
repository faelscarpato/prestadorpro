// Em HTML estatico puro, import.meta.env nao existe. Mantemos suporte a Vite
// sem quebrar Cloudflare Pages estatico e permitimos override por script global.
const runtimeConfig = globalThis.__PRESTADOR_PRO_CONFIG__ || {};
const mainWhatsAppFromEnv = import.meta.env?.VITE_MAIN_WHATSAPP;
const mainWhatsApp = runtimeConfig.mainWhatsApp || mainWhatsAppFromEnv || "5519995466902";

export const CONFIG = {
  productName: "Prestador Pro",
  brandName: "Rafa Design & IA",
  siteDescription: "Vitrine digital para divulgar prestadores, empresas e vagas da construção civil.",
  mainWhatsApp,
  defaultCity: "São Paulo",
  defaultState: "SP",
  urls: {
    home: "/",
    prestadores: "/prestadores",
    empresas: "/empresas",
    vagas: "/vagas"
  }
};

export function whatsappUrl(number, message) {
  const cleanNumber = String(number || CONFIG.mainWhatsApp).replace(/\D/g, "");
  const encoded = encodeURIComponent(message || "Olá, vim pelo Prestador Pro e quero saber mais.");
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}
