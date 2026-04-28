require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const USE_MOCK = process.env.USE_MOCK === 'true';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ──────────────────────────────────────────────
   MOCK DATA
   ────────────────────────────────────────────── */

const SITUACOES = [
  { id: 1, nome: 'Novo', cor: '#0071e3', ordem: 1 },
  { id: 2, nome: 'Em Andamento', cor: '#34c759', ordem: 2 },
  { id: 3, nome: 'Aguardando Cliente', cor: '#ff9f0a', ordem: 3 },
  { id: 4, nome: 'Aguardando Interno', cor: '#af52de', ordem: 4 },
  { id: 5, nome: 'Resolvido', cor: '#30d158', ordem: 5 },
  { id: 6, nome: 'Finalizado', cor: '#86868b', ordem: 6 },
];

const ASSUNTOS = [
  { id: 1, nome: 'Financeiro' },
  { id: 2, nome: 'Manutenção' },
  { id: 3, nome: 'Documentação' },
  { id: 4, nome: 'Pós-venda' },
  { id: 5, nome: 'Suporte Técnico' },
];

const SUBASSUNTOS = {
  1: [{ id: 11, nome: '2ª Via de Boleto' }, { id: 12, nome: 'Renegociação' }, { id: 13, nome: 'Antecipação' }],
  2: [{ id: 21, nome: 'Elétrica' }, { id: 22, nome: 'Hidráulica' }, { id: 23, nome: 'Pintura' }],
  3: [{ id: 31, nome: 'Contrato' }, { id: 32, nome: 'Escritura' }, { id: 33, nome: 'Vistoria' }],
  4: [{ id: 41, nome: 'Entrega de Chaves' }, { id: 42, nome: 'Garantia' }],
  5: [{ id: 51, nome: 'Acesso ao Portal' }, { id: 52, nome: 'App Mobile' }],
};

const TIMES = [
  { id: 1, nome: 'Atendimento Geral', cor: '#0071e3' },
  { id: 2, nome: 'Pós-venda', cor: '#34c759' },
  { id: 3, nome: 'Financeiro', cor: '#ff9f0a' },
  { id: 4, nome: 'Manutenção', cor: '#af52de' },
];

const INTEGRANTES = {
  1: [
    { id: 101, nome: 'Ana Costa', email: 'ana@empresa.com', avatar: null },
    { id: 102, nome: 'Carlos Silva', email: 'carlos@empresa.com', avatar: null },
    { id: 103, nome: 'Mariana Oliveira', email: 'mariana@empresa.com', avatar: null },
  ],
  2: [
    { id: 201, nome: 'Pedro Santos', email: 'pedro@empresa.com', avatar: null },
    { id: 202, nome: 'Juliana Ferreira', email: 'juliana@empresa.com', avatar: null },
  ],
  3: [
    { id: 301, nome: 'Roberto Lima', email: 'roberto@empresa.com', avatar: null },
  ],
  4: [
    { id: 401, nome: 'Fernanda Souza', email: 'fernanda@empresa.com', avatar: null },
    { id: 402, nome: 'Lucas Pereira', email: 'lucas@empresa.com', avatar: null },
  ],
};

const CANAIS = ['Email', 'WhatsApp', 'Portal do Cliente', 'Interno', 'Pós-venda', 'Blip'];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomDate(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, daysBack));
  d.setHours(randomInt(8, 18), randomInt(0, 59));
  return d.toISOString();
}

