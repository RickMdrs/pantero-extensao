// Service worker: faz o fetch pro backend local (host_permissions -> sem CORS).

const BACKEND = "http://127.0.0.1:8000";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.tipo === "CONVERTER") {
    fetch(`${BACKEND}/extensao/converter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg.payload),
    })
      .then((r) => r.json())
      .then((data) => sendResponse({ ok: true, data }))
      .catch((e) =>
        sendResponse({
          ok: false,
          erro:
            "Não conectou ao Pantero. Abra o app e faça login antes de usar a extensão.",
        })
      );
    return true; // resposta assíncrona
  }
});
