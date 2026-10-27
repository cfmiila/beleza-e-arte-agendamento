# Requirements — Beleza & Arte · Sistema de Agendamento

**Versão:** 1.0  
**Data:** Outubro 2026  
**Stack:** React 18 + Vite · JavaScript (ES Modules) · CSS puro  
**Ambiente:** SPA client-side, sem backend, sem persistência em disco

---

## 1. Visão Geral

Sistema de agendamento para o salão de beleza **Beleza & Arte**. Permite que a equipe visualize a agenda do dia, crie novos agendamentos para clientes, confirme ou cancele reservas. Não há integração com calendários externos ou autenticação de usuários.

---

## 2. Páginas e Navegação

A aplicação possui **3 telas** e navegação controlada por estado interno (sem react-router).

| Tela | Identificador interno | Descrição |
|------|-----------------------|-----------|
| Agenda | `home` | Dashboard principal com todos os agendamentos |
| Novo Agendamento | `booking` | Formulário multi-step para criar um agendamento |
| Confirmação | `confirmation` | Tela de resumo exibida após a criação de um agendamento |

- A navegação entre telas executa `window.scrollTo({ top: 0 })` ao transitar.
- A **Navbar** permanece visível em todas as telas com atalhos para `home` e `booking`.
- A tela `confirmation` só é acessível após completar o fluxo de agendamento.

---

## 3. Navbar

- Logo "💄 Beleza&Arte" clicável → navega para `home`.
- Botão **"📋 Agendamentos"** → navega para `home`.
- Botão **"➕ Novo Agendamento"** → navega para `booking`.
- Permanece fixo no topo da página (`position: sticky`).

---

## 4. Tela 1 — Agenda (Homepage)

### 4.1 Hero Banner

- Exibe título, subtítulo e dois botões de ação:
  - **"✨ Agendar agora"** → navega para `booking`.
  - **"Ver agendamentos"** → scroll suave até a lista de agendamentos na mesma página.

### 4.2 Painel de Estatísticas

Quatro contadores calculados em tempo real a partir da lista de agendamentos:

| Métrica | Critério |
|---------|----------|
| **Hoje** | `date === data de hoje` |
| **Amanhã** | `date === data de amanhã` |
| **Esta semana** | `date` entre hoje e +7 dias (inclusive) |
| **Confirmados** | `status === 'confirmed'` (qualquer data) |

### 4.3 Lista de Agendamentos

- Exibe os agendamentos em um grid responsivo de cards.
- Ordenação: cronológica crescente por data e horário.
- **Filtros disponíveis** (abas clicáveis, apenas um ativo por vez):

| Filtro | Comportamento |
|--------|---------------|
| Todos | Exibe todos os agendamentos |
| Hoje | `date === hoje` |
| Amanhã | `date === amanhã` |
| Confirmados | `status === 'confirmed'` |
| Pendentes | `status === 'pending'` |

- **Estado vazio:** quando nenhum agendamento atende ao filtro, exibe mensagem e botão para criar novo agendamento.

### 4.4 Card de Agendamento

Cada agendamento exibe:
- Avatar circular com as iniciais do cliente (até 2 letras) com cor determinada por `id % 5`.
- Nome completo e telefone do cliente.
- Badge de status:
  - `confirmed` → verde, rótulo "Confirmado"
  - `pending` → amarelo, rótulo "Pendente"
- Nome do serviço (com ícone emoji).
- Nome do profissional responsável.
- Data amigável ("Hoje", "Amanhã" ou DD/MM/AAAA) e horário.
- Duração em minutos e preço em R$.
- **Botão "✅ Confirmar"** — visível apenas quando `status === 'pending'`. Muda o status para `confirmed`.
- **Botão "🗑️ Cancelar"** — sempre visível. Abre diálogo de confirmação nativo (`window.confirm`). Se confirmado, remove permanentemente o agendamento.

---

## 5. Tela 2 — Novo Agendamento

Formulário dividido em **3 etapas** com barra de progresso visual. É possível voltar para a etapa anterior sem perder dados.

### 5.1 Etapa 1 — Dados do Cliente

| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| Nome completo | Texto | Sim | Não pode estar em branco após `.trim()` |
| Telefone / WhatsApp | Tel | Sim | Não pode estar em branco após `.trim()` |
| Profissional | Select | Não | Opção padrão: "Sem preferência" |

- Se os campos obrigatórios não forem preenchidos, exibe toast de erro e bloqueia o avanço.
- A seleção de profissional é opcional. Se não selecionado, um dos 3 profissionais será sorteado aleatoriamente no momento do envio.

### 5.2 Etapa 2 — Escolha do Serviço

- Exibe os **8 serviços** em grid de cards clicáveis.
- Cada card exibe: ícone emoji, nome, duração (minutos) e preço (R$).
- Ao clicar em um card, ele fica com destaque visual (`selected`).
- É obrigatório selecionar um serviço para avançar.

**Catálogo de serviços:**

| Serviço | Duração | Preço |
|---------|---------|-------|
| Corte Feminino | 60 min | R$ 80,00 |
| Corte Masculino | 30 min | R$ 45,00 |
| Coloração | 120 min | R$ 180,00 |
| Escova | 45 min | R$ 60,00 |
| Manicure | 45 min | R$ 40,00 |
| Pedicure | 60 min | R$ 50,00 |
| Sobrancelha | 30 min | R$ 30,00 |
| Hidratação Capilar | 90 min | R$ 120,00 |

### 5.3 Etapa 3 — Data e Horário

**Calendário:**
- Exibição mensal com navegação por mês (‹ e ›).
- Semana começa no domingo.
- Dia atual destacado visualmente.
- Dias passados exibidos em cinza e não clicáveis.
- Dias com agendamentos existentes marcados com indicador visual (ponto laranja `•`).
- Data selecionada é destacada com cor primária (rosa).
- Ao trocar de data, o horário selecionado é resetado.

**Grade de horários:**
- Exibe os slots de trabalho: **09:00 às 18:30, a cada 30 minutos** (20 slots por dia).
- Slots já reservados para a data selecionada ficam desabilitados e riscados.
  - O bloqueio é por data, sem isolamento por profissional.
- Slots disponíveis são clicáveis; o selecionado recebe destaque visual.
- Legenda abaixo da grade: rosa = disponível, cinza = ocupado.

**Resumo em tempo real:**
- Aparece automaticamente quando data **e** horário estão selecionados.
- Exibe: nome do cliente, serviço, profissional, data (DD/MM/AAAA), horário, duração e total em R$.

**Envio:**
- Valida se data e horário foram escolhidos; caso contrário, exibe toast de erro.
- Cria o agendamento com `status: 'pending'`.
- Navega para a tela de Confirmação passando o objeto criado.

---

## 6. Tela 3 — Confirmação de Agendamento

Exibida imediatamente após a criação de um novo agendamento.

**Exibe:**
- Ícone ✅ animado (efeito "pop" ao entrar na tela).
- Título "Agendamento realizado!".
- Card com: ícone e nome do serviço, nome do profissional.
- Detalhes do agendamento: cliente, telefone, data, horário, duração e total.
- Nota de aviso informando que a reserva está como **pendente** e será confirmada pela equipe.

**Ações disponíveis:**

| Botão | Comportamento |
|-------|---------------|
| "✅ Confirmar e ir para agenda" | Muda o status para `confirmed` + toast de sucesso + navega para `home` |
| "📋 Ver todos os agendamentos" | Navega para `home` sem confirmar (agendamento permanece `pending`) |

---

## 7. Notificações (Toast)

- Exibição no canto inferior direito da tela.
- Duração: **3,2 segundos**, some automaticamente.
- Dois tipos visuais:
  - `success` — borda esquerda verde.
  - `error` — borda esquerda vermelha.
- Disparado nas situações:

| Evento | Mensagem | Tipo |
|--------|----------|------|
| Agendamento confirmado (home) | "✅ Agendamento confirmado!" | success |
| Agendamento cancelado (home) | "🗑️ Agendamento cancelado." | error |
| Agendamento confirmado (confirmação) | "✅ Agendamento confirmado com sucesso!" | success |
| Campo obrigatório em branco | "⚠️ Informe o nome do cliente." / "⚠️ Informe o telefone." | error |
| Serviço não selecionado | "⚠️ Selecione um serviço." | error |
| Data/horário não selecionado | "⚠️ Selecione uma data." / "⚠️ Selecione um horário." | error |

