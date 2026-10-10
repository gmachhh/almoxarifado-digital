const ABA_OBRA   = 'Itens Obra';
const ABA_ELET   = 'Itens Elétrica';
const ABA_CONFIG = 'Config';
const ABA_USR    = 'Usuarios';
const ABA_FUNC   = 'Funcionarios';
const ABA_PED    = 'Pedidos';
const ABAS_ITENS = [
  { aba: ABA_OBRA, categoria: 'Obra', prefixo: 'OB', cor: '#e8710a' },
  { aba: ABA_ELET, categoria: 'Elétrica', prefixo: 'EL', cor: '#1a73e8' }
];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
               'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Colunas das abas de itens

const I_COD = 1, I_NOME = 2, I_TIPO = 3, I_UN = 4, I_EST = 5, I_MIN = 6, I_PRECO = 7, I_COLS = 7;
const CAB_ITENS = ['Código', 'Item', 'Tipo', 'Unidade', 'Estoque', 'Estoque mínimo', 'Preço unitário (R$)'];

// Colunas das abas de movimentação (uma por mês)

const M_PEND = 10, M_OBS = 11, M_COLS = 12;
const CAB_MOV = ['Pedido', 'Data/Hora', 'Movimento', 'Pessoa / Origem', 'Obra / Destino', 'Código', 'Item',
                 'Qtd', 'Registrado por', 'Pendente devolução', 'Obs', 'Anexo (assinatura / NF)'];

// Usuarios

const U_NOME = 1, U_EMAIL = 2, U_SETOR = 3, U_STATUS = 4, U_EDITA = 5, U_PIN = 6,
      U_CRIADO = 7, U_ACESSO = 8, U_HASH = 9, U_SALT = 10;

// Funcionarios

const F_NOME = 1, F_FUNCAO = 2, F_CONTRATO = 3, F_ATIVO = 4;
const CONTRATOS = ['CLT', 'PJ', 'Jovem Aprendiz'];
/** Aceita 'clt', 'pj', 'aprendiz', 'jovem aprendiz'... e devolve o nome padrão (ou '' se inválido). */
const contratoPadrao_ = v => {
  const t = String(v || '').trim().toLowerCase();
  if (/aprendiz/.test(t)) return 'Jovem Aprendiz';
  if (t === 'pj') return 'PJ';
  if (t === 'clt') return 'CLT';
  return '';
};

// Unidades permitidas na aba "Itens Obra" meio que uma lista suspensa (não sei ao certo)

const UNIDADES_OBRA = ['Unidade (Un)', 'Pacote', 'Saco', 'Case', 'Metro (M)', 'Peça', 'Caixa', 'Conj', 'Rolo', 'Par',
                       'Metro²', 'Centímetro (Cm)', 'Estojo', 'Barra', 'Galão', 'Lata'];

/** Aq converte abreviações antigas (un, saco, m, cx) para o nome da lista . */

function unidadeObra_(v) {
  const t = String(v || '').trim().toLowerCase().replace(/\.$/, '');
  if (!t) return '';
  const exato = UNIDADES_OBRA.find(u => u.toLowerCase() === t);
  if (exato) return exato;
  const mapa = {
    'un': 'Unidade (Un)', 'und': 'Unidade (Un)', 'unid': 'Unidade (Un)', 'unidade': 'Unidade (Un)', 'u': 'Unidade (Un)',
    'pct': 'Pacote', 'pc': 'Peça', 'pç': 'Peça', 'pca': 'Peça', 'peca': 'Peça', 'sc': 'Saco', 'sacos': 'Saco',
    'm': 'Metro (M)', 'mt': 'Metro (M)', 'metro': 'Metro (M)', 'metros': 'Metro (M)', 'ml': 'Metro (M)',
    'm²': 'Metro²', 'm2': 'Metro²', 'metro2': 'Metro²', 'metro quadrado': 'Metro²',
    'cm': 'Centímetro (Cm)', 'centimetro': 'Centímetro (Cm)', 'cx': 'Caixa', 'conjunto': 'Conj', 'cj': 'Conj',
    'rl': 'Rolo', 'rolos': 'Rolo', 'pr': 'Par', 'br': 'Barra', 'gl': 'Galão', 'galao': 'Galão', 'lt': 'Lata', 'est': 'Estojo'
  };
  return mapa[t] || '';
}

// Tipos da aba Itens Obra. Os que ficam em devolver volta ao almoxarifado.

const TIPOS_OBRA = ['Material', 'Ferramenta', 'EPI', 'Material Iluminação', 'Fardamento', 'Máquinas',
                    'Material Escritório', 'Elétrica'];
const TIPOS_ELET = ['Adesivos', 'Anilhas', 'Anteparo', 'Arruela', 'Bolachas', 'Botoeira', 'Braço Composto', 'Cabo',
  'Cabo Alumínio', 'Cabo Cobre', 'Caixas de Passagem', 'Câmera', 'Cinta Aço', 'Cintas', 'Cobre Foco', 'Colunas',
  'Conector', 'Consumível', 'Disjuntores', 'Espuma', 'Fecho', 'Ferramenta', 'Ferro', 'Fita', 'Grupos Focais', 'Haste',
  'Isolantes', 'Nobreaks', 'Parafuso', 'Placas', 'Porca', 'Roldana', 'Suporte', 'Suporte Basculante', 'Suporte Simples'];
const DEVOLVEM = ['Ferramenta', 'Máquinas'];
const devolve_ = tipo => DEVOLVEM.indexOf(tipo) >= 0;

/** aqui ele vai padronizar o texto do tipo conforme a aba pede */


function tipoPadrao_(v, aba) {
  const t = String(v || '').trim().toLowerCase();
  const lista = aba === ABA_OBRA ? TIPOS_OBRA : TIPOS_ELET;
  const semAcento = x => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const exato = lista.find(x => semAcento(x) === semAcento(t));
  if (exato) return exato;


  const raiz = x => semAcento(x).split(' ').map(p => p.replace(/(es|s)$/, '')).join(' ');
  const parecido = t && lista.find(x => raiz(x) === raiz(t));
  if (parecido) return parecido;
  if (/ferram/.test(t)) return 'Ferramenta';
  if (aba === ABA_OBRA) {
    if (/maq/.test(semAcento(t))) return 'Máquinas';
    if (/ilumin/.test(t)) return 'Material Iluminação';
    if (/escrit/.test(t)) return 'Material Escritório';
    if (/fard|unifor/.test(t)) return 'Fardamento';
    if (/^epi/.test(t)) return 'EPI';
    if (/el[eé]tric/.test(t)) return 'Elétrica';
    if (/consum|material/.test(t) || !t) return 'Material';
    return '';
  }
  return t ? '' : 'Consumível';
}


// PEDIDOS

const P_ID = 1, P_DATA = 2, P_SOLIC = 3, P_EMAIL = 4, P_FUNC = 5, P_OBRA = 6, P_TXT = 7,
      P_JSON = 8, P_STATUS = 9, P_OBS = 10, P_ATEND = 11, P_ATUAL = 12;

const SESSAO_DIAS = 30;
const EDICAO_HORAS = 12;
const MAX_TENTATIVAS_PIN = 5;
const ESTORNO_HORAS = 48;
const PASTA_RAIZ = 'Almoxarifado - Arquivos';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Almoxarifado')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Almoxarifado')
    .addItem('Gerar novo PIN para o usuário selecionado', 'menuNovoPin')
    .addItem('Desconectar todos os usuários', 'menuDesconectarTodos')
    .addSeparator()
    .addItem('Enviar aviso de atrasos agora', 'menuAvisoAgora')
    .addItem('Enviar resumo semanal agora', 'menuResumoAgora')
    .addItem('Ativar e-mails automáticos', 'menuAtivarAutomaticos')
    .addSeparator()
    .addItem('🗑️ Apagar lançamento/pedido da linha selecionada', 'menuApagarLinha')
    .addItem('🧪 Apagar todos os dados de teste', 'menuApagarTestes')
    .addItem('🔎 Reaplicar filtros nas abas', 'menuFiltros')
    .addToUi();
}

const ss_ = () => SpreadsheetApp.getActive();
const tz_ = () => Session.getScriptTimeZone();
const fmt_ = (d, f) => Utilities.formatDate(new Date(d), tz_(), f);
const num_ = v => Number(String(v).replace(',', '.'));
const cab_ = r => r.setFontWeight('bold').setBackground('#1f3b57').setFontColor('#ffffff');
const lista_ = (rng, valores) => rng.setDataValidation(
  SpreadsheetApp.newDataValidation().requireValueInList(valores, true).build());

/* CONFIGURAÇÃO */

