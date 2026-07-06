// Lê os dados do produto direto do DOM da página aberta.
// Responde ao popup via runtime.onMessage.

function txt(sel) {
  const el = document.querySelector(sel);
  return el ? el.textContent.trim().replace(/\s+/g, " ") : null;
}

// Primeiro elemento com texto NÃO-vazio (Amazon tem .a-offscreen em branco antes do preço real).
function txtFirst(sel) {
  for (const el of document.querySelectorAll(sel)) {
    const t = el.textContent.trim().replace(/\s+/g, " ");
    if (t) return t;
  }
  return null;
}

function attr(sel, name) {
  const el = document.querySelector(sel);
  return el ? el.getAttribute(name) : null;
}

function lerAmazon() {
  const titulo = txt("#productTitle") || txt("#title");
  const preco =
    txtFirst("#corePriceDisplay_desktop_feature_div .a-price:not(.a-text-price) .a-offscreen") ||
    txtFirst(".a-price:not(.a-text-price) .a-offscreen") ||
    txtFirst("#corePrice_feature_div .a-offscreen") ||
    txt("#priceblock_ourprice");
  const precoAntigo =
    txtFirst(".basisPrice .a-offscreen") ||
    txtFirst("span.a-price.a-text-price .a-offscreen");
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

function metaProp(prop) {
  const el = document.querySelector(`meta[property="${prop}"]`);
  return el ? el.getAttribute("content") : null;
}

// Acha o objeto Product no JSON-LD da página (formato padrão de e-commerce).
function jsonLdProduto() {
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(s.textContent);
      const arr = Array.isArray(data) ? data : data["@graph"] || [data];
      for (const it of arr) {
        const t = it && it["@type"];
        if (t === "Product" || (Array.isArray(t) && t.includes("Product"))) return it;
      }
    } catch {}
  }
  return null;
}

function precoBR(v) {
  if (v == null) return null;
  return `R$ ${String(v).replace(".", ",")}`;
}

function lerMagalu() {
  const ld = jsonLdProduto();

  let titulo = (ld && ld.name) || metaProp("og:title") || txt('h1[data-testid="heading-product-title"]');
  if (titulo) titulo = titulo.replace(/\s*[|\-]\s*(Magazine Luiza|Magalu).*$/i, "").trim();

  let imagem = ld && ld.image ? (Array.isArray(ld.image) ? ld.image[0] : ld.image) : null;
  imagem = imagem || metaProp("og:image");

  const offers = ld && ld.offers;
  const off = Array.isArray(offers) ? offers[0] : offers;
  let preco = off && off.price ? precoBR(off.price) : null;
  preco = preco || precoBR(metaProp("product:price:amount")) || txt('[data-testid="price-value"]');

  const precoAntigo = txt('[data-testid="price-original"]');
  return { titulo, preco, precoAntigo, imagem };
}

function lerProduto() {
  const host = location.hostname;
  if (host.includes("amazon")) return lerAmazon();
  if (host.includes("mercadolivre") || host.includes("mercadolibre"))
    return lerMercadoLivre();
  if (host.includes("magazineluiza") || host.includes("magazinevoce") || host.includes("magalu"))
    return lerMagalu();
  return { titulo: null, preco: null, precoAntigo: null, imagem: null };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.tipo === "LER_PRODUTO") {
    const dados = lerProduto();
    sendResponse({ url: location.href, ...dados });
  }
  return true;
});
