# Guia de publicação — Chrome Web Store

Passo a passo pra publicar a extensão. O que **você** faz está marcado com 👤.

## 1. Conta de desenvolvedor 👤
- Acesse https://chrome.google.com/webstore/devconsole
- Pague a taxa única de **US$ 5** (uma vez só, pra vida toda).
- Use a conta Google da empresa (a mesma que quer receber os avisos da loja).

## 2. Upload do pacote 👤
- Clique em **"Novo item"** → faça upload de `pantero-extensao-store.zip`
  (gerado em `extensao/store/`).

## 3. Preencher a listagem 👤
Cole os textos abaixo nos campos correspondentes.

**Nome:**
```
Pantero IA — Afiliar
```

**Descrição curta (summary, até 132 caracteres):**
```
Abra um produto na Amazon, Mercado Livre ou Magalu e gere o link de afiliado + mensagem pronta. Funciona com o app Pantero IA.
```

**Descrição detalhada:**
```
A extensão oficial do Pantero IA para afiliados.

Abra qualquer produto na Amazon, no Mercado Livre ou no Magalu, clique no ícone
e pronto: a IA gera o link de afiliado e uma mensagem de divulgação já formatada,
com título, preço e a foto do produto pra baixar. Um clique pra copiar, outro pra
abrir no WhatsApp.

RECURSOS
• Link de afiliado automático (Amazon, Mercado Livre e Magalu)
• Mensagem de promoção pronta, no padrão que converte
• Foto do produto pra baixar e anexar
• Copiar com um clique / abrir direto no WhatsApp

COMO FUNCIONA
A extensão trabalha junto com o aplicativo Pantero IA instalado no seu
computador. Ela usa a mesma assinatura — sem login separado. Mantenha o
Pantero aberto e com a assinatura ativa.

REQUISITOS
• Aplicativo Pantero IA instalado e aberto
• Assinatura ativa
• Tag de afiliado configurada no painel do Pantero
```

**Categoria:** Ferramentas (ou Compras)
**Idioma:** Português (Brasil)

**Política de privacidade (URL):**
Hospede o arquivo `PRIVACIDADE.md` e cole a URL. Opções:
- No site: crie `https://pantero.ia.br/privacidade-extensao` (recomendado)
- Ou use o GitHub: `https://github.com/RickMdrs/pantero-extensao/blob/master/PRIVACIDADE.md`

## 4. Justificativas de permissão 👤
Se a loja pedir, cole:
- **activeTab / host (Amazon, Mercado Livre, Magalu):** "Ler os dados do produto (título,
  preço, imagem) na página que o usuário está vendo, para gerar o link de afiliado."
- **downloads:** "Baixar a imagem do produto quando o usuário clica em Baixar imagem."
- **clipboardWrite:** "Copiar a mensagem pronta para a área de transferência."
- **host 127.0.0.1 (localhost):** "Comunicar com o aplicativo Pantero IA instalado no
  computador do próprio usuário, que gera o link de afiliado."
- **Finalidade única (single purpose):** "Gerar link de afiliado e mensagem de
  divulgação a partir da página de um produto na Amazon, Mercado Livre ou Magalu."

## 5. Visibilidade 👤
- **Não listada (unlisted):** só quem tem o link instala. Recomendado — combina com
  produto pago.
- Ou **Pública** se quiser aparecer na busca da loja.

## 6. Enviar pra revisão 👤
- Clique em **Enviar para análise**. Costuma levar de algumas horas a poucos dias.

## 7. Depois de aprovada 👤 + 🤖
- Copie a URL da loja (algo como `https://chromewebstore.google.com/detail/....`)
- Me manda essa URL: eu troco o botão "Baixar Extensão" do app pra abrir a loja
  (1 clique pro cliente) e gero a próxima versão do app.

## Assets visuais que a loja pede 👤
- **Ícone 128×128:** já incluso (`icons/icon128.png`).
- **Pelo menos 1 screenshot 1280×800 (ou 640×400):** print da extensão aberta numa
  página de produto. Tire um print real e recorte no tamanho.
- **(Opcional) Tile promocional 440×280.**