function configurar() {
  const ss = ss_();

  // Abas de itens Obra / Elétrica 

  ABAS_ITENS.forEach(a => {
    let sh = ss.getSheetByName(a.aba);
    if (!sh) {
      sh = ss.insertSheet(a.aba);
      sh.appendRow(CAB_ITENS);
    }
    prepararAbaItens_(sh, a.cor);
  });
  migrarItensV3_();
  semExemplosSeVazio_();
  padronizarUnidadesObra_();
  padronizarTiposObra_();



  migrarMovimentacoesV3_();
  abaMes_(new Date(), true);

  // Config de fato

  const cfg = ss.getSheetByName(ABA_CONFIG) || ss.insertSheet(ABA_CONFIG);
  if (/PIN/i.test(String(cfg.getRange('A1').getValue()))) cfg.deleteRow(1);
  const padroes = [
    [/e-?mail/i, 'E-mail para alertas e relatórios (separe por vírgula)', ''],
    [/obra/i, 'Obras / destinos (separe por vírgula)', 'Obra Centro, Obra Norte, Manutenção'],
    [/dias/i, 'Dias para considerar ferramenta atrasada', 7],
    [/assinatura/i, 'Exigir assinatura na retirada (Sim/Não)', 'Sim'],
    [/setor/i, 'Setores permitidos no cadastro (separe por vírgula)', 'RH, Almoxarifado'],
    [/teste/i, 'Modo teste (Sim/Não) — marca os lançamentos como teste para apagar depois', 'Não']
  ];
  const existentes = cfg.getLastRow() ? cfg.getRange(1, 1, cfg.getLastRow(), 1).getValues().map(r => String(r[0])) : [];
  padroes.forEach(p => { if (!existentes.some(t => p[0].test(t))) cfg.appendRow([p[1], p[2]]); });
  cfg.getRange('A:A').setFontWeight('bold');
  cfg.setColumnWidth(1, 420);
  cfg.setColumnWidth(2, 320);

  // Usuários

 
  const usr = ss.getSheetByName(ABA_USR) || ss.insertSheet(ABA_USR);
  if (usr.getLastRow() === 0) {
    usr.appendRow(['Nome', 'E-mail', 'Setor', 'Status', 'Pode editar?', 'PIN',
      'Criado em', 'Último acesso', 'hash (não mexer)', 'salt (não mexer)']);
    usr.setFrozenRows(1);
    cab_(usr.getRange('1:1'));
    lista_(usr.getRange('D2:D1000'), ['Ativo', 'Bloqueado']);
    lista_(usr.getRange('E2:E1000'), ['Sim', 'Não']);
    usr.getRange('F2:F1000').setNumberFormat('@');
    usr.getRange('G2:H1000').setNumberFormat('dd/MM/yyyy HH:mm');
    usr.setConditionalFormatRules([
      SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$E2="Sim"')
        .setBackground('#d4edda').setRanges([usr.getRange('A2:H1000')]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$D2="Bloqueado"')
        .setBackground('#e2e3e5').setFontColor('#777777').setRanges([usr.getRange('A2:H1000')]).build()
    ]);
    usr.hideColumns(U_HASH, 2);
    usr.setColumnWidths(1, 8, 140);
  }

  // Funcionários com contrato CLT / PJ / Jovem Aprendiz

  const fun = ss.getSheetByName(ABA_FUNC) || ss.insertSheet(ABA_FUNC);
  if (fun.getLastRow() === 0) {
    fun.appendRow(['Nome', 'Função', 'Contrato', 'Ativo?']);
    fun.getRange(2, 1, 2, 4).setValues([['João Silva', 'Pedreiro', 'CLT', 'Sim'], ['Pedro Santos', 'Eletricista', 'PJ', 'Sim']]);
  } else if (!/contrato/i.test(String(fun.getRange(1, F_CONTRATO).getValue()))) {
    // v3 -> v4: insere a coluna Contrato antes de "Ativo?"
    fun.insertColumnBefore(F_CONTRATO);
    fun.getRange(1, F_CONTRATO).setValue('Contrato');
    const n = fun.getLastRow() - 1;
    if (n > 0) fun.getRange(2, F_CONTRATO, n, 1).setValues(Array(n).fill(['CLT']));
  }
  fun.setFrozenRows(1);
  cab_(fun.getRange(1, 1, 1, 4));
  lista_(fun.getRange('C2:C1000'), CONTRATOS);
  lista_(fun.getRange('D2:D1000'), ['Sim', 'Não']);
  fun.setColumnWidths(1, 4, 180);
  fun.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('PJ').setBackground('#e8f0fe').setFontColor('#1a56db')
      .setRanges([fun.getRange('C2:C1000')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('CLT').setBackground('#e6f4ea').setFontColor('#137333')
      .setRanges([fun.getRange('C2:C1000')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Jovem Aprendiz').setBackground('#fef3c7').setFontColor('#92400e')
      .setRanges([fun.getRange('C2:C1000')]).build()
  ]);

  // PEDIDOS
  const ped = ss.getSheetByName(ABA_PED) || ss.insertSheet(ABA_PED);
  if (ped.getLastRow() === 0) {
    ped.appendRow(['Pedido', 'Data', 'Solicitado por', 'e-mail (não mexer)', 'Funcionário', 'Obra',
      'Itens', 'itens (não mexer)', 'Status', 'Obs', 'Atendido por', 'Atualizado em']);
    ped.setFrozenRows(1);
    cab_(ped.getRange('1:1'));
    ped.getRange('B:B').setNumberFormat('dd/MM/yyyy HH:mm');
    ped.getRange('L:L').setNumberFormat('dd/MM/yyyy HH:mm');
    ped.hideColumns(P_EMAIL);
    ped.hideColumns(P_JSON);
    ped.setColumnWidth(P_TXT, 320);
  }

  PropertiesService.getScriptProperties().deleteProperty('abas_pend');
  aplicarFiltros_();
  ativarAutomaticos_();
}

function prepararAbaItens_(sh, cor) {
  sh.setFrozenRows(1);
  cab_(sh.getRange(1, 1, 1, I_COLS));
  sh.setTabColor(cor);
  lista_(sh.getRange('C2:C1000'), sh.getName() === ABA_OBRA ? TIPOS_OBRA : TIPOS_ELET);
  sh.setColumnWidth(I_TIPO, 170);
  sh.getRange('G2:G1000').setNumberFormat('#,##0.00');
  sh.setColumnWidth(I_NOME, 260);
  if (sh.getName() === ABA_OBRA) {
    sh.getRange('D2:D1000').setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(UNIDADES_OBRA, true).setAllowInvalid(false)
      .setHelpText('Escolha uma unidade da lista').build());
    sh.setColumnWidth(I_UN, 150);
  }
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($A2<>"",$E2<=$F2)')
      .setBackground('#f8d7da').setRanges([sh.getRange('A2:G1000')]).build()
  ]);
}

function migrarItensV3_() {
  const ss = ss_();
  const velha = ss.getSheetByName('Itens');
  if (!velha) return;
  const dados = velha.getDataRange().getValues();
  const destino = { 'Obra': [], 'Elétrica': [] };
  for (let i = 1; i < dados.length; i++) {
    const r = dados[i];
    if (!String(r[0]).trim()) continue;
    const cat = /el[eé]tric/i.test(String(r[2])) ? 'Elétrica' : 'Obra';
    let un = String(r[4]);
    if (/areia|brita/i.test(String(r[1])) && /m³|m3|m²|m2/i.test(un)) un = 'un';
    destino[cat].push([r[0], r[1], r[3] || 'Consumível', un, Number(r[5]) || 0, Number(r[6]) || 0, Number(r[7]) || 0]);
  }
  ABAS_ITENS.forEach(a => {
    const linhas = destino[a.categoria];
    if (!linhas.length) return;
    const sh = ss.getSheetByName(a.aba);
    sh.getRange(sh.getLastRow() + 1, 1, linhas.length, I_COLS).setValues(linhas);
  });
  velha.setName('Itens (backup v3)');
  velha.hideSheet();
}


function padronizarUnidadesObra_() {
  const sh = ss_().getSheetByName(ABA_OBRA);
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const rng = sh.getRange(2, I_UN, n, 1);
  const vals = rng.getValues();
  let mudou = false;
  const novos = vals.map(r => {
    const u = unidadeObra_(r[0]);
    if (u && u !== r[0]) { mudou = true; return [u]; }
    return [r[0]];
  });
  if (mudou) rng.setValues(novos);
}

function padronizarTiposObra_() {
  const sh = ss_().getSheetByName(ABA_OBRA);
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const rng = sh.getRange(2, I_TIPO, n, 1);
  const vals = rng.getValues();
  let mudou = false;
  const novos = vals.map(r => {
    const t = tipoPadrao_(r[0], ABA_OBRA);
    if (t && t !== r[0]) { mudou = true; return [t]; }
    return [r[0]];
  });
  if (mudou) rng.setValues(novos);
}

function semExemplosSeVazio_() {
  const ss = ss_();
  const obra = ss.getSheetByName(ABA_OBRA), elet = ss.getSheetByName(ABA_ELET);
  if (obra.getLastRow() > 1 || elet.getLastRow() > 1) return;
  obra.getRange(2, 1, 4, I_COLS).setValues([
    ['OB001', 'Cimento CP-II 50kg', 'Material', 'Saco', 40, 10, 38],
    ['OB002', 'Areia média', 'Material', 'Unidade (Un)', 6, 2, 0],
    ['OB003', 'Pedra brita 1', 'Material', 'Unidade (Un)', 5, 2, 0],
    ['OB004', 'Carrinho de mão', 'Ferramenta', 'Unidade (Un)', 4, 1, 0],
    ['OB005', 'Capacete de segurança', 'EPI', 'Unidade (Un)', 15, 5, 25]
  ]);
  elet.getRange(2, 1, 4, I_COLS).setValues([
    ['EL001', 'Chave de fenda', 'Ferramenta', 'un', 10, 2, 0],
    ['EL002', 'Alicate universal', 'Ferramenta', 'un', 8, 2, 0],
    ['EL003', 'Talabarte', 'Ferramenta', 'un', 6, 2, 0],
    ['EL004', 'Fita isolante', 'Consumível', 'rolo', 30, 10, 6.5]
  ]);
}

function migrarMovimentacoesV3_() {
  const ss = ss_();
  const velha = ss.getSheetByName('Movimentacoes');
  if (!velha) return;
  const dados = velha.getDataRange().getValues();
  const grupos = {};
  for (let i = 1; i < dados.length; i++) {
    const r = dados[i].slice(0, M_COLS);
    while (r.length < M_COLS) r.push('');
    if (!r[0] && !r[1]) continue;
    const d = r[1] instanceof Date || !isNaN(new Date(r[1])) ? new Date(r[1]) : new Date();
    const chave = fmt_(d, 'yyyy-MM');
    (grupos[chave] = grupos[chave] || []).push(r);
  }
  Object.keys(grupos).sort().forEach(chave => {
    const sh = abaMes_(dataDaChave_(chave), true);
    const linhas = grupos[chave];
    sh.getRange(sh.getLastRow() + 1, 1, linhas.length, M_COLS).setValues(linhas);
  });
  velha.setName('Movimentacoes (backup v3)');
  velha.hideSheet();
}

