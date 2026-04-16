# Sistema de Aluguel de Carros

Sistema completo para gestão de aluguel de automóveis, integrando clientes, agentes financeiros e administradores. O projeto abrange desde a solicitação de aluguel até a análise de crédito e formalização de contratos.

## Tecnologias

- Backend: Go (Golang) com GORM (ORM)
- Frontend: Next.js (TypeScript), Tailwind CSS e Shadcn/UI
- Banco de Dados: PostgreSQL (Hospedado via Railway)
- Autenticação: JWT (JSON Web Tokens)

## Funcionalidades Principais

### Subsistema de Clientes
- Cadastro de usuários com dados pessoais, profissionais e múltiplos rendimentos.
- Solicitação de pedidos de aluguel associados a automóveis disponíveis.
- Acompanhamento de status e edição de pedidos em análise.

### Subsistema de Agentes (Bancos e Empresas)
- Painel de análise de pedidos pendentes.
- Visualização de dossiê financeiro (soma de rendas comprovadas).
- Aprovação ou cancelamento de solicitações.
- Registro de propriedade do veículo (Empresa, Banco ou Cliente).

### Subsistema de Gestão
- Cadastro e controle de frota (marca, modelo, ano, placa e matrícula).
- Formalização de contratos pós-aprovação.
- Geração de documentos de contrato vinculados ao proprietário legal.

## Arquitetura do Sistema

O projeto segue os princípios de separação de responsabilidades:

- Models: Definição das entidades e relacionamentos GORM.
- Repository: Camada de persistência de dados e consultas com Preload.
- Service: Regras de negócio, cálculos de renda e validações.
- Handlers/Controllers: Exposição da API REST e manipulação de JSON.

## Como Executar

### Pré-requisitos
- Go 1.20+
- Node.js 18+

### Instalação

1. Clone o repositório:
   git clone https://github.com/igorfclima/Sistema-Aluguel-de-Carros.git

2. Configure o Backend:
   - Crie um arquivo .env na pasta backend com a sua DATABASE_URL.
   - Execute: go run main.go

3. Configure o Frontend:
   - Execute: npm install
   - Execute: npm run dev

## Regras de Negócio Implementadas

1. Associação de Contrato: Pedidos aprovados por agentes bancários geram contratos de crédito.
2. Propriedade: O sistema rastreia a transição da posse do veículo entre os três atores previstos.
3. Segurança: Rotas protegidas por middleware que validam o tipo de usuário.