---

## 8. Dados de Referência

### 8.1 Profissionais

| ID | Nome | Cor |
|----|------|-----|
| 1 | Ana Paula | Rosa (#f472b6) |
| 2 | Juliana | Lilás (#a78bfa) |
| 3 | Fernanda | Verde (#34d399) |

### 8.2 Horários de Funcionamento

- Das **09:00** às **18:30**, intervalos de **30 minutos**.
- Total de **20 slots** por dia.

### 8.3 Dados Simulados (fake)

6 agendamentos pré-carregados para demonstração:

| Cliente | Serviço | Profissional | Data | Horário | Status |
|---------|---------|--------------|------|---------|--------|
| Mariana Costa | Corte Feminino | Ana Paula | Hoje | 09:00 | confirmed |
| Beatriz Lima | Coloração | Juliana | Hoje | 10:00 | confirmed |
| Carlos Silva | Corte Masculino | Fernanda | Hoje | 11:00 | confirmed |
| Patrícia Mendes | Manicure | Ana Paula | Amanhã | 14:00 | pending |
| Fernanda Rocha | Hidratação Capilar | Juliana | Amanhã | 15:30 | confirmed |
| Lucas Andrade | Corte Masculino | Fernanda | +2 dias | 09:30 | confirmed |

---

## 9. Regras de Negócio

1. Todo agendamento criado pelo formulário nasce com `status: 'pending'`.
2. A confirmação pode ocorrer na tela de Confirmação ou diretamente pelo card na Agenda.
3. O cancelamento remove o agendamento permanentemente (sem soft-delete).
4. Não é possível agendar em datas passadas.
5. Um slot de horário é considerado ocupado se **qualquer** agendamento já existente naquela data usar aquele slot, independente do profissional.
6. Se nenhum profissional for selecionado, um dos 3 é sorteado aleatoriamente ao confirmar o agendamento.
7. Não há persistência — todos os dados são reiniciados ao recarregar a página.
8. Não há autenticação — qualquer usuário pode criar, confirmar e cancelar agendamentos.

---

## 10. Requisitos Não Funcionais

| Categoria | Requisito |
|-----------|-----------|
| **Responsividade** | Layout adaptado para mobile (`max-width: 600px`): formulário em coluna única, botões empilhados, stats sem borda lateral |
| **Acessibilidade** | Elementos interativos com cursor pointer; labels associados a inputs; contraste de cores adequado |
| **Performance** | Filtros, stats e slots calculados com `useMemo` para evitar recomputações desnecessárias |
| **Feedback imediato** | Toast para toda ação destrutiva ou de criação; desabilitação visual de slots e dias bloqueados |
| **Timezone** | Datas construídas com sufixo `T12:00:00` para evitar deslocamento de UTC em fuso horário negativo |

---

## 11. Fora do Escopo (versão atual)

- Integração com Google Calendar ou qualquer calendário externo.
- Backend / API REST / banco de dados.
- Autenticação de usuários ou controle de acesso por perfil.
- Persistência local (localStorage / IndexedDB).
- Envio de notificações (e-mail, SMS, WhatsApp).
- Isolamento de agenda por profissional (dois clientes podem ter o mesmo horário com profissionais diferentes — não está implementado).
- Reagendamento de um agendamento existente.
- Histórico de agendamentos passados.
- Cadastro e edição de serviços ou profissionais pela interface.

---

## 12. Problemas Conhecidos

| # | Descrição | Impacto |
|---|-----------|---------|
| 1 | Os agendamentos iniciais (`INITIAL_APPOINTMENTS`) usam a propriedade `procedure` e `stylist`, enquanto os agendamentos criados pelo formulário usam `procedureId` e `stylistId`. O componente `AppointmentCard` lê `appt.procedure` e `appt.stylist`, portanto os novos agendamentos **não exibem corretamente o serviço e o profissional** no card. | Funcional — afeta exibição dos dados criados pelo usuário |
