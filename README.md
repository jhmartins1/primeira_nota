# 🎵 Primeira Nota

O **Primeira Nota** é um aplicativo mobile para gerenciamento e agendamento de aulas particulares de música.

A plataforma conecta **alunos e professores**, permitindo que alunos escolham seus instrumentos, encontrem professores e agendem aulas de acordo com os horários disponíveis. Para os professores, o aplicativo oferece ferramentas para gerenciamento de disponibilidade e acompanhamento das próximas aulas.

O projeto foi desenvolvido com uma arquitetura **Full Stack**, utilizando React Native com Expo no aplicativo mobile e Node.js com Express no backend.

---

## 📱 Sobre o projeto

O Primeira Nota foi desenvolvido com o objetivo de simplificar o processo de organização de aulas particulares de música.

A aplicação possui dois tipos de conta:

### 👨‍🎓 Aluno

O aluno pode:

- Criar e completar seu perfil;
- Informar endereço para realização das aulas;
- Selecionar os instrumentos que estuda;
- Informar seu nível em cada instrumento;
- Informar se possui o instrumento em casa;
- Visualizar professores disponíveis;
- Consultar datas e horários disponíveis;
- Agendar aulas;
- Remarcar aulas;
- Cancelar agendamentos;
- Visualizar suas próximas aulas;
- Entrar em contato com o professor pelo WhatsApp.

### 👨‍🏫 Professor

O professor pode:

- Gerenciar os instrumentos que ensina;
- Definir os níveis em que leciona;
- Cadastrar sua disponibilidade;
- Visualizar aulas agendadas;
- Visualizar informações do aluno;
- Verificar se o aluno possui o instrumento da aula;
- Consultar o endereço onde a aula será realizada;
- Abrir o endereço no mapa;
- Entrar em contato com o aluno pelo WhatsApp;
- Remarcar aulas;
- Cancelar aulas.

---

## 🛠️ Tecnologias

### Mobile

- React Native
- Expo
- TypeScript
- Expo Router
- Clerk
- Google Sign-In
- Async Storage
- Expo Secure Store
- React Navigation
- Expo Vector Icons

### Backend

- Node.js
- Bun
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Clerk Backend
- Svix

### Infraestrutura e serviços

- **Supabase** — banco de dados PostgreSQL e armazenamento;
- **Render** — hospedagem da API;
- **Clerk** — autenticação e gerenciamento de usuários;
- **Expo / EAS** — desenvolvimento e geração das builds mobile.

---

## 🏗️ Arquitetura

O projeto é dividido em duas aplicações principais:

```text
Primeira-Nota/
│
├── app/                 # Aplicativo React Native + Expo
│
└── server/              # API Node.js + Express
```

Fluxo simplificado da aplicação:

```text
┌──────────────────────────┐
│      React Native        │
│         Expo             │
└────────────┬─────────────┘
             │
             │ HTTP / REST
             ▼
┌──────────────────────────┐
│     Express + Bun        │
│          API             │
└────────────┬─────────────┘
             │
             │ Prisma ORM
             ▼
┌──────────────────────────┐
│       PostgreSQL         │
│        Supabase          │
└──────────────────────────┘

        Autenticação
             │
             ▼
┌──────────────────────────┐
│          Clerk           │
└──────────────────────────┘
```

---

## 🔐 Autenticação

A autenticação da aplicação é realizada utilizando o **Clerk**.

O aplicativo possui suporte a autenticação com Google e diferencia automaticamente contas de **aluno** e **professor**.

As rotas privadas da API utilizam autenticação para identificar o usuário e controlar o acesso aos recursos correspondentes ao tipo de conta.

---

## 🎸 Instrumentos

Atualmente, a plataforma possui suporte aos seguintes instrumentos:

- Violão
- Guitarra
- Teclado
- Piano
- Bateria
- Baixo
- Ukulele
- Flauta

Cada aluno pode selecionar seus instrumentos, definir o nível de experiência e informar se possui o instrumento em casa.

Professores podem selecionar os instrumentos que ensinam e os níveis atendidos.

---

## 📅 Sistema de agendamento

O sistema de agendamento utiliza a disponibilidade cadastrada pelos professores.

O aluno pode consultar os horários disponíveis e realizar um agendamento considerando:

- Professor;
- Instrumento;
- Nível;
- Data;
- Horário.

A aplicação também realiza verificações para evitar conflitos de horários e permite que alunos e professores remarquem ou cancelem aulas.

---

## 🗄️ Banco de dados

O projeto utiliza **PostgreSQL** com **Prisma ORM**.

Entre as principais entidades estão:

```text
Usuario
Professor
Instrumento
Nivel
UsuarioInstrumento
ProfessorInstrumento
Disponibilidade
Agendamento
```

