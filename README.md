# Sistema de Aluguel de Carros

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge)](https://github.com/igorfclima/Sistema-Aluguel-de-Carros/releases)
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** [Acesse a Aplicação Web](https://sistema-aluguel-de-carros.vercel.app)
* 📖 **Documentação:** [Swagger API Docs](https://sistema-aluguel-de-carros-production.up.railway.app/api/swagger/index.html)

---

## 📝 Sobre o Projeto
O **Sistema de Aluguel de Carros** foi desenvolvido para automatizar e gerenciar o ciclo de vida de locação de veículos. O projeto integra clientes, agentes financeiros e administradores de frota em uma plataforma unificada.

- **Por que ele existe:** Para substituir processos manuais de análise de crédito por uma plataforma integrada.
- **Qual problema ele resolve:** Agiliza a análise de pedidos de aluguel através de dossiês financeiros automatizados e garante o rastreio da posse legal do veículo.

---

## ✨ Funcionalidades Principais
- 🔐 **Autenticação JWT:** Login seguro com níveis de acesso (CLIENTE e AGENTE).
- 🚗 **Gestão de Frota:** Cadastro completo de automóveis com controle de matrícula e placa.
- 💰 **Dossiê Financeiro:** Soma automatizada de múltiplos rendimentos para análise de crédito.
- 📄 **Fluxo de Contratos:** Formalização de contratos de crédito ou aluguel direto.
- 📊 **Painel do Agente:** Interface dedicada para aprovação de solicitações pendentes.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
* **Framework:** Next.js 14+ (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS & Shadcn/UI

### 🖥️ Back-end
* **Linguagem:** Go (Golang) 1.22+
* **Framework:** Gin Gonic
* **ORM:** GORM
* **Banco de Dados:** PostgreSQL

---

## 🏗 Arquitetura
O sistema segue os princípios de separação de responsabilidades:
- **Models:** Definição das entidades e relacionamentos.
- **Handlers:** Controladores das rotas REST e validação de JSON.
- **Services:** Camada de lógica de negócio e regras do sistema.

---

---

## 📂 Estrutura de Pastas

Abaixo está a organização do monorepo, separando a lógica de negócio do Backend e a interface do Frontend.

```text
.
├── /frontend                    # Aplicação Next.js (TypeScript + Tailwind)
│   ├── /src
│   │   ├── /components          # Componentes reutilizáveis (Shadcn/UI)
│   │   ├── /app                 # Rotas e páginas da aplicação
│   │   ├── /services            # Chamadas de API (Axios/Fetch)
│   │   ├── /assets              # Imagens do projeto
│   │   ├── /context             # Contextos e auth
│   │   ├── /lib                 #
│   │   └── /types               # Tipos e statics
│   ├── .env.local               # Variáveis de ambiente do Frontend
│   └── package.json             # Dependências e scripts Node.js
│
├── /backend                     # API REST em Go (Golang)
│   ├── /internal
│   │   ├── /handler             # Manipuladores de rotas (Controllers)
│   │   ├── /dto                 # DTOs
│   │   ├── /models              # Modelos de banco
│   │   ├── /service             # Regras de negócio e validações
│   │   ├── /repository          # Persistência e consultas GORM
│   │   └── /middleware          # Autenticação JWT e CORS
│   ├── /pkgs/database           # Configuração de conexão com PostgreSQL
│   ├── go.mod                   # Módulos e dependências do Go
│   └── /cmd/main.go                  # Ponto de entrada da aplicação
│
.
```

## 🔧 Instalação e Execução

### Pré-requisitos
* **Go:** 1.20+
* **Node.js:** 18.x+
* **Docker**

### ⚡ Como Executar

### Backend (`/backend/.env`)

```env
PORT=8080
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
JWT_SECRET=sua_chave_secreta_aqui
```

---

### Frontend (`/frontend/.env.local`)

```env
VITE_API_URL=http://localhost:8080/api
```

---

## ⚡ Como Executar

### Terminal 1: Back-end (Go)

```bash
cd backend
go mod tidy
go run main.go
```

---

### Terminal 2: Front-end (Next.js)

```bash
cd frontend
npm install
npm run dev
```

