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
