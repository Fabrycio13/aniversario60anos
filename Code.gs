/**
 * CONVITE ONLINE — Google Apps Script
 * ======================================
 *
 * Como usar:
 * 1. Acesse https://script.google.com/
 * 2. Crie um NOVO projeto
 * 3. Cole este código no editor (Code.gs)
 * 4. Crie ou vincule uma planilha:
 *    - No menu "Executar" → "criarPlanilhaPadrao" (uma vez)
 *    - Ou clique em "Planilha" no código e insira o ID manualmente
 * 5. Publique: Implantar → Nova implantação → Web App
 *    - Executar como: "Eu"
 *    - Quem tem acesso: "Qualquer pessoa"
 * 6. Copie a URL gerada e cole no index.html (const APPS_SCRIPT_URL)
 */

// ============================================================
// CONFIGURAÇÃO — Edite aqui
// ============================================================

/** ID da planilha Google Sheets.
 *  Deixe em branco e execute criarPlanilhaPadrao() uma vez.
 *  Ou crie uma planilha manualmente e cole o ID aqui.
 *  O ID está na URL: https://docs.google.com/spreadsheets/d/SEU_ID/edit
 */
const SHEET_ID = '1uZyo5D8UEy6m_x9FeQN3xvOkJqXgkAwEN1bIqAh74k4';

/** Nome da aba/página dentro da planilha */
const SHEET_NAME = 'Confirmacoes';

// ============================================================
// FUNÇÕES PRINCIPAIS
// ============================================================

/**
 * Recebe os dados do formulário (POST)
 * Chamado pela página HTML via fetch()
 */
function doPost(e) {
  try {
    // Parse do JSON recebido
    let data;
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error('Nenhum dado recebido');
    }

    // Validação básica
    if (!data.nome || !data.presenca) {
      return responderJSON(400, { erro: 'Nome e presença são obrigatórios' });
    }

    // Salva na planilha
    const resultado = salvarConfirmacao(data);

    return responderJSON(200, {
      sucesso: true,
      mensagem: 'Presença confirmada com sucesso!',
      linha: resultado.linha
    });

  } catch (erro) {
    console.error('Erro no doPost:', erro);
    return responderJSON(500, { erro: erro.message });
  }
}

/**
 * Retorna o total de confirmações (GET)
 * Você pode chamar via URL?action=contar
 */
function doGet(e) {
  try {
    const acao = e?.parameter?.action || '';

    if (acao === 'contar') {
      const planilha = abrirPlanilha();
      const dados = planilha.getDataRange().getValues();
      const cabecalho = dados[0];

      let totalSim = 0;
      let totalNao = 0;
      let totalPessoas = 0; // incluindo acompanhantes

      // Encontra índices das colunas
      const idxPresenca = cabecalho.indexOf('Presenca');
      const idxQtd = cabecalho.indexOf('Qtd_Dependentes');

      for (let i = 1; i < dados.length; i++) {
        const linha = dados[i];
        if (linha[idxPresenca] === 'Sim') {
          totalSim++;
          const qtd = parseInt(linha[idxQtd], 10) || 0;
          totalPessoas += 1 + qtd; // 1 (a pessoa) + dependentes
        } else if (linha[idxPresenca] === 'Não') {
          totalNao++;
        }
      }

      const resposta = {
        sucesso: true,
        total_sim: totalSim,
        total_nao: totalNao,
        total_pessoas: totalPessoas
      };

      // Se chamou no browser, mostra HTML bonito
      if (acao === 'contar' && !e?.parameter?.json) {
        return HtmlService.createHtmlOutput(
          `<h2>📊 Confirmações</h2>
           <p>✅ Confirmados: <strong>${totalSim}</strong></p>
           <p>❌ Não virão: <strong>${totalNao}</strong></p>
           <p>👥 Total de pessoas (com acompanhantes): <strong>${totalPessoas}</strong></p>`
        );
      }

      return responderJSON(200, resposta);
    }

    if (acao === 'ping') {
      return responderJSON(200, { status: 'ok', mensagem: 'Web App está online!' });
    }

    // Fallback: página HTML
    return HtmlService.createHtmlOutput(
      '<h1>✅ Web App do Convite Online</h1>' +
      '<p>Este endpoint recebe confirmações de presença via POST.</p>' +
      '<p><a href="?action=contar">Ver total de confirmações</a></p>'
    );

  } catch (erro) {
    return responderJSON(500, { erro: erro.message });
  }
}

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