function generateAtendimentos(count) {
  const nomes = ['Maria Souza', 'João Pereira', 'Ana Lima', 'Carlos Mendes', 'Juliana Costa',
    'Pedro Alves', 'Fernanda Santos', 'Lucas Oliveira', 'Camila Ribeiro', 'Rafael Nunes',
    'Patrícia Gomes', 'André Martins', 'Beatriz Rocha', 'Gustavo Dias', 'Larissa Cardoso',
    'Thiago Barros', 'Isabela Franco', 'Diego Teixeira', 'Amanda Vieira', 'Bruno Correia'];

  const titulos = [
    'Solicitação de 2ª via de boleto', 'Vazamento no banheiro social', 'Dúvida sobre escritura',
    'Problema no acesso ao portal', 'Reclamação sobre pintura', 'Renegociação de parcelas',
    'Agendamento de vistoria', 'Entrega de chaves atrasada', 'Barulho excessivo na obra',
    'Troca de titularidade', 'Problema com interfone', 'Solicitação de planta baixa',
    'Garantia de piso', 'Infiltração na garagem', 'Erro no valor do condomínio',
    'Mudança de data de vencimento', 'Atualização cadastral', 'Rachadura na parede',
    'Portão eletrônico com defeito', 'Dúvida sobre IPTU',
  ];

  const atendimentos = [];
  for (let i = 1; i <= count; i++) {
    const situacao = randomFrom(SITUACOES);
    const assunto = randomFrom(ASSUNTOS);
    const time = randomFrom(TIMES);
    const integrantes = INTEGRANTES[time.id];
    const responsavel = randomFrom(integrantes);
    const criadoEm = randomDate(30);
    const prioridades = ['baixa', 'media', 'alta', 'urgente'];

    atendimentos.push({
      id: 1000 + i,
      protocolo: `ATD-${String(2025000 + i).padStart(7, '0')}`,
      titulo: randomFrom(titulos),
      descricao: 'Detalhamento do atendimento com informações adicionais do cliente.',
      cliente: { id: i * 10, nome: randomFrom(nomes), email: `cliente${i}@email.com` },
      situacao: { id: situacao.id, nome: situacao.nome, cor: situacao.cor },
      assunto: { id: assunto.id, nome: assunto.nome },
      canal: randomFrom(CANAIS),
      prioridade: randomFrom(prioridades),
      responsavel: { id: responsavel.id, nome: responsavel.nome },
      time: { id: time.id, nome: time.nome },
      criadoEm,
      atualizadoEm: randomDate(7),
      sla: {
        prazo: randomInt(24, 72),
        horasDecorridas: randomInt(1, 96),
      },
      totalMensagens: randomInt(1, 15),
      novasMensagens: randomInt(0, 3),
      totalTarefas: randomInt(0, 5),
      tarefasPendentes: randomInt(0, 3),
    });
  }
  return atendimentos;
}

let mockAtendimentos = generateAtendimentos(42);

function generateMensagens(atendimentoId) {
  const at = mockAtendimentos.find(a => a.id === atendimentoId);
  if (!at) return [];
  const count = Math.max(at.totalMensagens, 3);
  const msgs = [];

  const textosCliente = [
    'Oi, vi que meu boleto vence amanhã e ainda não recebi por e-mail.',
    'A manutenção ficou de vir hoje de manhã e não apareceu. Alguma previsão?',
    'Mandei os documentos da escritura em anexo. Podem conferir?',
    'Gostaria de agendar a entrega das chaves para a próxima sexta, é possível?',
    'Não estou conseguindo acessar o portal do cliente, dá erro de senha.',
    'Preciso de uma cópia do meu contrato assinado.',
    'Obrigado pela rapidez no atendimento!',
    'Qual o prazo para a vistoria da unidade 402?',
    'A infiltração na garagem está aumentando, preciso de alguém aqui urgente.',
    'Confirmando o pagamento da parcela de entrada. Segue comprovante.'
  ];
  const textosOperador = [
    'Bom dia! Verificamos seu pedido e o técnico já está a caminho.',
    'Recebemos seus documentos. O setor jurídico fará a análise em até 48h.',
    'Lamentamos o atraso. Houve um imprevisto na obra, mas o técnico irá hoje à tarde.',
    'Acabei de reenviar o boleto para o seu e-mail cadastrado. Confira a caixa de spam.',
    'Sua solicitação de vistoria foi agendada com sucesso para o dia 15/05 às 14h.',
    'Para resetar sua senha, clique em "Esqueci minha senha" na tela de login do portal.',
    'Estamos verificando com o setor financeiro e já te damos um retorno.',
    'Poderia nos enviar uma foto do ocorrido para agilizarmos o laudo?',
    'Sua unidade já está pronta para a vistoria final. Parabéns!',
    'Vou encaminhar sua nota interna para o gerente de obras.'
  ];
  const textosSistema = [
    `Situação alterada para "${at.situacao.nome}"`,
    `Atendimento atribuído para ${at.responsavel.nome}`,
    `Prioridade alterada para ${at.prioridade}`,
    `O cliente visualizou a mensagem`,
    `Arquivo anexado pelo sistema`,
    `SLA de resposta atingido (24h)`
  ];
  const nomeAnexos = [
    { nome: 'contrato_v2.pdf', tipo: 'pdf' },
    { nome: 'comprovante_pagamento.pdf', tipo: 'pdf' },
    { nome: 'foto_ocorrencia.jpg', tipo: 'imagem' },
    { nome: 'planta_baixa.dwg', tipo: 'documento' },
    { nome: 'laudo_tecnico.pdf', tipo: 'pdf' },
    { nome: 'foto_vistoria_01.png', tipo: 'imagem' },
  ];

  for (let i = 0; i < count; i++) {
    const baseTime = Date.now() - (count - i) * 3600000 * randomInt(1, 6);
    const criadoEm = new Date(baseTime).toISOString();

    // First message is always from client
    if (i === 0) {
      msgs.push({ id: atendimentoId * 100 + i, atendimentoId, tipo: 'mensagem',
        remetente: { tipo: 'cliente', nome: at.cliente.nome },
        texto: randomFrom(textosCliente), criadoEm, anexos: [] });
      continue;
    }

    // Mix message types
    const roll = Math.random();
    if (roll < 0.15 && i > 1) {
      // System event
      msgs.push({ id: atendimentoId * 100 + i, atendimentoId, tipo: 'sistema',
        remetente: { tipo: 'sistema', nome: 'Sistema' },
        texto: randomFrom(textosSistema), criadoEm, anexos: [] });
    } else if (roll < 0.25 && i > 2) {
      // Internal note
      msgs.push({ id: atendimentoId * 100 + i, atendimentoId, tipo: 'nota_interna',
        remetente: { tipo: 'operador', nome: at.responsavel.nome },
        texto: 'Nota interna: Verificar com o jurídico antes de prosseguir.', criadoEm, anexos: [] });
    } else if (i % 2 === 1) {
      // Operator response
      const anexos = Math.random() > 0.75 ? [randomFrom(nomeAnexos)] : [];
      msgs.push({ id: atendimentoId * 100 + i, atendimentoId, tipo: 'mensagem',
        remetente: { tipo: 'operador', nome: at.responsavel.nome },
        texto: randomFrom(textosOperador), criadoEm, anexos });
    } else {
      // Client message
      const anexos = Math.random() > 0.85 ? [randomFrom(nomeAnexos)] : [];
      msgs.push({ id: atendimentoId * 100 + i, atendimentoId, tipo: 'mensagem',
        remetente: { tipo: 'cliente', nome: at.cliente.nome },
        texto: randomFrom(textosCliente), criadoEm, anexos });
    }
  }
  return msgs;
}

