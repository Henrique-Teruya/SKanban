**Descrição (até 350 caracteres)**

SKanban é uma máscara operacional para o módulo de Atendimentos do CVCRM, criada para centralizar e organizar chamados de e-mail, WhatsApp via Blip, Portal do Cliente, pós-venda e suporte interno em uma única interface Kanban, com foco em UX, produtividade, SLA e gestão omnichannel baseada em APIs reais.

---

# README.md

````md
# SKanban

SKanban é uma máscara operacional para o módulo de Atendimentos do CVCRM, desenvolvida para centralizar toda a operação de suporte e relacionamento em uma única interface moderna, amigável e altamente produtiva.

O projeto transforma o atendimento tradicional do CRM em uma Central Unificada de Atendimento Omnichannel com visual Kanban, permitindo acompanhar chamados de múltiplos canais em um só lugar.

---

# Objetivo

Criar uma camada visual superior ao módulo atual de Atendimentos do CVCRM, sem substituir suas regras de negócio, utilizando exclusivamente APIs reais já existentes na plataforma.

O objetivo é melhorar:

- experiência operacional
- velocidade de atendimento
- controle de SLA
- produtividade das equipes
- acompanhamento de tarefas
- visibilidade gerencial
- centralização de canais

Tudo isso mantendo aderência total ao ecossistema original do CVCRM.

---

# Canais Centralizados

O SKanban reúne atendimentos provenientes de:

- E-mail
- WhatsApp via Blip
- Portal do Cliente
- Atendimento interno
- Pós-venda
- Suporte operacional

Tudo em uma única interface.

---

# Tecnologias Utilizadas

## Frontend

- HTML
- CSS
- JavaScript puro

Responsável por:

- Layout Kanban
- Cards de atendimento
- Dashboard gerencial
- Timeline de mensagens
- Filtros globais
- Modais
- Drag and Drop
- UX moderna e intuitiva

---

## Backend

- Node.js
- Express

Responsável por:

- autenticação segura
- proxy das APIs do CVCRM
- controle de permissões
- logs operacionais
- tratamento de erros
- segurança de acesso

O token do CVCRM não deve ficar exposto no frontend.

---

# Estrutura Inicial

```text
SKanban/
│
├── index.html
├── style.css
├── kanban.css
├── modal.css
│
├── js/
│   ├── api.js
│   ├── kanban.js
│   ├── dashboard.js
│   ├── timeline.js
│   └── auth.js
│
├── backend/
│   └── server.js
│
└── README.md
````

---

# Funcionalidades Principais

## Kanban de Atendimentos

Cada card exibe:

* protocolo
* cliente
* assunto
* subassunto
* situação atual
* prioridade
* responsável
* time responsável
* data de abertura
* última interação
* SLA
* quantidade de mensagens
* quantidade de anexos
* tarefas vinculadas

---

## Drag and Drop

Movimentação entre colunas para alterar a situação do atendimento.

Essa é uma das funcionalidades mais importantes do projeto.

API utilizada:

* Alterar situação do atendimento

---

## Tela Detalhada do Atendimento

Formato semelhante a:

Zendesk + CRM + Chat

Contendo:

* informações gerais
* timeline completa
* mensagens
* respostas
* anexos
* alterações de status
* logs operacionais
* tarefas abertas
* avaliação final

---

## Dashboard Gerencial

Indicadores vindos principalmente do CVDW:

* total de atendimentos
* SLA médio
* tempo médio de resposta
* produtividade por equipe
* gargalos operacionais
* performance dos times
* tempo por situação

---

# APIs Utilizadas

## Atendimentos — Portal do Cliente

* Retorna os dados de um atendimento
* Retorna os atendimentos ativos que o cliente está associado e é permitido a visualização
* Realiza o cadastro de um atendimento
* Faz o upload dos arquivos do atendimento
* Responde um determinado atendimento
* Avalia um atendimento
* Retorna os assuntos do atendimento
* Retorna os subassuntos de assunto do atendimento
* Retorna as areas comum do atendimento
* Retorna as situações possíveis em um atendimento

---

## Atendimentos — Comunicação

* Realiza o cadastro de um novo atendimento
* Finaliza um atendimento
* Lista os atendimentos

---

## Atendimentos — CVDW

* Retorna os integrantes dos times de atendimentos
* Retorna os times de atendimentos
* Retorna as tarefas dos atendimentos
* Retorna as respostas dos atendimentos
* Retorna as interações dos atendimentos
* Retorna o tempo que o atendimento passou em cada situação
* Retorna os dados dos atendimentos

---

## Atendimentos — Pós Venda

### Tarefas

* Retorna as tarefas criadas do atendimento
* Retorna uma tarefa criada
* Encerra uma tarefa criada

### Atendimento

* Obtém uma mensagem específica
* Lista as mensagens de um atendimento
* Altera os dados do atendimento
* Cadastrar Atendimento
* Adiciona uma mensagem no atendimento
* Lista os atendimentos
* Alterar situação do atendimento
* retornarsubworkflows-1

---

# Regra Principal do Projeto

Não criar funcionalidades fora das APIs existentes.

Não inventar campos.

Não criar dependências que não existçam no CVCRM.

Tudo precisa ser viável em produção real.

---

# Resultado Esperado

Uma plataforma robusta de atendimento omnichannel construída sobre a base do CVCRM, com:

* UX superior
* operação centralizada
* alta produtividade
* controle real de SLA
* gestão eficiente de chamados
* visão completa da operação

Mais do que um Kanban bonito:

SKanban é um Zendesk + Pipefy + CRM construído sobre o CVCRM.

```
```
