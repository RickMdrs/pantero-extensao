const $ = (id) => document.getElementById(id);

function mostrar(estado) {
  ["loading", "erro", "resultado"].forEach((e) =>
    $(e).classList.toggle("hidden", e !== estado)
  );
}

function erro(msg) {
  $("erro-msg").textContent = msg;
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

async function iniciar() {
  mostrar("loading");
  const tab = await abaAtiva();
  if (!tab) return erro("Não achei a aba ativa.");

  const produto = await lerProduto(tab.id);
  if (!produto) {
    return erro(
      "Abra a página de um produto da Amazon ou Mercado Livre e tente de novo."
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
    return erro(resp?.erro || "Erro ao falar com o Pantero.");
  }
  const data = resp.data;
  if (!data.success) {
    return erro(data.message || "Não deu pra converter.");
  }

  $("plataforma").textContent = data.plataforma;
  $("mensagem").value = data.mensagem;

  const foto = $("foto");
  const baixar = $("baixar");
  if (data.imagem) {
    foto.src = data.imagem;
    foto.dataset.url = data.imagem;
    foto.classList.remove("hidden");
    baixar.classList.remove("hidden");
  } else {
    foto.classList.add("hidden");
    baixar.classList.add("hidden");
  }

  mostrar("resultado");
}

$("copiar").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("mensagem").value);
  const fb = $("feedback");
  fb.classList.remove("hidden");
  setTimeout(() => fb.classList.add("hidden"), 1500);
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