function generateInteracoes(atendimentoId) {
  const at = mockAtendimentos.find(a => a.id === atendimentoId);
  if (!at) return [];
  const interacoes = [];
  const acoes = [
    { tipo: 'criacao', descricao: 'Atendimento criado', autor: 'Sistema' },
    { tipo: 'situacao', descricao: `Situação alterada para "${at.situacao.nome}"`, autor: at.responsavel.nome },
    { tipo: 'atribuicao', descricao: `Atendimento atribuído para ${at.responsavel.nome}`, autor: 'Sistema' },
    { tipo: 'mensagem', descricao: `${at.responsavel.nome} enviou uma mensagem`, autor: at.responsavel.nome },
    { tipo: 'prioridade', descricao: `Prioridade alterada para ${at.prioridade}`, autor: at.responsavel.nome },
  ];
  const count = randomInt(3, 8);
  for (let i = 0; i < count; i++) {
    const acao = i === 0 ? acoes[0] : randomFrom(acoes);
    interacoes.push({
      id: atendimentoId * 50 + i,
      atendimentoId,
      tipo: acao.tipo,
      descricao: acao.descricao,
      autor: acao.autor,
      criadoEm: new Date(Date.now() - (count - i) * 3600000 * randomInt(2, 12)).toISOString(),
    });
  }
  return interacoes;
}

function generateTarefas(atendimentoId) {
  const at = mockAtendimentos.find(a => a.id === atendimentoId);
  if (!at) return [];
  const tarefasDescricoes = [
    'Verificar documentação do cliente',
    'Agendar vistoria técnica',
    'Entrar em contato com fornecedor',
    'Atualizar dados no sistema',
    'Enviar parecer ao jurídico',
  ];
  const tarefas = [];
  for (let i = 0; i < at.totalTarefas; i++) {
    tarefas.push({
      id: atendimentoId * 10 + i,
      atendimentoId,
      descricao: tarefasDescricoes[i % tarefasDescricoes.length],
      responsavel: at.responsavel.nome,
      status: i < at.tarefasPendentes ? 'pendente' : 'concluida',
      criadoEm: randomDate(14),
    });
  }
  return tarefas;
}

/* ──────────────────────────────────────────────
   API ROUTES
   ────────────────────────────────────────────── */

