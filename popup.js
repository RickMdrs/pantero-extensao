const $ = (id) => document.getElementById(id);

function mostrar(estado) {
  ["loading", "erro", "resultado"].forEach((e) =>
    $(e).classList.toggle("hidden", e !== estado)
  );
}

function erro(msg, backendOff) {
  $("erro-msg").textContent = msg;
  $("status-dot").classList.toggle("off", !!backendOff);
  mostrar("erro");
}

async function abaAtiva() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function lerProduto(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { tipo: "LER_PRODUTO" }, (resp) => {
      if (chrome.runtime.lastError || !resp) return resolve(null);
      resolve(resp);
    });
  });
}

async function converter(payload) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ tipo: "CONVERTER", payload }, resolve);
  });
}

function preencherProduto(produto, data) {
  $("plataforma").textContent = data.plataforma;
  $("titulo").textContent = produto.titulo || "Produto";

  const antigo = $("preco-antigo");
  if (produto.precoAntigo && produto.precoAntigo !== produto.preco) {
    antigo.textContent = produto.precoAntigo;
    antigo.classList.remove("hidden");
  } else {
    antigo.classList.add("hidden");
  }
  $("preco").textContent = produto.preco || "";

  const frame = document.querySelector(".foto-frame");
  const card = document.querySelector(".produto");
  const foto = $("foto");
  const baixar = $("baixar");
  if (data.imagem) {
    foto.src = data.imagem;
    foto.dataset.url = data.imagem;
    frame.classList.add("has-img");
    card.classList.remove("no-img");
    baixar.classList.remove("hidden");
  } else {
    frame.classList.remove("has-img");
    card.classList.add("no-img");
    baixar.classList.add("hidden");
  }
}

async function iniciar() {
  mostrar("loading");
  $("status-dot").classList.remove("off");

  const tab = await abaAtiva();
  if (!tab) return erro("Não achei a aba ativa.");

  const produto = await lerProduto(tab.id);
  if (!produto) {
    return erro(
      "Abra a página de um produto da Amazon, Mercado Livre ou Magalu e tente de novo."
    );
  }

  const resp = await converter({
    url: produto.url,
    titulo: produto.titulo,
    preco: produto.preco,
    precoAntigo: produto.precoAntigo,
    imagem: produto.imagem,
  });

  if (!resp || !resp.ok) {
    return erro(resp?.erro || "Erro ao falar com o Pantero.", true);
  }
  const data = resp.data;
  if (!data.success) {
    return erro(data.message || "Não deu pra converter.");
  }

  preencherProduto(produto, data);
  $("mensagem").value = data.mensagem;
  mostrar("resultado");
}

/* copiar com morph de estado */
let copiarTimer = null;
$("copiar").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("mensagem").value);
  const btn = $("copiar");
  btn.classList.add("done");
  btn.querySelector(".ic-copy").classList.add("hidden");
  btn.querySelector(".ic-check").classList.remove("hidden");
  $("copiar-label").textContent = "Copiado";
  clearTimeout(copiarTimer);
  copiarTimer = setTimeout(() => {
    btn.classList.remove("done");
    btn.querySelector(".ic-copy").classList.remove("hidden");
    btn.querySelector(".ic-check").classList.add("hidden");
    $("copiar-label").textContent = "Copiar mensagem";
  }, 1600);
});

$("baixar").addEventListener("click", () => {
  const url = $("foto").dataset.url;
  if (!url) return;
  chrome.downloads.download({ url, filename: "pantero-promo.jpg" });
});

$("whatsapp").addEventListener("click", () => {
  const texto = encodeURIComponent($("mensagem").value);
  chrome.tabs.create({ url: `https://web.whatsapp.com/send?text=${texto}` });
});

$("tentar").addEventListener("click", iniciar);

iniciar();
