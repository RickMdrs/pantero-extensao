// Lê os dados do produto direto do DOM da página aberta.
// Responde ao popup via runtime.onMessage.

function txt(sel) {
  const el = document.querySelector(sel);
  return el ? el.textContent.trim().replace(/\s+/g, " ") : null;
}

function attr(sel, name) {
  const el = document.querySelector(sel);
  return el ? el.getAttribute(name) : null;
}

function lerAmazon() {
  const titulo = txt("#productTitle") || txt("#title");
  const preco =
    txt(".a-price:not(.a-text-price) .a-offscreen") ||
    txt("#corePrice_feature_div .a-offscreen") ||
    txt("#priceblock_ourprice");
  const precoAntigo =
    txt(".basisPrice .a-offscreen") ||
    txt("span.a-price.a-text-price .a-offscreen");
  const imagem =
    attr("#landingImage", "data-old-hires") ||
    attr("#landingImage", "src") ||
    attr("#imgTagWrapperId img", "src");
  return { titulo, preco, precoAntigo, imagem };
}

function precoML(sel) {
  const wrap = document.querySelector(sel);
  if (!wrap) return null;
  const int = wrap.querySelector(".andes-money-amount__fraction");
  const cent = wrap.querySelector(".andes-money-amount__cents");
  if (!int) return null;
  return `R$ ${int.textContent.trim()}${cent ? "," + cent.textContent.trim() : ""}`;
}

function lerMercadoLivre() {
  const titulo = txt("h1.ui-pdp-title");
  const preco = precoML(".ui-pdp-price__second-line");
  const precoAntigo = precoML(".andes-money-amount--previous");
  const imagem =
    attr(".ui-pdp-gallery__figure img", "src") ||
    attr("figure.ui-pdp-gallery__figure img", "data-zoom");
  return { titulo, preco, precoAntigo, imagem };
}

function lerProduto() {
  const host = location.hostname;
  if (host.includes("amazon")) return lerAmazon();
  if (host.includes("mercadolivre") || host.includes("mercadolibre"))
    return lerMercadoLivre();
  return { titulo: null, preco: null, precoAntigo: null, imagem: null };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.tipo === "LER_PRODUTO") {
    const dados = lerProduto();
    sendResponse({ url: location.href, ...dados });
  }
  return true;
});