// ── Auth ──
app.post('/api/auth/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) return res.status(400).json({ erro: 'Usuário e senha obrigatórios' });

  if (USE_MOCK) {
    return res.json({
      token: 'mock-jwt-token-skanban',
      usuario: { id: 1, nome: 'Operador SKanban', email: 'operador@skanban.com', perfil: 'gerente' },
    });
  }
  // TODO: Proxy real para API CVCRM de autenticação
  res.status(501).json({ erro: 'Autenticação real não configurada' });
});

// ── Situações (colunas do Kanban) ──
app.get('/api/situacoes', (_req, res) => {
  if (USE_MOCK) return res.json(SITUACOES);
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Atendimentos ──
app.get('/api/atendimentos', (req, res) => {
  if (USE_MOCK) {
    let result = [...mockAtendimentos];
    if (req.query.situacao) result = result.filter(a => a.situacao.id === +req.query.situacao);
    if (req.query.canal) result = result.filter(a => a.canal === req.query.canal);
    if (req.query.prioridade) result = result.filter(a => a.prioridade === req.query.prioridade);
    if (req.query.time) result = result.filter(a => a.time.id === +req.query.time);
    if (req.query.busca) {
      const b = req.query.busca.toLowerCase();
      result = result.filter(a => a.protocolo.toLowerCase().includes(b) || a.titulo.toLowerCase().includes(b) || a.cliente.nome.toLowerCase().includes(b));
    }
    return res.json(result);
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

app.get('/api/atendimentos/:id', (req, res) => {
  if (USE_MOCK) {
    const at = mockAtendimentos.find(a => a.id === +req.params.id);
    if (!at) return res.status(404).json({ erro: 'Atendimento não encontrado' });
    return res.json(at);
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

app.post('/api/atendimentos', (req, res) => {
  if (USE_MOCK) {
    const novo = {
      id: 1000 + mockAtendimentos.length + 1,
      protocolo: `ATD-${String(2025000 + mockAtendimentos.length + 1).padStart(7, '0')}`,
      titulo: req.body.titulo || 'Novo Atendimento',
      descricao: req.body.descricao || '',
      cliente: { id: 999, nome: req.body.clienteNome || 'Novo Cliente', email: 'novo@email.com' },
      situacao: SITUACOES[0],
      assunto: ASSUNTOS.find(a => a.id === req.body.assuntoId) || ASSUNTOS[0],
      canal: req.body.canal || 'Portal do Cliente',
      prioridade: req.body.prioridade || 'media',
      responsavel: { id: 101, nome: 'Ana Costa' },
      time: TIMES[0],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      sla: { prazo: 48, horasDecorridas: 0 },
      totalMensagens: 0,
      totalTarefas: 0,
      tarefasPendentes: 0,
    };
    mockAtendimentos.push(novo);
    return res.status(201).json(novo);
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

app.patch('/api/atendimentos/:id', (req, res) => {
  if (USE_MOCK) {
    const at = mockAtendimentos.find(a => a.id === +req.params.id);
    if (!at) return res.status(404).json({ erro: 'Não encontrado' });
    Object.assign(at, req.body, { atualizadoEm: new Date().toISOString() });
    return res.json(at);
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

app.patch('/api/atendimentos/:id/situacao', (req, res) => {
  if (USE_MOCK) {
    const at = mockAtendimentos.find(a => a.id === +req.params.id);
    if (!at) return res.status(404).json({ erro: 'Não encontrado' });
    const novaSit = SITUACOES.find(s => s.id === +req.body.situacaoId);
    if (!novaSit) return res.status(400).json({ erro: 'Situação inválida' });
    at.situacao = { id: novaSit.id, nome: novaSit.nome, cor: novaSit.cor };
    at.atualizadoEm = new Date().toISOString();
    return res.json(at);
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

app.post('/api/atendimentos/:id/finalizar', (req, res) => {
  if (USE_MOCK) {
    const at = mockAtendimentos.find(a => a.id === +req.params.id);
    if (!at) return res.status(404).json({ erro: 'Não encontrado' });
    at.situacao = SITUACOES[5]; // Finalizado
    at.atualizadoEm = new Date().toISOString();
    return res.json(at);
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Mensagens ──
app.get('/api/atendimentos/:id/mensagens', (req, res) => {
  if (USE_MOCK) return res.json(generateMensagens(+req.params.id));
  res.status(501).json({ erro: 'API real não configurada' });
});

app.post('/api/atendimentos/:id/mensagens', (req, res) => {
  if (USE_MOCK) {
    const at = mockAtendimentos.find(a => a.id === +req.params.id);
    if (at) at.totalMensagens++;
    return res.status(201).json({
      id: Date.now(),
      atendimentoId: +req.params.id,
      remetente: { tipo: 'operador', nome: 'Operador SKanban' },
      texto: req.body.texto,
      criadoEm: new Date().toISOString(),
      anexos: [],
    });
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Responder (Portal do Cliente) ──
app.post('/api/atendimentos/:id/responder', (req, res) => {
  if (USE_MOCK) {
    const at = mockAtendimentos.find(a => a.id === +req.params.id);
    if (at) at.totalMensagens++;
    return res.status(201).json({
      id: Date.now(), atendimentoId: +req.params.id, tipo: 'mensagem',
      remetente: { tipo: 'operador', nome: 'Operador SKanban' },
      texto: req.body.texto, criadoEm: new Date().toISOString(), anexos: [],
    });
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Interações / Logs ──
app.get('/api/atendimentos/:id/interacoes', (req, res) => {
  if (USE_MOCK) return res.json(generateInteracoes(+req.params.id));
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Upload de Arquivos ──
app.post('/api/atendimentos/:id/upload', (req, res) => {
  if (USE_MOCK) {
    return res.status(201).json({
      id: Date.now(), nome: req.body.nome || 'arquivo.pdf',
      tipo: req.body.tipo || 'pdf', url: '#', criadoEm: new Date().toISOString(),
    });
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Tarefas ──
app.get('/api/atendimentos/:id/tarefas', (req, res) => {
  if (USE_MOCK) return res.json(generateTarefas(+req.params.id));
  res.status(501).json({ erro: 'API real não configurada' });
});

app.post('/api/atendimentos/:id/tarefas/:tarefaId/encerrar', (req, res) => {
  if (USE_MOCK) return res.json({ sucesso: true, mensagem: 'Tarefa encerrada' });
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Assuntos & Subassuntos ──
app.get('/api/assuntos', (_req, res) => {
  if (USE_MOCK) return res.json(ASSUNTOS);
  res.status(501).json({ erro: 'API real não configurada' });
});

app.get('/api/assuntos/:id/subassuntos', (req, res) => {
  if (USE_MOCK) return res.json(SUBASSUNTOS[req.params.id] || []);
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Times ──
app.get('/api/times', (_req, res) => {
  if (USE_MOCK) return res.json(TIMES);
  res.status(501).json({ erro: 'API real não configurada' });
});

app.get('/api/times/:id/integrantes', (req, res) => {
  if (USE_MOCK) return res.json(INTEGRANTES[req.params.id] || []);
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Dashboard Stats ──
app.get('/api/dashboard/stats', (_req, res) => {
  if (USE_MOCK) {
    const total = mockAtendimentos.length;
    const porSituacao = {};
    SITUACOES.forEach(s => { porSituacao[s.nome] = mockAtendimentos.filter(a => a.situacao.id === s.id).length; });
    const porCanal = {};
    CANAIS.forEach(c => { porCanal[c] = mockAtendimentos.filter(a => a.canal === c).length; });
    const porPrioridade = {};
    ['baixa', 'media', 'alta', 'urgente'].forEach(p => { porPrioridade[p] = mockAtendimentos.filter(a => a.prioridade === p).length; });

    const slaViolados = mockAtendimentos.filter(a => a.sla.horasDecorridas > a.sla.prazo).length;
    const tempoMedioResposta = Math.round(mockAtendimentos.reduce((acc, a) => acc + randomInt(1, 24), 0) / total);

    return res.json({
      total,
      abertos: total - porSituacao['Finalizado'],
      finalizados: porSituacao['Finalizado'],
      slaViolados,
      tempoMedioResposta,
      porSituacao,
      porCanal,
      porPrioridade,
    });
  }
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── Avaliação ──
app.post('/api/atendimentos/:id/avaliar', (req, res) => {
  if (USE_MOCK) return res.json({ sucesso: true, nota: req.body.nota });
  res.status(501).json({ erro: 'API real não configurada' });
});

// ── SPA Fallback ──
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ╔═══════════════════════════════════════╗`);
  console.log(`  ║          SKanban Server v1.0          ║`);
  console.log(`  ║───────────────────────────────────────║`);
  console.log(`  ║  🌐  http://localhost:${PORT}            ║`);
  console.log(`  ║  📦  Mock: ${USE_MOCK ? 'ATIVO' : 'DESLIGADO'}                  ║`);
  console.log(`  ╚═══════════════════════════════════════╝\n`);
});
