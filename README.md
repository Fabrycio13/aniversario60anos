# 🎉 Festa Dona Maria — 60 Anos 🎂

> **📌 Repositório:** [github.com/Fabrycio13/aniversario60anos](https://github.com/Fabrycio13/aniversario60anos)  
> **🌐 Página ao vivo:** [fabrycio13.github.io/aniversario60anos/](https://fabrycio13.github.io/aniversario60anos/)

Página web para convidados confirmarem presença com dados salvos automaticamente no Google Sheets.

## 📁 Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Página do convite (abrir no navegador) |
| `Code.gs` | Google Apps Script (backend da planilha) |

---

## 🚀 Passo a Passo para Publicar

### 1️⃣ Criar o Google Apps Script

1. Acesse [script.google.com](https://script.google.com) (logado no Google que vai ser o "dono" da planilha)
2. Clique em **+ Criar projeto** → **Projeto vazio**
3. Apague o código padrão e **cole o conteúdo do `Code.gs`**
4. Clique em **Salvar** (💾) e dê um nome tipo `"Convite Festa Dona Maria"`

### 2️⃣ Criar a Planilha

No editor do Apps Script:

1. No menu **Executar** (▶️), escolha a função **`criarPlanilhaPadrao`**
2. Na primeira vez vai pedir **autorizações** — clique em:
   - **Revisar permissões** → escolha sua conta
   - **Avançado** → **Ir para "Convite Festa..." (não seguro)**
   - **Permitir**
3. O script vai criar a planilha e mostrar o **ID** dela
4. Copie esse ID e cole no `Code.gs` dentro de `const SHEET_ID = 'SEU_ID_AQUI';`
5. Salve o script novamente (Ctrl+S)

### 3️⃣ Publicar como Web App

1. No Apps Script, clique em **Implantar** → **Nova implantação**
2. Escolha tipo: **Web App**
3. Configure:
   - **Descrição:** `Convite Festa Dona Maria`
   - **Executar como:** `Eu` (sua conta)
   - **Quem tem acesso:** `Qualquer pessoa` ⬅️ ESSENCIAL!
4. Clique em **Implantar**
5. **Copie a URL** gerada (algo como `https://script.google.com/macros/s/.../exec`)

### 4️⃣ Conectar a Página com o Script

1. Abra o `index.html` no seu editor (VS Code, Bloco de Notas, etc.)
2. Encontre esta linha (lá dentro do JavaScript):
   ```js
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/SEU_ID_AQUI/exec';
   ```
3. Troque `SEU_ID_AQUI` pela URL que você copiou
4. Salve o arquivo

### 5️⃣ Publicar a Página (opcional)

**Opção A — GitHub Pages (grátis):**
1. Crie um repositório no GitHub
2. Envie o `index.html` para lá
3. Vá em **Settings** → **Pages** → ative na branch main
4. Pronto: `https://seuduplicado.github.io/nome-do-repo`

**Opção B — Vercel (mais fácil):**
1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório ou arraste a pasta
3. Clique em **Deploy** — pronto em 30 segundos

**Opção C — Enviar o arquivo direto:**
- Pode compartilhar o HTML por WhatsApp/Dropbox/Drive
- A pessoa abre no celular e funciona normalmente

---

## 🎨 Personalizando o Convite

Abra o `index.html` e edite:

| O que | Onde está |
|-------|-----------|
| **Nome da festa** | `<h1>Festa Dona Maria</h1>` |
| **Data e horário** | `<strong>15 de Novembro de 2026</strong>` e `<strong>19h</strong>` |
| **Local** | `Rua das Flores, 123 — Salão de Festas` |
| **Traje** | `Esporte Fino` |
| **Data limite** | `Confirme até 01/11` |
| **Emoji do topo** | `🎉` (troque por 🎂 🎊 🥂 etc) |
| **Cores** | As cores principais são `#7a2e1a` (vinho) e `#a8472a` (terracota) |

---

## 📊 Acompanhando as Confirmações

As respostas caem na planilha Google Sheets:

| Nome | Presenca | Qtd_Dependentes | Acompanhantes | Mensagem | Timestamp |
|------|----------|-----------------|---------------|----------|-----------|
| Maria Silva | Sim | 2 | João; Ana | Chegarei mais tarde | 2026-07-22T... |
| Carlos | Não | 0 | | | ... |

Para ver o total sem abrir a planilha, acesse no navegador:
`https://script.google.com/macros/s/SEU_ID/exec?action=contar`

---

## ❗ Dicas Importantes

- **Teste antes de enviar**: preencha o formulário e veja se os dados aparecem na planilha
- **mode: 'no-cors'** no fetch: isso é normal, o navegador não consegue ler a resposta do Apps Script mas os dados chegam — o usuário vê "sucesso" mesmo assim
- **Demora no primeiro acesso**: o Apps Script "acorda" quando fica um tempo sem uso (pode levar 2-5s)
- **Quota grátis**: o Apps Script tem limite de ~20 requisições por minuto — suficiente para festas de até 200-300 convidados

---

Feito com ❤️ para a Festa Dona Maria