/**
 * Salva os dados em uma nova linha da planilha
 */
function salvarConfirmacao(data) {
  const planilha = abrirPlanilha();
  const cabecalho = planilha.getDataRange().getValues()[0];

  // Garante que o cabeçalho existe
  if (cabecalho.length < 2) {
    criarCabecalho(planilha);
  }

  const linha = [
    data.nome || '',
    data.presenca || '',
    data.qtd_dependentes || '0',
    data.acompanhantes || '',
    data.mensagem || '',
    data.timestamp || new Date().toISOString()
  ];

  planilha.appendRow(linha);

  return { linha: planilha.getLastRow() };
}

/**
 * Abre ou cria a planilha
 */
function abrirPlanilha() {
  let ss;

  if (SHEET_ID) {
    ss = SpreadsheetApp.openById(SHEET_ID);
  } else {
    // Tenta encontrar pelo nome
    const arquivos = DriveApp.getFilesByName('Convite - Confirmacoes');
    if (arquivos.hasNext()) {
      const arquivo = arquivos.next();
      ss = SpreadsheetApp.openById(arquivo.getId());
    } else {
      // Cria nova
      ss = SpreadsheetApp.create('Convite - Confirmacoes', 1, 1);
    }
  }

  // Verifica se a aba existe
  const folha = ss.getSheetByName(SHEET_NAME);
  if (folha) return folha;

  // Cria a aba
  const nova = ss.insertSheet(SHEET_NAME);
  criarCabecalho(nova);
  return nova;
}

/**
 * Cria o cabeçalho da planilha
 */
function criarCabecalho(folha) {
  const cabecalho = [
    'Nome', 'Presenca', 'Qtd_Dependentes',
    'Acompanhantes', 'Mensagem', 'Timestamp'
  ];
  folha.getRange(1, 1, 1, cabecalho.length)
       .setValues([cabecalho])
       .setFontWeight('bold');
}

/**
 * Helper: retorna resposta JSON
 */
function responderJSON(codigo, dados) {
  const saida = ContentService.createTextOutput(JSON.stringify(dados))
    .setMimeType(ContentService.MimeType.JSON);
  return saida;
}

// ============================================================
// FUNÇÕES DE SETUP (execute manualmente uma vez)
// ============================================================

/**
 * Cria a planilha padrão com cabeçalho.
 * Execute UMA VEZ no editor do Apps Script.
 */
function criarPlanilhaPadrao() {
  const ss = SpreadsheetApp.create(
    'Convite - Confirmacoes ' + new Date().toISOString().slice(0, 10)
  );
  const folha = ss.getActiveSheet();
  folha.setName(SHEET_NAME);
  criarCabecalho(folha);

  const id = ss.getId();
  console.log('✅ Planilha criada!');
  console.log('📋 ID: ' + id);
  console.log('🔗 Link: https://docs.google.com/spreadsheets/d/' + id);

  // Mostra um alerta
  SpreadsheetApp.getUi().alert(
    'Planilha criada!\n\nID: ' + id +
    '\n\nCopie este ID para o SHEET_ID no código se quiser fixar.'
  );

  return id;
}

/**
 * Adiciona dados de exemplo para teste
 */
function adicionarDadosExemplo() {
  const exemplos = [
    ['Maria Silva', 'Sim', '2', 'João; Ana', 'Chegarei mais tarde', new Date().toISOString()],
    ['Carlos Oliveira', 'Sim', '1', 'Pedro', '', new Date().toISOString()],
    ['Ana Costa', 'Não', '0', '', 'Impossibilitado', new Date().toISOString()],
  ];

  const planilha = abrirPlanilha();
  exemplos.forEach(dados => planilha.appendRow(dados));
  console.log('✅ Dados de exemplo adicionados!');
}
