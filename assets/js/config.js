export const CONFIG = {
  productName: "Prestador Pro",
  brandName: "Rafa Design & IA",
  siteDescription: "Vitrine digital para divulgar prestadores, empresas e vagas da construção civil.",
  mainWhatsApp: "5511975047060",
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