O relacionamento entre essas entidades permite controlar os instrumentos e níveis de alunos e professores, disponibilidade de horários e os agendamentos realizados.

---

## 🚀 Executando o projeto

### Pré-requisitos

Antes de começar, é necessário possuir:

- Node.js
- Bun
- Expo
- PostgreSQL ou uma instância no Supabase
- Conta no Clerk

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre no diretório:

```bash
cd Primeira-Nota
```

---

## 📱 Executando o aplicativo

Entre na pasta do aplicativo:

```bash
cd app
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Para executar no Android:

```bash
npm run android
```

Para executar no navegador:

```bash
npm run web
```

---

## ⚙️ Executando o backend

Entre na pasta do servidor:

```bash
cd server
```

Instale as dependências:

```bash
bun install
```

Gere o Prisma Client:

```bash
bunx prisma generate
```

Execute as migrations:

```bash
bunx prisma migrate dev
```

Inicie o servidor em modo de desenvolvimento:

```bash
bun dev
```

Por padrão, a API será iniciada localmente conforme a porta configurada nas variáveis de ambiente.

---

## 🔑 Variáveis de ambiente

O projeto utiliza variáveis de ambiente tanto no aplicativo quanto no backend.

### Mobile

Crie um arquivo `.env` dentro de `app/`:

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_CLERK_GOOGLE_ANDROID_CLIENT_ID=
```

### Backend

Crie um arquivo `.env` dentro de `server/`:

```env
DATABASE_URL=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
PORT=
```

> Nunca envie arquivos `.env` ou chaves privadas para o repositório.

---

## 📦 Principais dependências

### Frontend

```text
React 19
React Native
Expo 57
Expo Router
Clerk Expo
Expo Auth Session
Expo Secure Store
Async Storage
React Navigation
TypeScript
```

### Backend

```text
Bun
Express 5
Prisma 7
PostgreSQL
Clerk Backend
Svix
TypeScript
```

---

## ☁️ Deploy

A arquitetura atual utiliza:

```text
Aplicativo Mobile
      │
      │ Expo / EAS
      ▼
  Android Build

      │
      │ HTTPS
      ▼

Render
  │
  └── API Node.js / Express
            │
            │ Prisma
            ▼
        Supabase
        PostgreSQL

Clerk
  └── Autenticação
```

A API é hospedada no **Render**, enquanto o banco PostgreSQL e os recursos de armazenamento são fornecidos pelo **Supabase**.

As builds Android são geradas utilizando **Expo Application Services (EAS)**.

---

## 📂 Estrutura do backend

A API segue uma separação de responsabilidades entre rotas, controllers e services:

```text
server/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
└── src/
    ├── controllers/
    ├── generated/
    ├── middlewares/
    ├── prisma/
    ├── routes/
    ├── services/
    └── server.ts
```

Essa estrutura mantém regras de negócio separadas dos controllers e das definições de rotas.

---

## 📂 Estrutura do aplicativo

O aplicativo utiliza o **Expo Router** para navegação baseada em arquivos.

Uma estrutura simplificada é:

```text
app/
├── assets/
├── src/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   └── screens/
│
├── app.json
├── eas.json
└── package.json
```

---

## 🧪 Scripts úteis

### Mobile

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

### Backend

```bash
bun dev
bun start

bun run prisma:generate
bun run prisma:studio
bun run prisma:migrate
bun run prisma:deploy
bun run prisma:seed
```

---

## 🔄 Fluxo principal

```text
Login
  │
  ▼
Autenticação com Clerk
  │
  ├───────────────┐
  ▼               ▼
Aluno          Professor
  │               │
  ▼               ▼
Instrumentos   Instrumentos
e níveis       e níveis
  │               │
  ▼               ▼
Professor      Disponibilidade
  │               │
  └───────┬───────┘
          ▼
      Agendamento
          │
          ▼
     Próximas aulas
          │
     ┌────┴────┐
     ▼         ▼
  Remarcar   Cancelar
```

---

## 🎯 Objetivo

O Primeira Nota busca centralizar o processo de contratação e organização de aulas particulares de música em uma experiência simples para alunos e professores.

O projeto também foi desenvolvido como uma aplicação Full Stack completa, envolvendo:

- Desenvolvimento mobile;
- API REST;
- Autenticação;
- Modelagem de banco de dados;
- ORM;
- Integração com serviços externos;
- Deploy de backend;
- Banco de dados em nuvem;
- Build e distribuição de aplicativo Android.

---

## 👨‍💻 Autor

Desenvolvido por **João Heitor Martins**.

Projeto desenvolvido para estudo e aplicação prática de desenvolvimento **Full Stack e Mobile**.

---

## 📄 Licença

Este projeto é de uso educacional e pessoal.