function ativarAutomaticos_() {
  const nomes = ['enviarAvisoAtrasos', 'enviarResumoSemanal'];
  ScriptApp.getProjectTriggers().forEach(t => { if (nomes.indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('enviarAvisoAtrasos').timeBased().everyDays(1).atHour(7).create();
  ScriptApp.newTrigger('enviarResumoSemanal').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).create();
}

/*ABAS MENSAIS DE MOVIMENTAÇÃO (praticamente impossivel)*/

const nomeMes_ = d => { const [a, m] = fmt_(d, 'yyyy-MM').split('-').map(Number); return MESES[m - 1] + ' ' + a; };
const dataDaChave_ = chave => { const [a, m] = chave.split('-').map(Number); return new Date(a, m - 1, 15, 12); };


function chaveDeAba_(nome) {
  const m = /^(\S+) (\d{4})$/.exec(String(nome));
  if (!m) return null;
  const i = MESES.indexOf(m[1]);
  return i < 0 ? null : m[2] + '-' + String(i + 1).padStart(2, '0');
}


function abasMov_() {
  return ss_().getSheets().map(s => ({ s, nome: s.getName(), chave: chaveDeAba_(s.getName()) }))
    .filter(x => x.chave).sort((a, b) => a.chave < b.chave ? -1 : a.chave > b.chave ? 1 : 0);
}

function abaMes_(data, criar) {
  const ss = ss_();
  const nome = nomeMes_(data);
  let sh = ss.getSheetByName(nome);
  if (!sh && criar) {
    const meses = abasMov_();
    const chave = fmt_(data, 'yyyy-MM');
    const antes = meses.filter(m => m.chave < chave).pop();
    const pos = antes ? antes.s.getIndex() : ss.getNumSheets();
    sh = ss.insertSheet(nome, pos);
    sh.appendRow(CAB_MOV);
    sh.setFrozenRows(1);
    cab_(sh.getRange(1, 1, 1, M_COLS));
    sh.getRange('B:B').setNumberFormat('dd/MM/yyyy HH:mm');
    sh.setTabColor('#5f6368');
    sh.setColumnWidth(7, 220);
    sh.setConditionalFormatRules([
      SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$C2="SAÍDA"').setFontColor('#b3261e')
        .setRanges([sh.getRange('C2:C5000')]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$C2="ENTRADA"').setFontColor('#137333')
        .setRanges([sh.getRange('C2:C5000')]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$J2>0').setBackground('#fff4e5')
        .setRanges([sh.getRange('J2:J5000')]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=ISNUMBER(SEARCH("[TESTE]",$K2))')
        .setBackground('#f3e8ff').setRanges([sh.getRange('A2:L5000')]).build()
    ]);
    filtro_(sh, M_COLS);
  }
  return sh;
}

function anexar_(linhas) {
  if (!linhas.length) return;
  const sh = abaMes_(new Date(), true);
  const teste = cfg_().modoTeste;
  linhas = linhas.map(l => {
    l = l.slice(0, M_COLS); while (l.length < M_COLS) l.push('');
    if (teste && !/\[TESTE\]/.test(String(l[M_OBS - 1]))) l[M_OBS - 1] = ('[TESTE] ' + l[M_OBS - 1]).trim();
    return l;
  });
  sh.getRange(sh.getLastRow() + 1, 1, linhas.length, M_COLS).setValues(linhas);
  if (linhas.some(l => Number(l[M_PEND - 1]) > 0)) marcarAbaPendente_(sh.getName());
}


function marcarAbaPendente_(nome) {
  const props = PropertiesService.getScriptProperties();
  const atual = JSON.parse(props.getProperty('abas_pend') || 'null');
  if (!atual) return;                         
  if (atual.indexOf(nome) < 0) { atual.push(nome); props.setProperty('abas_pend', JSON.stringify(atual)); }
}

/*FILTROS NAS ABAS*/

function filtro_(sh, cols) {
  try {
    if (sh.getFilter()) return;
    sh.getRange(1, 1, sh.getMaxRows(), cols).createFilter();
  } catch (e) { }
}

function aplicarFiltros_() {
  const ss = ss_();
  [[ABA_OBRA, I_COLS], [ABA_ELET, I_COLS], [ABA_FUNC, 4], [ABA_PED, 12], [ABA_USR, 8]].forEach(([n, c]) => {
    const sh = ss.getSheetByName(n);
    if (sh) filtro_(sh, c);
  });
  abasMov_().forEach(a => filtro_(a.s, M_COLS));
}

function menuFiltros() {
  ss_().getSheets().forEach(sh => { try { const f = sh.getFilter(); if (f) f.remove(); } catch (e) {} });
  aplicarFiltros_();
  SpreadsheetApp.getUi().alert('Filtros aplicados. Use as setinhas no cabeçalho de cada aba.');
}


const eTeste_ = obs => /\[TESTE\]/.test(String(obs));


function apagarLinhas_(sh, indices) {
  [...new Set(indices)].sort((a, b) => b - a).forEach(i => sh.deleteRow(i + 1));
}


function excluirLancamento_(nomeAba, id, mapa) {
  const sh = ss_().getSheetByName(nomeAba);
  const chave = chaveDeAba_(nomeAba);
  if (!sh || !chave) throw new Error('Aba de movimentação inválida.');
  const dados = sh.getDataRange().getValues();
  const idx = [];
  for (let i = 1; i < dados.length; i++) if (String(dados[i][0]) === String(id)) idx.push(i);
  if (!idx.length) throw new Error('Lançamento não encontrado (talvez já tenha sido apagado).');
  const tipo = String(dados[idx[0]][2]);
  if (tipo === 'ESTORNO') throw new Error('Isto é um estorno. Apague o lançamento original que ele desfez — o estorno sai junto.');
  const estornado = idx.some(i => /^\[ESTORNADO\]/.test(String(dados[i][M_OBS - 1])));

  const delta = {};                 
  const pendVolta = [];             
  idx.forEach(i => {
    const r = dados[i], cod = String(r[5]), q = Number(r[7]) || 0, item = mapa[cod];
    if (!item || estornado) return;
    let d = 0;
    if (tipo === 'SAÍDA') d = devolve_(item.tipo) && r[M_PEND - 1] !== '' ? (Number(r[M_PEND - 1]) || 0) : q;
    else if (tipo === 'ENTRADA' || tipo === 'AJUSTE') d = -q;
    else if (tipo === 'DEVOLUÇÃO') {
      d = -q;
      const m = /Ref\. (\S+)/.exec(String(r[M_OBS - 1]));
      if (m) pendVolta.push({ ref: m[1], codigo: cod, qtd: q });
    }
    delta[cod] = (delta[cod] || 0) + d;
  });

  
  const extras = {};                
  const abas = abasMov_();
  if (tipo === 'SAÍDA' || estornado) {
    abas.filter(a => a.chave >= chave).forEach(a => {
      const d = a.nome === nomeAba ? dados : a.s.getDataRange().getValues();
      for (let i = 1; i < d.length; i++) {
        const obs = String(d[i][M_OBS - 1]);
        const liga = (tipo === 'SAÍDA' && d[i][2] === 'DEVOLUÇÃO' && obs.indexOf('Ref. ' + id) >= 0) ||
                     (estornado && d[i][2] === 'ESTORNO' && obs.indexOf(' ' + id) >= 0);
        if (liga) (extras[a.nome] = extras[a.nome] || []).push(i);
      }
    });
  }
  pendVolta.forEach(pv => {           
    for (const a of abas.filter(x => x.chave <= chave).reverse()) {
      const d = a.nome === nomeAba ? dados : a.s.getDataRange().getValues();
      const i = d.findIndex((r, k) => k > 0 && String(r[0]) === pv.ref && String(r[5]) === pv.codigo && r[2] === 'SAÍDA');
      if (i > 0) {
        a.s.getRange(i + 1, M_PEND).setValue((Number(d[i][M_PEND - 1]) || 0) + pv.qtd);
        marcarAbaPendente_(a.nome);
        break;
      }
    }
  });

  // aplica coisa no estoque e apaga
  Object.keys(delta).forEach(cod => { if (delta[cod]) gravarEstoque_(mapa[cod], mapa[cod].estoque + delta[cod]); });
  Object.keys(extras).forEach(n => { if (n !== nomeAba) apagarLinhas_(ss_().getSheetByName(n), extras[n]); });
  apagarLinhas_(sh, idx.concat(extras[nomeAba] || []));

 
  if (tipo === 'SAÍDA') {
    const m = /Pedido (P\S+?)\./.exec(String(dados[idx[0]][M_OBS - 1]));
    const ped = m && acharPedido_(m[1]);
    if (ped && ped.status === 'Entregue') ped.sh.getRange(ped.linha, P_STATUS).setValue('Aguardando');
  }
  return { tipo, linhas: idx.length, teste: eTeste_(dados[idx[0]][M_OBS - 1]) };
}


function excluirLancamento(token, p) {
  exigeEdicao_(token);
  return comTrava_(() => excluirLancamento_(p.aba, p.id, lerItens_().mapa));
}

function excluirPedido(token, id) {
  exigeEdicao_(token);
  return comTrava_(() => {
    const ped = acharPedido_(id);
    if (!ped) throw new Error('Pedido não encontrado.');
    ped.sh.deleteRow(ped.linha);
    return { id };
  });
}

function contarTestes_() {
  const ids = {};
  abasMov_().forEach(a => a.s.getDataRange().getValues().slice(1).forEach(r => {
    if (r[0] && eTeste_(r[M_OBS - 1]) && r[2] !== 'ESTORNO') ids[a.nome + '|' + r[0]] = 1;
  }));
  const ped = ss_().getSheetByName(ABA_PED).getDataRange().getValues().slice(1).filter(r => eTeste_(r[P_OBS - 1])).length;
  return { lancamentos: Object.keys(ids).length, pedidos: ped };
}

function resumoTeste(token) {
  sessao_(token);
  return Object.assign({ modoTeste: cfg_().modoTeste }, contarTestes_());
}

function apagarTestes_() {
  const { mapa } = lerItens_();
  const alvo = [];
  abasMov_().reverse().forEach(a => {
    const vistos = {};
    a.s.getDataRange().getValues().slice(1).reverse().forEach(r => {
      if (!r[0] || vistos[r[0]] || !eTeste_(r[M_OBS - 1])) return;
      vistos[r[0]] = 1;
      if (r[2] !== 'ESTORNO') alvo.push({ aba: a.nome, id: String(r[0]) });
    });
  });
  let ok = 0;
  const falhas = [];
  alvo.forEach(t => {
    try { excluirLancamento_(t.aba, t.id, mapa); ok++; }
    catch (e) { if (!/não encontrado/.test(e.message)) falhas.push(`${t.id}: ${e.message}`); }
  });
  
  const sh = ss_().getSheetByName(ABA_PED);
  const dp = sh.getDataRange().getValues();
  const idxPed = [];
  for (let i = 1; i < dp.length; i++) if (eTeste_(dp[i][P_OBS - 1])) idxPed.push(i);
  apagarLinhas_(sh, idxPed);
  return { lancamentos: ok, pedidos: idxPed.length, falhas };
}

function apagarDadosTeste(token) {
  exigeEdicao_(token);
  return comTrava_(() => apagarTestes_());
}

function menuApagarLinha() {
  const ui = SpreadsheetApp.getUi();
  const sh = SpreadsheetApp.getActiveSheet();
  const linha = sh.getActiveRange().getRow();
  const nome = sh.getName();
  if (linha < 2) { ui.alert('Selecione uma linha de dados (não o cabeçalho).'); return; }
  const id = String(sh.getRange(linha, 1).getValue());
  if (!id) { ui.alert('Essa linha está vazia.'); return; }
  if (nome === ABA_PED) {
    if (ui.alert('Apagar pedido', `Apagar o pedido ${id}?`, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
    comTrava_(() => { const p = acharPedido_(id); if (p) p.sh.deleteRow(p.linha); });
    ui.alert('Pedido apagado.');
    return;
  }
  if (!chaveDeAba_(nome)) { ui.alert('Use numa aba de mês (ex.: "Setembro 2026") ou na aba Pedidos.'); return; }
  const tipo = sh.getRange(linha, 3).getValue(), item = sh.getRange(linha, 7).getValue();
  if (ui.alert('Apagar lançamento', `Apagar o lançamento ${id} (${tipo} — ${item}${' e demais itens do mesmo lançamento'})?\n\n` +
      'O estoque será corrigido automaticamente.', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  try {
    const r = comTrava_(() => excluirLancamento_(nome, id, lerItens_().mapa));
    ui.alert(`Lançamento apagado (${r.linhas} linha(s)). Estoque corrigido.`);
  } catch (e) { ui.alert('Não foi possível apagar: ' + e.message); }
}

function menuApagarTestes() {
  const ui = SpreadsheetApp.getUi();
  const c = contarTestes_();
  if (!c.lancamentos && !c.pedidos) { ui.alert('Não há dados marcados como teste.'); return; }
  if (ui.alert('Apagar dados de teste', `Serão apagados ${c.lancamentos} lançamento(s) e ${c.pedidos} pedido(s) marcados como [TESTE], ` +
      'com o estoque corrigido. Continuar?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  const r = comTrava_(() => apagarTestes_());
  ui.alert(`Pronto: ${r.lancamentos} lançamento(s) e ${r.pedidos} pedido(s) apagados.` +
    (r.falhas.length ? '\n\nNão foi possível apagar:\n' + r.falhas.join('\n') : '') +
    '\n\nLembre de mudar "Modo teste" para Não na aba Config.');
}

function onEdit(e) {
  try {
    const sh = e.range.getSheet();
    if (sh.getName() !== ABA_USR || e.range.getRow() < 2) return;
    if (e.range.getColumn() !== U_EDITA || e.range.getNumRows() !== 1) return;
    const linha = e.range.getRow();
    const valor = String(e.range.getValue()).trim();
    const pinCel = sh.getRange(linha, U_PIN);
    if (valor === 'Sim' && !String(pinCel.getValue()).trim()) pinCel.setNumberFormat('@').setValue(gerarPin_(sh));
    else if (valor === 'Não') pinCel.setValue('');
  } catch (err) { }
}

function gerarPin_(sh) {
  const usados = {};
  const n = sh.getLastRow() - 1;
  if (n > 0) sh.getRange(2, U_PIN, n, 1).getValues().forEach(r => usados[String(r[0])] = true);
  let pin;
  do { pin = String(Math.floor(1000 + Math.random() * 9000)); } while (usados[pin]);
  return pin;
}

function menuNovoPin() {
  const sh = SpreadsheetApp.getActiveSheet();
  const ui = SpreadsheetApp.getUi();
  const linha = sh.getActiveRange().getRow();
  if (sh.getName() !== ABA_USR || linha < 2) { ui.alert('Selecione a linha do usuário na aba Usuarios.'); return; }
  sh.getRange(linha, U_EDITA).setValue('Sim');
  const pin = gerarPin_(sh);
  sh.getRange(linha, U_PIN).setNumberFormat('@').setValue(pin);
  ui.alert('Novo PIN de ' + sh.getRange(linha, U_NOME).getValue() + ': ' + pin);
}

function menuDesconectarTodos() {
  const props = PropertiesService.getScriptProperties();
  Object.keys(props.getProperties()).forEach(k => { if (k.indexOf('s_') === 0) props.deleteProperty(k); });
  SpreadsheetApp.getUi().alert('Todos os usuários foram desconectados.');
}
function menuAvisoAgora() {
  const n = enviarAvisoAtrasos();
  SpreadsheetApp.getUi().alert(cfg_().emails ? `Aviso enviado (${n} ferramenta(s) atrasada(s)).` : 'Preencha o e-mail na aba Config.');
}
function menuResumoAgora() {
  enviarResumoSemanal();
  SpreadsheetApp.getUi().alert(cfg_().emails ? 'Resumo enviado.' : 'Preencha o e-mail na aba Config.');
}
function menuAtivarAutomaticos() {
  ativarAutomaticos_();
  SpreadsheetApp.getUi().alert('Pronto: aviso de atrasos todo dia às 7h e resumo toda segunda às 7h.');
}

/*UTILIDADES */

function cfg_() {
  const v = ss_().getSheetByName(ABA_CONFIG).getDataRange().getValues();
  const achar = re => { const r = v.find(l => re.test(String(l[0]))); return r ? String(r[1]).trim() : ''; };
  const sep = s => s.split(',').map(x => x.trim()).filter(Boolean);
  return {
    emails: achar(/e-?mail/i),
    obras: sep(achar(/obra/i)),
    diasAtraso: Number(achar(/dias/i)) || 7,
    exigirAssinatura: !/^n/i.test(achar(/assinatura/i) || 'Sim'),
    setores: sep(achar(/setor/i) || 'RH, Almoxarifado'),
    modoTeste: /^s/i.test(achar(/teste/i))
  };
}


function lerItens_() {
  const lista = [];
  ABAS_ITENS.forEach(a => {
    const sh = ss_().getSheetByName(a.aba);
    if (!sh) return;
    const dados = sh.getDataRange().getValues();
    const aba = a.aba;
    for (let i = 1; i < dados.length; i++) {
      const r = dados[i];
      if (!String(r[I_COD - 1]).trim()) continue;
      lista.push({
        sh, linha: i + 1, categoria: a.categoria, codigo: String(r[I_COD - 1]).trim(), nome: String(r[I_NOME - 1]),
        tipo: tipoPadrao_(r[I_TIPO - 1], aba) || String(r[I_TIPO - 1]).trim() || 'Material', unidade: String(r[I_UN - 1]),
        estoque: Number(r[I_EST - 1]) || 0, minimo: Number(r[I_MIN - 1]) || 0, preco: Number(r[I_PRECO - 1]) || 0
      });
    }
  });
  const mapa = {};
  lista.forEach(it => mapa[it.codigo] = it);
  return { lista, mapa };
}
const publico_ = i => ({ codigo: i.codigo, nome: i.nome, categoria: i.categoria, tipo: i.tipo, devolve: devolve_(i.tipo), decimal: aceitaDecimal_(i.unidade), unidade: i.unidade,
                         estoque: i.estoque, minimo: i.minimo, preco: i.preco });
const gravarEstoque_ = (item, valor) => { item.estoque = Math.round(valor * 1000) / 1000; item.sh.getRange(item.linha, I_EST).setValue(item.estoque); };

function lerEquipe_() {
  const sh = ss_().getSheetByName(ABA_FUNC);
  if (!sh) return [];
  return sh.getDataRange().getValues().slice(1).filter(r => String(r[F_NOME - 1]).trim()).map(r => ({
    nome: String(r[F_NOME - 1]).trim(), funcao: String(r[F_FUNCAO - 1]).trim(),
    contrato: contratoPadrao_(r[F_CONTRATO - 1]) || 'CLT', ativo: !/^n/i.test(String(r[F_ATIVO - 1]))
  }));
}
const lerFuncionarios_ = () => lerEquipe_().filter(f => f.ativo);

function validarFuncionario_(nome) {
  nome = String(nome || '').trim();
  if (!nome) throw new Error('Escolha quem está retirando.');
  const lista = lerFuncionarios_();
  if (!lista.length) return nome;
  const f = lista.find(x => x.nome.toLowerCase() === nome.toLowerCase());
  if (!f) throw new Error(`"${nome}" não está na lista de funcionários ativos.`);
  return f.nome;
}

const aceitaDecimal_ = un => /metro|^\s*m\s*$|^\s*m[²2]|^\s*mts?\s*$|^\s*ml\s*$/i.test(String(un || ''));
function validarQtd_(item, q) {
  if (!aceitaDecimal_(item.unidade) && !Number.isInteger(q)) {
    throw new Error(`${item.nome} é contado em "${item.unidade}": use número inteiro (vírgula só para itens em metro).`);
  }
}

function agrupar_(itens) {
  if (!itens || !itens.length) throw new Error('Nenhum item selecionado.');
  const soma = {};
  itens.forEach(it => {
    const q = Math.round(num_(it.qtd) * 100) / 100;
    if (!(q > 0)) throw new Error('Quantidade inválida no item ' + it.codigo);
    soma[it.codigo] = Math.round(((soma[it.codigo] || 0) + q) * 100) / 100;
  });
  return Object.keys(soma).map(codigo => ({ codigo, qtd: soma[codigo] }));
}

function comTrava_(fn) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw new Error('Sistema ocupado, tente de novo em alguns segundos.');
  try { const r = fn(); SpreadsheetApp.flush(); return r; }
  finally { lock.releaseLock(); }
}

const novoId_ = prefixo => prefixo + fmt_(new Date(), 'yyMMdd-HHmmss') + Math.floor(Math.random() * 90 + 10);

function email_(assunto, html) {
  const para = cfg_().emails;
  if (!para) return false;
  try { MailApp.sendEmail({ to: para, subject: assunto, htmlBody: html }); return true; }
  catch (e) { return false; }
}

function alertar_(baixos) {
  if (!baixos.length) return;
  email_('Almoxarifado: estoque baixo',
    '<p>Itens no limite ou abaixo do mínimo:</p><ul>' +
    baixos.map(i => `<li><b>${i.nome}</b> (${i.categoria}): ${i.estoque} ${i.unidade} (mínimo ${i.minimo})${i.estoque < 0 ? ' — <b style="color:#c0392b">NEGATIVO: falta lançar entrada</b>' : ''}</li>`).join('') + '</ul>');
}

function salvarArquivo_(subpasta, nome, dados, mime) {
  if (!dados) return '';
  const b64 = String(dados).replace(/^data:[^,]+,/, '');
  const props = PropertiesService.getScriptProperties();
  let raiz = null;
  try { raiz = DriveApp.getFolderById(props.getProperty('pasta_raiz')); } catch (e) { raiz = null; }
  if (!raiz) { raiz = DriveApp.createFolder(PASTA_RAIZ); props.setProperty('pasta_raiz', raiz.getId()); }
  const it = raiz.getFoldersByName(subpasta);
  const pasta = it.hasNext() ? it.next() : raiz.createFolder(subpasta);
  return pasta.createFile(Utilities.newBlob(Utilities.base64Decode(b64), mime || 'image/png', nome)).getUrl();
}

/*LOGIN aqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq*/

function hash_(senha, salt) {
  let b = salt + '|' + senha, d;
  for (let i = 0; i < 200; i++) {
    d = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, b, Utilities.Charset.UTF_8);
    b = Utilities.base64Encode(d) + salt;
  }
  return Utilities.base64Encode(d);
}

function acharUsuario_(email) {
  const sh = ss_().getSheetByName(ABA_USR);
  const dados = sh.getDataRange().getValues();
  email = String(email || '').trim().toLowerCase();
  for (let i = 1; i < dados.length; i++) {
    const r = dados[i];
    if (String(r[U_EMAIL - 1]).trim().toLowerCase() === email) {
      return {
        sh, linha: i + 1, nome: String(r[U_NOME - 1]), email, setor: String(r[U_SETOR - 1]),
        status: String(r[U_STATUS - 1]), edita: String(r[U_EDITA - 1]) === 'Sim',
        pin: String(r[U_PIN - 1]).trim(), hash: String(r[U_HASH - 1]), salt: String(r[U_SALT - 1])
      };
    }
  }
  return null;
}

function criarSessao_(u) {
  const props = PropertiesService.getScriptProperties();
  const agora = Date.now();
  const todas = props.getProperties();
  Object.keys(todas).forEach(k => {
    if (k.indexOf('s_') !== 0) return;
    try { if (JSON.parse(todas[k]).exp < agora) props.deleteProperty(k); } catch (e) { props.deleteProperty(k); }
  });
  const token = Utilities.getUuid() + Utilities.getUuid().slice(0, 8);
  props.setProperty('s_' + token, JSON.stringify({ email: u.email, exp: agora + SESSAO_DIAS * 86400000, editAte: 0 }));
  u.sh.getRange(u.linha, U_ACESSO).setValue(new Date());
  return token;
}

function sessao_(token) {
  const props = PropertiesService.getScriptProperties();
  const bruto = token && props.getProperty('s_' + token);
  if (!bruto) throw new Error('SESSAO: faça login novamente.');
  const s = JSON.parse(bruto);
  if (s.exp < Date.now()) { props.deleteProperty('s_' + token); throw new Error('SESSAO: faça login novamente.'); }
  const u = acharUsuario_(s.email);
  if (!u || u.status === 'Bloqueado') { props.deleteProperty('s_' + token); throw new Error('SESSAO: acesso bloqueado.'); }
  const pode = u.edita && !!u.pin && s.editAte > Date.now();
  return { token, s, u, pode, props };
}

function exigeEdicao_(token) {
  const ctx = sessao_(token);
  if (!ctx.pode) throw new Error('Edição bloqueada. Toque em "Liberar edição" e digite seu PIN.');
  return ctx;
}

const info_ = ctx => ({ nome: ctx.u.nome, email: ctx.u.email, setor: ctx.u.setor,
                        podeEditar: ctx.pode, temPermissao: ctx.u.edita && !!ctx.u.pin, editaAte: ctx.pode ? ctx.s.editAte : 0 });

function setoresCadastro() { return cfg_().setores; }

function criarConta(p) {
  const nome = String(p.nome || '').trim();
  const email = String(p.email || '').trim().toLowerCase();
  const senha = String(p.senha || '');
  if (nome.length < 3) throw new Error('Informe seu nome completo.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('E-mail inválido.');
  if (senha.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.');
  if (cfg_().setores.indexOf(p.setor) < 0) throw new Error('Escolha o setor.');
  return comTrava_(() => {
    if (acharUsuario_(email)) throw new Error('Já existe uma conta com esse e-mail. Use "Entrar".');
    const salt = Utilities.getUuid();
    ss_().getSheetByName(ABA_USR).appendRow([nome, email, p.setor, 'Ativo', 'Não', '', new Date(), '', hash_(senha, salt), salt]);
    const token = criarSessao_(acharUsuario_(email));
    return { token, usuario: info_(sessao_(token)) };
  });
}

function entrar(email, senha) {
  const u = acharUsuario_(email);
  if (!u || hash_(String(senha || ''), u.salt) !== u.hash) throw new Error('E-mail ou senha incorretos.');
  if (u.status === 'Bloqueado') throw new Error('Seu acesso está bloqueado. Fale com o responsável.');
  const token = criarSessao_(u);
  return { token, usuario: info_(sessao_(token)) };
}

function sair(token) {
  if (token) PropertiesService.getScriptProperties().deleteProperty('s_' + token);
  return true;
}

function liberarEdicao(token, pin) {
  const ctx = sessao_(token);
  if (!ctx.u.edita || !ctx.u.pin) throw new Error('Você ainda não tem permissão para editar. Peça ao responsável pela planilha.');
  const cache = CacheService.getScriptCache();
  const chave = 'pin_' + ctx.u.email;
  const erros = Number(cache.get(chave) || 0);
  if (erros >= MAX_TENTATIVAS_PIN) throw new Error('Muitas tentativas erradas. Aguarde 15 minutos.');
  if (String(pin || '').trim() !== ctx.u.pin) {
    cache.put(chave, String(erros + 1), 900);
    throw new Error(`PIN incorreto. Tentativas restantes: ${MAX_TENTATIVAS_PIN - erros - 1}`);
  }
  cache.remove(chave);
  ctx.s.editAte = Date.now() + EDICAO_HORAS * 3600000;
  ctx.props.setProperty('s_' + token, JSON.stringify(ctx.s));
  ctx.pode = true;
  return info_(ctx);
}

function bloquearEdicao(token) {
  const ctx = sessao_(token);
  ctx.s.editAte = 0;
  ctx.props.setProperty('s_' + token, JSON.stringify(ctx.s));
  ctx.pode = false;
  return info_(ctx);
}


function pendentes_() {
  const props = PropertiesService.getScriptProperties();
  const indice = JSON.parse(props.getProperty('abas_pend') || 'null');
  const todas = abasMov_();
  let nomes = indice ? indice.slice() : todas.map(a => a.nome);

  // sempre olha o mês atual e o anterior só pra nao dar bosta

  todas.slice(-2).forEach(a => { if (nomes.indexOf(a.nome) < 0) nomes.push(a.nome); });
  const out = [], comPend = [];
  nomes.forEach(nome => {
    const sh = ss_().getSheetByName(nome);
    if (!sh || !chaveDeAba_(nome)) return;
    const dados = sh.getDataRange().getValues();
    let tem = false;
    for (let i = 1; i < dados.length; i++) {
      const r = dados[i];
      const pend = Number(r[M_PEND - 1]) || 0;
      if (r[2] === 'SAÍDA' && pend > 0) {
        tem = true;
        out.push({
          aba: nome, linha: i + 1, pedido: String(r[0]), data: fmt_(r[1], 'dd/MM HH:mm'),
          dia: fmt_(r[1], 'yyyy-MM-dd'), diaTxt: fmt_(r[1], 'dd/MM/yyyy'),
          dias: Math.floor((Date.now() - new Date(r[1]).getTime()) / 86400000),
          pessoa: String(r[3]), obra: String(r[4]), codigo: String(r[5]), item: String(r[6]), pendente: pend
        });
      }
    }
    if (tem) comPend.push(nome);
  });
  props.setProperty('abas_pend', JSON.stringify(comPend));
  return out.sort((a, b) => b.dias - a.dias);
}


function ultimas_(limite) {
  const out = [];
  const abas = abasMov_().reverse();
  for (let k = 0; k < abas.length && out.length < limite; k++) {
    const sh = abas[k].s;
    const n = sh.getLastRow() - 1;
    if (n < 1) continue;
    const dados = sh.getRange(2, 1, n, M_COLS).getValues();
    for (let i = dados.length - 1; i >= 0 && out.length < limite; i--) {
      const r = dados[i];
      if (!r[0]) continue;
      const t = new Date(r[1]).getTime();
      out.push({
        aba: abas[k].nome, id: String(r[0]), data: fmt_(r[1], 'dd/MM HH:mm'), dia: fmt_(r[1], 'yyyy-MM-dd'),
        mov: String(r[2]), pessoa: String(r[3]), obra: String(r[4]), codigo: String(r[5]), item: String(r[6]),
        qtd: r[7], por: String(r[8]), obs: String(r[10]), anexo: String(r[11] || ''), teste: /\[TESTE\]/.test(String(r[10])),
        estornavel: (r[2] === 'SAÍDA' || r[2] === 'ENTRADA') && !/^\[ESTORNADO\]/.test(String(r[10])) &&
                    Date.now() - t < ESTORNO_HORAS * 3600000
      });
    }
  }
  return out;
}

function painel_(itens) {
  const c = cfg_();
  const baixos = itens.filter(i => i.estoque <= i.minimo)
    .sort((a, b) => a.estoque / (a.minimo || 1) - b.estoque / (b.minimo || 1));
  const pend = pendentes_();
  const hoje = fmt_(new Date(), 'yyyy-MM-dd');
  const ult = ultimas_(60);
  const idsHoje = { 'SAÍDA': {}, 'ENTRADA': {}, 'DEVOLUÇÃO': {} };
  ult.forEach(u => { if (u.dia === hoje && idsHoje[u.mov]) idsHoje[u.mov][u.id] = 1; });
  return {
    baixos: baixos.slice(0, 6).map(publico_), nBaixos: baixos.length,
    fora: pend.reduce((s, p) => s + p.pendente, 0),
    atrasadas: pend.filter(p => p.dias >= c.diasAtraso).slice(0, 5),
    nAtrasadas: pend.filter(p => p.dias >= c.diasAtraso).length,
    hoje: { saidas: Object.keys(idsHoje['SAÍDA']).length, entradas: Object.keys(idsHoje['ENTRADA']).length,
            devolucoes: Object.keys(idsHoje['DEVOLUÇÃO']).length },
    ultimas: ult.slice(0, 6)
  };
}

function carregar(token) {
  const ctx = sessao_(token);
  const c = cfg_();
  const { lista } = lerItens_();
  let url = '';
  try { url = ScriptApp.getService().getUrl(); } catch (e) { /* ignora */ }
  const meses = abasMov_().map(a => a.chave);
  const atual = fmt_(new Date(), 'yyyy-MM');
  if (meses.indexOf(atual) < 0) meses.push(atual);
  return {
    usuario: info_(ctx), itens: lista.map(publico_), obras: c.obras,
    funcionarios: lerFuncionarios_(), unidadesObra: UNIDADES_OBRA, tiposObra: TIPOS_OBRA, tiposElet: TIPOS_ELET, exigirAssinatura: c.exigirAssinatura, diasAtraso: c.diasAtraso,
    url, pedidosAbertos: contarPedidosAbertos_(), modoTeste: c.modoTeste, painel: painel_(lista), meses: meses.sort().reverse()
  };
}

function listarPendentes(token) { sessao_(token); return pendentes_(); }
function historico(token) { sessao_(token); return ultimas_(400); }

/*RETIRADA / ENTRADA / DEVOLUÇÃO */

function registrarSaida(token, p) {
  const ctx = exigeEdicao_(token);
  const pessoa = validarFuncionario_(p.funcionario);
  const pedidoItens = agrupar_(p.itens);
  if (cfg_().exigirAssinatura && !p.assinatura) throw new Error('Falta a assinatura de quem está retirando.');

  return comTrava_(() => {
    const { mapa } = lerItens_();
    pedidoItens.forEach(it => {
      const item = mapa[it.codigo];
      if (!item) throw new Error('Item não encontrado: ' + it.codigo);
      validarQtd_(item, it.qtd);
      
    });
    let ped = null;
    if (p.pedidoId) {
      ped = acharPedido_(p.pedidoId);
      if (!ped || ['Aguardando', 'Separado'].indexOf(ped.status) < 0) throw new Error('Esse pedido não está mais em aberto.');
    }
    const id = novoId_('S'), agora = new Date(), linhas = [], baixos = [], negativos = [];
    const link = p.assinatura ? salvarArquivo_('Assinaturas', `${id} - ${pessoa}.png`, p.assinatura, 'image/png') : '';
    pedidoItens.forEach(it => {
      const item = mapa[it.codigo];
      gravarEstoque_(item, item.estoque - it.qtd);
      linhas.push([id, agora, 'SAÍDA', pessoa, p.obra || '', item.codigo, item.nome, it.qtd, ctx.u.nome,
        devolve_(item.tipo) ? it.qtd : '', (p.pedidoId ? 'Pedido ' + p.pedidoId + '. ' : '') + (p.obs || ''), link]);
      if (item.estoque <= item.minimo) baixos.push(item);
      if (item.estoque < 0) negativos.push(`${item.nome} (${String(item.estoque).replace('.', ',')} ${item.unidade})`);
    });
    anexar_(linhas);
    if (ped) mudarStatusPedido_(ped, 'Entregue', ctx.u.nome);
    alertar_(baixos);
    return { pedido: id, total: linhas.length, negativos };
  });
}

function registrarEntrada(token, p) {
  const ctx = exigeEdicao_(token);
  const pedidoItens = agrupar_(p.itens);
  return comTrava_(() => {
    const { mapa } = lerItens_();
    pedidoItens.forEach(it => {
      if (!mapa[it.codigo]) throw new Error('Item não encontrado: ' + it.codigo);
      validarQtd_(mapa[it.codigo], it.qtd);
    });
    const id = novoId_('E'), agora = new Date(), linhas = [];
    const a = p.anexo;
    const link = a && a.dados ? salvarArquivo_('Notas fiscais', `${id} - ${a.nome || 'nota'}`, a.dados, a.mime) : '';
    pedidoItens.forEach(it => {
      const item = mapa[it.codigo];
      gravarEstoque_(item, item.estoque + it.qtd);
      linhas.push([id, agora, 'ENTRADA', p.origem || '', '', item.codigo, item.nome, it.qtd, ctx.u.nome, '', p.obs || '', link]);
    });
    anexar_(linhas);
    return { pedido: id, total: linhas.length };
  });
}


function registrarDevolucao(token, p) {
  const ctx = exigeEdicao_(token);
  if (!p.itens || !p.itens.length) throw new Error('Selecione o que foi devolvido.');
  return comTrava_(() => {
    const { mapa } = lerItens_();
    const id = novoId_('D'), agora = new Date(), linhas = [];
    p.itens.forEach(d => {
      if (!chaveDeAba_(d.aba)) throw new Error('Registro inválido. Atualize a tela.');
      const sh = ss_().getSheetByName(d.aba);
      if (!sh) throw new Error('Registro inválido. Atualize a tela.');
      const q = num_(d.qtd);
      const r = sh.getRange(d.linha, 1, 1, M_PEND).getValues()[0];
      const pend = Number(r[M_PEND - 1]) || 0;
      if (r[2] !== 'SAÍDA' || (d.pedido && String(r[0]) !== String(d.pedido)))
        throw new Error('A lista mudou desde que você abriu a tela. Atualize e tente de novo.');
      if (!(q > 0) || q > pend) throw new Error(`Quantidade inválida para ${r[6]} (pendente: ${pend}).`);
      const item = mapa[String(r[5])];
      if (!item) throw new Error('Item não encontrado: ' + r[5]);
      sh.getRange(d.linha, M_PEND).setValue(pend - q);
      gravarEstoque_(item, item.estoque + q);
      linhas.push([id, agora, 'DEVOLUÇÃO', r[3], r[4], item.codigo, item.nome, q, ctx.u.nome, '', 'Ref. ' + r[0]]);
    });
    anexar_(linhas);
    return { pedido: id, total: linhas.length };
  });
}


function ajustarEstoque(token, p) {
  const ctx = exigeEdicao_(token);
  const novo = num_(p.contagem);
  if (!(novo >= 0)) throw new Error('Informe a quantidade contada.');
  const motivo = String(p.motivo || '').trim();
  if (!motivo) throw new Error('Escolha o motivo do ajuste.');
  return comTrava_(() => {
    const { mapa } = lerItens_();
    const item = mapa[p.codigo];
    if (!item) throw new Error('Item não encontrado.');
    const antes = item.estoque;
    const dif = Math.round((novo - antes) * 1000) / 1000;
    if (dif === 0) throw new Error('A contagem é igual ao estoque atual. Nada a ajustar.');
    gravarEstoque_(item, novo);
    anexar_([[novoId_('A'), new Date(), 'AJUSTE', motivo, '', item.codigo, item.nome, dif, ctx.u.nome, '',
      `De ${antes} para ${novo}. ${p.obs || ''}`.trim()]]);
    if (item.estoque <= item.minimo) alertar_([item]);
    return { diferenca: dif };
  });
}

function estornar(token, p) {
  const ctx = exigeEdicao_(token);
  if (!chaveDeAba_(p.aba)) throw new Error('Registro inválido.');
  return comTrava_(() => {
    const sh = ss_().getSheetByName(p.aba);
    if (!sh) throw new Error('Registro inválido.');
    const dados = sh.getDataRange().getValues();
    const idx = [];
    for (let i = 1; i < dados.length; i++) if (String(dados[i][0]) === String(p.id)) idx.push(i);
    if (!idx.length) throw new Error('Lançamento não encontrado.');
    const tipo = dados[idx[0]][2];
    if (tipo !== 'SAÍDA' && tipo !== 'ENTRADA') throw new Error('Só retiradas e entradas podem ser estornadas.');
    if (idx.some(i => /^\[ESTORNADO\]/.test(String(dados[i][M_OBS - 1])))) throw new Error('Esse lançamento já foi estornado.');
    if (Date.now() - new Date(dados[idx[0]][1]).getTime() > ESTORNO_HORAS * 3600000) {
      throw new Error(`Só dá para estornar até ${ESTORNO_HORAS} horas depois. Use o ajuste de inventário.`);
    }
    const { mapa } = lerItens_();
    idx.forEach(i => {        
      const r = dados[i], item = mapa[String(r[5])], q = Number(r[7]) || 0;
      if (!item) throw new Error('Item não encontrado: ' + r[5]);
      if (tipo === 'SAÍDA' && devolve_(item.tipo) && (Number(r[M_PEND - 1]) || 0) !== q) {
        throw new Error(`${item.nome} já teve devolução. Estorne a devolução pelo ajuste de inventário.`);
      }
    });
    const novo = novoId_('X'), agora = new Date(), linhas = [];
    idx.forEach(i => {
      const r = dados[i], item = mapa[String(r[5])], q = Number(r[7]) || 0;
      gravarEstoque_(item, tipo === 'SAÍDA' ? item.estoque + q : item.estoque - q);
      if (tipo === 'SAÍDA') sh.getRange(i + 1, M_PEND).setValue(r[M_PEND - 1] === '' ? '' : 0);
      sh.getRange(i + 1, M_OBS).setValue('[ESTORNADO] ' + r[M_OBS - 1]);
      linhas.push([novo, agora, 'ESTORNO', r[3], r[4], item.codigo, item.nome, q, ctx.u.nome, '',
        `Estorno de ${tipo.toLowerCase()} ${p.id}${p.motivo ? ': ' + p.motivo : ''}`]);
    });
    anexar_(linhas);
    return { total: linhas.length };
  });
}

/*CADASTROS */


function excluirItem(token, codigo) {
  exigeEdicao_(token);
  return comTrava_(() => {
    const { mapa } = lerItens_();
    const item = mapa[codigo];
    if (!item) throw new Error('Item não encontrado (talvez já tenha sido excluído). Atualize a tela.');
    const fora = pendentes_().filter(p => p.codigo === item.codigo).reduce((s, p) => s + p.pendente, 0);
    if (fora > 0) throw new Error(`Não dá para excluir: ${fora} ${item.unidade} de ${item.nome} ainda estão fora (não devolvidos). Registre a devolução antes.`);
    item.sh.deleteRow(item.linha);
    return { codigo: item.codigo, nome: item.nome };
  });
}

function editarItem(token, p) {
  exigeEdicao_(token);
  const nome = String(p.nome || '').trim().replace(/\s+/g, ' ');
  if (nome.length < 2) throw new Error('Informe o nome do item.');
  return comTrava_(() => {
    const { lista, mapa } = lerItens_();
    const item = mapa[p.codigo];
    if (!item) throw new Error('Item não encontrado. Atualize a tela.');
    if (lista.some(i => i.codigo !== item.codigo && i.nome.toLowerCase() === nome.toLowerCase())) {
      throw new Error('Já existe outro item com esse nome.');
    }
    const tipo = tipoPadrao_(p.tipo, item.sh.getName());
    if (!tipo) throw new Error('Escolha um tipo da lista.');
    const mudou = [];
    if (nome !== item.nome) { item.sh.getRange(item.linha, I_NOME).setValue(nome); mudou.push('nome'); }
    if (tipo !== item.tipo) { item.sh.getRange(item.linha, I_TIPO).setValue(tipo); mudou.push('tipo'); }
    if (!mudou.length) throw new Error('Nada foi alterado.');
    return { codigo: item.codigo, nome, tipo, mudou };
  });
}

function cadastrarItem(token, p) {
  exigeEdicao_(token);
  const nome = String(p.nome || '').trim();
  if (!nome) throw new Error('Informe o nome do item.');
  const destino = ABAS_ITENS.find(a => a.categoria === p.categoria) || ABAS_ITENS[0];
  const tipo = tipoPadrao_(p.tipo, destino.aba);
  if (!tipo) throw new Error('Escolha o tipo do item.');
  let unidade = String(p.unidade || '').trim() || 'un';
  if (destino.aba === ABA_OBRA) {
    unidade = unidadeObra_(unidade);
    if (!unidade) throw new Error('Escolha uma unidade da lista.');
  }
  return comTrava_(() => {
    const { lista } = lerItens_();
    if (lista.some(i => i.nome.toLowerCase() === nome.toLowerCase())) throw new Error('Já existe um item com esse nome.');
    const max = lista.filter(i => i.codigo.indexOf(destino.prefixo) === 0)
      .reduce((m, i) => Math.max(m, parseInt(i.codigo.slice(2), 10) || 0), 0);
    const codigo = destino.prefixo + String(max + 1).padStart(3, '0');
    ss_().getSheetByName(destino.aba).appendRow([codigo, nome, tipo, unidade,
      num_(p.estoque) || 0, num_(p.minimo) || 0, num_(p.preco) || 0]);
    return { codigo };
  });
}

function cadastrarFuncionario(token, p) {
  exigeEdicao_(token);
  const nome = String(p.nome || '').trim().replace(/\s+/g, ' ');
  if (nome.length < 3) throw new Error('Informe o nome completo do funcionário.');
  const contrato = contratoPadrao_(p.contrato);
  if (!contrato) throw new Error('Escolha o tipo de contrato (CLT, PJ ou Jovem Aprendiz).');
  return comTrava_(() => {
    const sh = ss_().getSheetByName(ABA_FUNC);
    const existe = sh.getDataRange().getValues().slice(1).some(r => String(r[0]).trim().toLowerCase() === nome.toLowerCase());
    if (existe) throw new Error('Esse funcionário já está cadastrado (veja se está como Ativo = Sim na planilha).');
    sh.appendRow([nome, String(p.funcao || '').trim(), contrato, 'Sim']);
    return { nome };
  });
}


function equipe(token) {
  sessao_(token);
  const pend = pendentes_();
  const atual = abaMes_(new Date(), false);
  const ret = {};
  if (atual && atual.getLastRow() > 1) {
    atual.getRange(2, 1, atual.getLastRow() - 1, 4).getValues().forEach(r => {
      if (r[2] !== 'SAÍDA') return;
      const k = String(r[3]).toLowerCase();
      (ret[k] = ret[k] || {})[r[0]] = 1;
    });
  }
  return lerEquipe_().map(f => {
    const k = f.nome.toLowerCase();
    const minhas = pend.filter(p => p.pessoa.toLowerCase() === k);
    return Object.assign(f, {
      ferramentas: minhas, qtdFerramentas: minhas.reduce((s, p) => s + p.pendente, 0),
      retiradasMes: Object.keys(ret[k] || {}).length
    });
  }).filter(f => f.ativo || f.qtdFerramentas > 0);
}


function acharPedido_(id) {
  const sh = ss_().getSheetByName(ABA_PED);
  const dados = sh.getDataRange().getValues();
  for (let i = dados.length - 1; i >= 1; i--) {
    if (String(dados[i][P_ID - 1]) === String(id)) {
      return { sh, linha: i + 1, id: String(id), status: String(dados[i][P_STATUS - 1]), email: String(dados[i][P_EMAIL - 1]) };
    }
  }
  return null;
}

function mudarStatusPedido_(ped, status, por) {
  ped.sh.getRange(ped.linha, P_STATUS).setValue(status);
  ped.sh.getRange(ped.linha, P_ATEND).setValue(por);
  ped.sh.getRange(ped.linha, P_ATUAL).setValue(new Date());
}

function contarPedidosAbertos_() {
  const sh = ss_().getSheetByName(ABA_PED);
  if (!sh) return 0;
  return sh.getDataRange().getValues().slice(1)
    .filter(r => ['Aguardando', 'Separado'].indexOf(String(r[P_STATUS - 1])) >= 0).length;
}

function criarPedido(token, p) {
  const ctx = sessao_(token);
  const func = validarFuncionario_(p.funcionario);
  const itens = agrupar_(p.itens);
  return comTrava_(() => {
    const { mapa } = lerItens_();
    const det = itens.map(it => {
      const item = mapa[it.codigo];
      if (!item) throw new Error('Item não encontrado: ' + it.codigo);
      validarQtd_(item, it.qtd);
      return { codigo: it.codigo, qtd: it.qtd, nome: item.nome, unidade: item.unidade };
    });
    const id = novoId_('P');
    ss_().getSheetByName(ABA_PED).appendRow([id, new Date(), ctx.u.nome, ctx.u.email, func, p.obra || '',
      det.map(d => `${d.qtd} ${d.unidade} ${d.nome}`).join('; '), JSON.stringify(det),
      'Aguardando', ((cfg_().modoTeste ? '[TESTE] ' : '') + (p.obs || '')).trim(), '', new Date()]);
    return { id };
  });
}

function listarPedidos(token) {
  const ctx = sessao_(token);
  const dados = ss_().getSheetByName(ABA_PED).getDataRange().getValues();
  const abertos = [], fechados = [];
  for (let i = dados.length - 1; i >= 1; i--) {
    const r = dados[i];
    if (!r[P_ID - 1]) continue;
    let itens = [];
    try { itens = JSON.parse(r[P_JSON - 1]); } catch (e) { /* ignora */ }
    const o = {
      id: String(r[P_ID - 1]), data: fmt_(r[P_DATA - 1], 'dd/MM HH:mm'), solicitante: String(r[P_SOLIC - 1]),
      meu: String(r[P_EMAIL - 1]).toLowerCase() === ctx.u.email, funcionario: String(r[P_FUNC - 1]),
      obra: String(r[P_OBRA - 1]), itens, status: String(r[P_STATUS - 1]), obs: String(r[P_OBS - 1]),
      atendidoPor: String(r[P_ATEND - 1]), teste: /\[TESTE\]/.test(String(r[P_OBS - 1]))
    };
    if (['Aguardando', 'Separado'].indexOf(o.status) >= 0) abertos.push(o);
    else if (fechados.length < 60) fechados.push(o);
  }
  abertos.reverse();
  return { abertos, fechados };
}

function atualizarPedido(token, id, status) {
  const ctx = sessao_(token);
  return comTrava_(() => {
    const ped = acharPedido_(id);
    if (!ped || ['Aguardando', 'Separado'].indexOf(ped.status) < 0) throw new Error('Esse pedido não está mais em aberto.');
    if (status === 'Separado') {
      if (!ctx.pode) throw new Error('Edição bloqueada. Toque em "Liberar edição" e digite seu PIN.');
    } else if (status === 'Cancelado') {
      if (!ctx.pode && ped.email.toLowerCase() !== ctx.u.email) throw new Error('Só quem fez o pedido ou o almoxarife pode cancelar.');
    } else throw new Error('Status inválido.');
    mudarStatusPedido_(ped, status, ctx.u.nome);
    return { id, status };
  });
}

/*RELATÓRIOS*/

function consumo_(ini, fim) {
  const { mapa } = lerItens_();
  const cIni = fmt_(ini, 'yyyy-MM'), cFim = fmt_(fim - 1, 'yyyy-MM');
  const obras = {}, top = {}, porCat = { 'Obra': 0, 'Elétrica': 0 }, porCatQtd = { 'Obra': 0, 'Elétrica': 0 };
  const retiradas = {}, entradas = {};
  let custoTotal = 0;
  abasMov_().filter(a => a.chave >= cIni && a.chave <= cFim).forEach(a => {
    const dados = a.s.getDataRange().getValues();
    for (let i = 1; i < dados.length; i++) {
      const r = dados[i];
      const t = new Date(r[1]).getTime();
      if (!(t >= ini && t < fim)) continue;
      if (/^\[ESTORNADO\]/.test(String(r[M_OBS - 1]))) continue;
      if (r[2] === 'ENTRADA') entradas[r[0]] = 1;
      if (r[2] !== 'SAÍDA') continue;
      retiradas[r[0]] = 1;
      const cod = String(r[5]);
      const it = mapa[cod] || { tipo: 'Material', unidade: '', preco: 0, categoria: /^EL/i.test(cod) ? 'Elétrica' : 'Obra' };
      const nomeObra = String(r[4] || '').trim() || 'Sem obra';
      const o = obras[nomeObra] = obras[nomeObra] || { obra: nomeObra, consumo: {}, ferramentas: {}, custo: 0 };
      const grupo = devolve_(it.tipo) ? o.ferramentas : o.consumo;
      const g = grupo[cod] = grupo[cod] || { nome: String(r[6]), unidade: it.unidade, categoria: it.categoria, qtd: 0, custo: 0 };
      const q = Number(r[7]) || 0;
      g.qtd += q;
      if (!devolve_(it.tipo)) {
        const custo = q * (it.preco || 0);
        g.custo += custo; o.custo += custo; custoTotal += custo;
        porCat[it.categoria] = (porCat[it.categoria] || 0) + custo;
        porCatQtd[it.categoria] = (porCatQtd[it.categoria] || 0) + q;
        const tp = top[cod] = top[cod] || { nome: String(r[6]), unidade: it.unidade, categoria: it.categoria, qtd: 0, custo: 0 };
        tp.qtd += q; tp.custo += custo;
      }
    }
  });
  const lista = Object.keys(obras).map(k => {
    const o = obras[k];
    return { obra: o.obra, custo: o.custo,
      consumo: Object.keys(o.consumo).map(c => o.consumo[c]).sort((a, b) => b.qtd - a.qtd),
      ferramentas: Object.keys(o.ferramentas).map(c => o.ferramentas[c]).sort((a, b) => b.qtd - a.qtd) };
  }).sort((a, b) => b.custo - a.custo || a.obra.localeCompare(b.obra));
  return {
    obras: lista, custoTotal, porCategoria: porCat, porCategoriaQtd: porCatQtd,
    retiradas: Object.keys(retiradas).length, entradas: Object.keys(entradas).length,
    top: Object.keys(top).map(k => top[k]).sort((a, b) => b.qtd - a.qtd).slice(0, 6)
  };
}

function relatorioObras(token, mes) {
  sessao_(token);
  const [a, m] = String(mes).split('-').map(Number);
  if (!a || !m) throw new Error('Mês inválido.');
  return consumo_(new Date(a, m - 1, 1).getTime(), new Date(a, m, 1).getTime());
}


function pasta_(subpasta) {
  const props = PropertiesService.getScriptProperties();
  let raiz = null;
  try { raiz = DriveApp.getFolderById(props.getProperty('pasta_raiz')); } catch (e) { raiz = null; }
  if (!raiz) { raiz = DriveApp.createFolder(PASTA_RAIZ); props.setProperty('pasta_raiz', raiz.getId()); }
  const it = raiz.getFoldersByName(subpasta);
  return it.hasNext() ? it.next() : raiz.createFolder(subpasta);
}


function periodo_(p) {
  let ini, fim;
  if (p.mes) {
    const [a, m] = String(p.mes).split('-').map(Number);
    if (!a || !m) throw new Error('Mês de referência inválido.');
    ini = new Date(a, m - 1, 1); fim = new Date(a, m, 1);
  } else {
    const d = x => { const [a, m, dd] = String(x || '').split('-').map(Number); return a && m && dd ? new Date(a, m - 1, dd) : null; };
    ini = d(p.ini); const f = d(p.fim);
    if (!ini || !f) throw new Error('Informe a data inicial e a final.');
    fim = new Date(f.getFullYear(), f.getMonth(), f.getDate() + 1);
  }
  if (fim <= ini) throw new Error('A data final precisa ser depois da inicial.');
  if (fim - ini > 400 * 86400000) throw new Error('Escolha um período de até 1 ano.');
  const txt = p.mes ? 'Mês de referência ' + fmt_(ini, 'MM/yyyy') + ' (' + fmt_(ini, 'dd/MM/yyyy') + ' a ' + fmt_(fim - 86400000, 'dd/MM/yyyy') + ')'
                    : 'Período de ' + fmt_(ini, 'dd/MM/yyyy') + ' a ' + fmt_(fim - 86400000, 'dd/MM/yyyy');
  return { ini: ini.getTime(), fim: fim.getTime(), txt, iniTxt: fmt_(ini, 'dd/MM/yyyy'), fimTxt: fmt_(fim - 86400000, 'dd/MM/yyyy') };
}


function movsPeriodo_(ini, fim, mapa) {
  const cIni = fmt_(ini, 'yyyy-MM'), cFim = fmt_(fim - 1, 'yyyy-MM');
  const out = [];
  abasMov_().filter(a => a.chave >= cIni && a.chave <= cFim).forEach(a => {
    a.s.getDataRange().getValues().slice(1).forEach(r => {
      if (!r[0]) return;
      const t = new Date(r[1]).getTime();
      if (!(t >= ini && t < fim) || r[2] === 'ESTORNO' || /^\[ESTORNADO\]/.test(String(r[M_OBS - 1]))) return;
      const it = mapa[String(r[5])] || {};
      out.push({ t, data: fmt_(r[1], 'dd/MM/yyyy HH:mm'), id: String(r[0]), mov: String(r[2]), pessoa: String(r[3]),
        obra: String(r[4]), codigo: String(r[5]), item: String(r[6]), qtd: Number(r[7]) || 0, unidade: it.unidade || '',
        categoria: it.categoria || (/^EL/i.test(String(r[5])) ? 'Elétrica' : 'Obra'), devolve: devolve_(it.tipo),
        preco: it.preco || 0, por: String(r[8]), pendente: Number(r[M_PEND - 1]) || 0,
        obs: String(r[M_OBS - 1]).replace(/\[TESTE\]\s*/, '') });
    });
  });
  return out.sort((a, b) => a.t - b.t);
}

function relatorio_(p) {
  const per = periodo_(p);
  const { mapa } = lerItens_();
  const movs = movsPeriodo_(per.ini, per.fim, mapa);
  const equipe = {};
  lerEquipe_().forEach(f => equipe[f.nome.toLowerCase()] = f);
  const pend = pendentes_();
  const ids = tipo => Object.keys(movs.filter(m => m.mov === tipo).reduce((o, m) => (o[m.id] = 1, o), {})).length;

  if (p.tipo === 'colaborador') {
    const nome = String(p.funcionario || '').trim();
    if (!nome) throw new Error('Escolha o colaborador.');
    const k = nome.toLowerCase();
    const f = equipe[k] || { nome, funcao: '', contrato: '' };
    const meus = movs.filter(m => m.pessoa.toLowerCase() === k);
    const ret = meus.filter(m => m.mov === 'SAÍDA'), dev = meus.filter(m => m.mov === 'DEVOLUÇÃO');
    const posse = pend.filter(x => x.pessoa.toLowerCase() === k);
    const custo = ret.filter(m => !m.devolve).reduce((s, m) => s + m.qtd * m.preco, 0);
    return {
      tipo: 'colaborador', periodo: per, nome: f.nome, funcao: f.funcao, contrato: f.contrato,
      resumo: { retiradas: Object.keys(ret.reduce((o, m) => (o[m.id] = 1, o), {})).length,
                itens: ret.reduce((s, m) => s + m.qtd, 0), devolucoes: dev.reduce((s, m) => s + m.qtd, 0),
                emPosse: posse.reduce((s, x) => s + x.pendente, 0), custo },
      retiradas: ret, devolucoes: dev, posse
    };
  }

  const porPessoa = {};
  movs.forEach(m => {
    if (m.mov !== 'SAÍDA' && m.mov !== 'DEVOLUÇÃO') return;
    const k = m.pessoa.toLowerCase();
    const o = porPessoa[k] = porPessoa[k] || { nome: m.pessoa, contrato: (equipe[k] || {}).contrato || '', funcao: (equipe[k] || {}).funcao || '',
                                               retiradas: {}, itens: 0, devolvidos: 0, custo: 0 };
    if (m.mov === 'SAÍDA') { o.retiradas[m.id] = 1; o.itens += m.qtd; if (!m.devolve) o.custo += m.qtd * m.preco; }
    else o.devolvidos += m.qtd;
  });
  const colaboradores = Object.keys(porPessoa).map(k => {
    const o = porPessoa[k];
    return { nome: o.nome, contrato: o.contrato, funcao: o.funcao, retiradas: Object.keys(o.retiradas).length, itens: o.itens,
             devolvidos: o.devolvidos, custo: o.custo, emPosse: pend.filter(x => x.pessoa.toLowerCase() === k).reduce((s, x) => s + x.pendente, 0) };
  }).sort((a, b) => b.itens - a.itens);
  const c = consumo_(per.ini, per.fim);
  return {
    tipo: 'empregador', periodo: per,
    resumo: { retiradas: ids('SAÍDA'), entradas: ids('ENTRADA'), devolucoes: ids('DEVOLUÇÃO'), ajustes: ids('AJUSTE'),
              itensRetirados: movs.filter(m => m.mov === 'SAÍDA').reduce((s, m) => s + m.qtd, 0),
              custoTotal: c.custoTotal, colaboradores: colaboradores.length,
              foraAgora: pend.reduce((s, x) => s + x.pendente, 0) },
    estoque: lerItens_().lista
      .sort((a, b) => (a.categoria === b.categoria ? 0 : a.categoria === 'Obra' ? -1 : 1) || a.codigo.localeCompare(b.codigo))
      .map(i => ({ codigo: i.codigo, nome: i.nome, tipo: i.tipo, quantidade: i.estoque, minimo: i.minimo,
                   unidade: i.unidade, categoria: i.categoria }))
  };
}

function relatorio(token, p) {
  sessao_(token);
  const r = relatorio_(p);
  if (r.movimentos && r.movimentos.length > 600) { r.movimentosTotal = r.movimentos.length; r.movimentos = r.movimentos.slice(-600); }
  return r;
}


function exportarRelatorio(token, p, formato) {
  const ctx = sessao_(token);
  const r = relatorio_(p);
  const titulo = r.tipo === 'colaborador' ? `Relatório do Colaborador - ${r.nome}` : 'Relatório do Empregador - Almoxarifado';
  const nomeArq = `${titulo} - ${r.periodo.iniTxt.replace(/\//g, '-')} a ${r.periodo.fimTxt.replace(/\//g, '-')}`;
  const linhas = [], estilos = [];          
  const add = (vals, tipo) => { if (tipo) estilos.push({ linha: linhas.length + 1, tipo, n: vals.length }); linhas.push(vals); };
  const moeda = v => v ? Math.round(v * 100) / 100 : '';

  add([titulo], 'titulo');
  add([r.periodo.txt]);
  add([`Gerado em ${fmt_(new Date(), 'dd/MM/yyyy HH:mm')} por ${ctx.u.nome}`]);
  add(['']);
  if (r.tipo === 'colaborador') {
    add(['Colaborador', r.nome]); add(['Função', r.funcao || '-']); add(['Contrato', r.contrato || '-']); add(['']);
    add(['RESUMO'], 'secao');
    add(['Retiradas', r.resumo.retiradas]); add(['Quantidade retirada', r.resumo.itens]);
    add(['Quantidade devolvida', r.resumo.devolucoes]); add(['Ferramentas em posse hoje', r.resumo.emPosse]);
    if (r.resumo.custo) add(['Custo dos materiais (R$)', moeda(r.resumo.custo)]);
    add(['']);
    add(['RETIRADAS'], 'secao');
    add(['Data', 'Obra / Elétrica / MND', 'Código', 'Item', 'Qtd', 'Unidade', 'Devolver?', 'Ainda fora', 'Registrado por'], 'cab');
    r.retiradas.forEach(m => add([m.data, m.obra, m.codigo, m.item, m.qtd, m.unidade, m.devolve ? 'Sim' : 'Não', m.devolve ? m.pendente : '', m.por]));
    if (!r.retiradas.length) add(['Nenhuma retirada no período']);
    add(['']);
    add(['DEVOLUÇÕES'], 'secao');
    add(['Data', 'Obra / Elétrica / MND', 'Código', 'Item', 'Qtd', 'Unidade', 'Recebido por'], 'cab');
    r.devolucoes.forEach(m => add([m.data, m.obra, m.codigo, m.item, m.qtd, m.unidade, m.por]));
    if (!r.devolucoes.length) add(['Nenhuma devolução no período']);
    add(['']);
    add(['FERRAMENTAS EM POSSE (HOJE)'], 'secao');
    add(['Retirada em', 'Obra / Elétrica / MND', 'Código', 'Item', 'Qtd fora', 'Dias fora'], 'cab');
    r.posse.forEach(x => add([x.diaTxt || x.data, x.obra, x.codigo, x.item, x.pendente, x.dias]));
    if (!r.posse.length) add(['Nenhuma ferramenta em posse']);
    add(['']); add(['']);
    add(['Assinatura do colaborador: ______________________________', '', '', 'Assinatura do responsável: ______________________________']);
  } else {
    add(['RESUMO'], 'secao');
    add(['Retiradas', r.resumo.retiradas]); add(['Quantidade retirada', r.resumo.itensRetirados]);
    add(['Entradas', r.resumo.entradas]); add(['Devoluções', r.resumo.devolucoes]); add(['Ajustes de inventário', r.resumo.ajustes]);
    add(['Colaboradores que retiraram', r.resumo.colaboradores]); add(['Ferramentas fora hoje', r.resumo.foraAgora]);
    if (r.resumo.custoTotal) add(['Consumo total (R$)', moeda(r.resumo.custoTotal)]);
    add(['']);
    ['Obra', 'Elétrica'].forEach(cat => {
      const itens = r.estoque.filter(x => x.categoria === cat);
      add([`ESTOQUE — ITENS ${cat.toUpperCase()}`], 'secao');
      add(['ID Produto', 'Nome Produto', 'Tipo Produto', 'Quantidade', 'Quantidade Mínima', 'Unidade de Medida'], 'cab');
      itens.forEach(x => add([x.codigo, x.nome, x.tipo, x.quantidade, x.minimo, x.unidade], x.quantidade <= x.minimo ? 'alerta' : ''));
      if (!itens.length) add(['Nenhum item cadastrado']);
      add(['']);
    });
    add(['Itens em vermelho estão no estoque mínimo ou abaixo dele.']);
  }

  // monta a planilha praticamente

  const larg = Math.max(...linhas.map(l => l.length));
  const dados = linhas.map(l => { const x = l.slice(); while (x.length < larg) x.push(''); return x; });
  const novo = SpreadsheetApp.create(nomeArq);
  const sh = novo.getSheets()[0];
  sh.setName('Relatório');
  sh.getRange(1, 1, dados.length, larg).setValues(dados);
  sh.getRange(1, 1, dados.length, larg).setFontFamily('Arial').setFontSize(10).setVerticalAlignment('middle');
  estilos.forEach(e => {
    const rg = sh.getRange(e.linha, 1, 1, e.tipo === 'cab' || e.tipo === 'total' || e.tipo === 'alerta' ? e.n : larg);
    if (e.tipo === 'titulo') rg.setFontSize(15).setFontWeight('bold').setFontColor('#1f3b57');
    if (e.tipo === 'secao') rg.setFontWeight('bold').setBackground('#1f3b57').setFontColor('#ffffff');
    if (e.tipo === 'cab') rg.setFontWeight('bold').setBackground('#e8eef7').setBorder(false, false, true, false, false, false);
    if (e.tipo === 'total') rg.setFontWeight('bold').setBackground('#f3f4f6');
    if (e.tipo === 'alerta') rg.setFontColor('#c0392b').setFontWeight('bold');
  });
  sh.getRange(2, 1, 2, 1).setFontColor('#555555');
  for (let c = 1; c <= larg; c++) sh.setColumnWidth(c, c === 1 ? 150 : c === 2 || c === 4 || c === 6 ? 190 : 110);
  SpreadsheetApp.flush();

  const pastaRel = pasta_('Relatórios');
  const arq = DriveApp.getFileById(novo.getId());
  arq.moveTo(pastaRel);
  try { arq.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT); } catch (e) { }
  const out = { nome: nomeArq, planilha: novo.getUrl(), excel: 'https://docs.google.com/spreadsheets/d/' + novo.getId() + '/export?format=xlsx' };

  if (formato === 'pdf') {
    let blob;
    try {
      const url = 'https://docs.google.com/spreadsheets/d/' + novo.getId() + '/export?format=pdf&size=A4&portrait=true&fitw=true' +
        '&gridlines=false&printtitle=false&sheetnames=false&pagenum=CENTER&top_margin=0.5&bottom_margin=0.5&left_margin=0.4&right_margin=0.4';
      blob = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } }).getBlob();
    } catch (e) {
      blob = arq.getAs(MimeType.PDF);
    }
    const pdf = pastaRel.createFile(blob.setName(nomeArq + '.pdf'));
    try { pdf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) { /* ignora */ }
    out.pdf = pdf.getUrl();
  }
  return out;
}


const moeda_ = v => 'R$ ' + (Math.round(v * 100) / 100).toFixed(2).replace('.', ',');

function enviarAvisoAtrasos() {
  const c = cfg_();
  const atrasadas = pendentes_().filter(p => p.dias >= c.diasAtraso);
  if (!atrasadas.length || !c.emails) return atrasadas.length;
  const contrato = {};
  lerEquipe_().forEach(f => contrato[f.nome.toLowerCase()] = f.contrato);
  const porPessoa = {};
  atrasadas.forEach(p => (porPessoa[p.pessoa] = porPessoa[p.pessoa] || []).push(p));
  const html = `<h2 style="color:#c0392b">⚠️ ${atrasadas.length} ferramenta(s) fora há ${c.diasAtraso} dias ou mais</h2>` +
    Object.keys(porPessoa).sort().map(n => `<h3>👷 ${n} <small style="color:#666">${contrato[n.toLowerCase()] || ''}</small></h3><ul>` +
      porPessoa[n].map(p => `<li><b>${p.pendente} × ${p.item}</b> — ${p.obra || 'sem obra'} — saiu ${p.data} (<b>${p.dias} dias</b>)</li>`).join('') +
      '</ul>').join('');
  email_(`Almoxarifado: ${atrasadas.length} ferramenta(s) atrasada(s)`, html);
  return atrasadas.length;
}

function enviarResumoSemanal() {
  const c = cfg_();
  if (!c.emails) return;
  const fim = Date.now(), ini = fim - 7 * 86400000;
  const r = consumo_(ini, fim);
  const baixos = lerItens_().lista.filter(i => i.estoque <= i.minimo);
  const atrasadas = pendentes_().filter(p => p.dias >= c.diasAtraso);
  const td = 'style="padding:4px 8px;border-bottom:1px solid #eee"';
  const html =
    `<h2 style="color:#1f3b57">📦 Resumo do almoxarifado — ${fmt_(ini, 'dd/MM')} a ${fmt_(fim, 'dd/MM')}</h2>` +
    `<p><b>${r.retiradas}</b> retiradas · <b>${r.entradas}</b> entradas · <b>${contarPedidosAbertos_()}</b> pedidos em aberto · ` +
    `consumo total <b>${moeda_(r.custoTotal)}</b> (Obra ${moeda_(r.porCategoria['Obra'] || 0)} · Elétrica ${moeda_(r.porCategoria['Elétrica'] || 0)})</p>` +
    `<h3>Consumo por obra</h3>` +
    (r.obras.length ? r.obras.map(o => `<p><b>${o.obra}</b> — ${moeda_(o.custo)}<br>` +
      o.consumo.map(x => `${x.qtd} ${x.unidade} ${x.nome}`).join(' · ') + '</p>').join('') : '<p>Nenhuma retirada.</p>') +
    `<h3 style="color:#c0392b">Itens abaixo do mínimo (${baixos.length})</h3>` +
    (baixos.length ? '<table>' + baixos.map(i => `<tr><td ${td}>${i.nome}</td><td ${td}>${i.categoria}</td><td ${td}><b>${i.estoque}</b> ${i.unidade}</td><td ${td}>mínimo ${i.minimo}</td></tr>`).join('') + '</table>' : '<p>Nenhum 👍</p>') +
    `<h3>Ferramentas atrasadas (${atrasadas.length})</h3>` +
    (atrasadas.length ? '<ul>' + atrasadas.map(p => `<li>${p.pendente} × ${p.item} — ${p.pessoa} — ${p.dias} dias</li>`).join('') + '</ul>' : '<p>Nenhuma 👍</p>');
  email_('Almoxarifado: resumo semanal', html);
}
