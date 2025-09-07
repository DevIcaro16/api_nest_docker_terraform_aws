# Testing Guide

Este documento descreve como executar e entender os testes da aplicação.

## Estrutura dos Testes

### Testes Unitários

- **Localização**: `src/**/*.spec.ts`
- **Cobertura**: Services e Controllers
- **Mock**: Dependências externas são mockadas

### Testes E2E (End-to-End)

- **Localização**: `test/**/*.e2e-spec.ts`
- **Cobertura**: Fluxos completos da API
- **Ambiente**: Aplicação completa com banco de dados

## Scripts Disponíveis

### Executar Todos os Testes

```bash
npm run test:all
```

### Executar Apenas Testes Unitários

```bash
npm run test:unit
```

### Executar Apenas Testes E2E

```bash
npm run test:e2e
```

### Executar Testes com Coverage

```bash
npm run test:cov
```

### Executar Testes em Modo Watch

```bash
npm run test:watch
```

## Configuração de Ambiente

### Variáveis de Ambiente para Testes

Os testes usam as seguintes variáveis de ambiente (definidas em `src/test-setup.ts`):

```env
NODE_ENV=test
LOCAL_DEVELOPMENT=true
ENVIRONMENT=test
JWT_SECRET=test-secret-key-for-testing-only
AWS_REGION=us-east-1
PUBLIC_ENDPOINT_METADATA_KEY=public-endpoint
```

### Arquivo .env.test (Opcional)

Crie um arquivo `.env.test` na raiz do projeto para sobrescrever configurações específicas de teste.

## Estrutura dos Testes

### Testes Unitários

#### UsersService

- ✅ `createUser` - Criação de usuário com validações
- ✅ `getUserByID` - Busca de usuário por ID
- ❌ Validação de email duplicado
- ❌ Hash de senha
- ❌ Tratamento de erros

#### AuthService

- ✅ `login` - Autenticação com credenciais válidas
- ✅ `login` - Falha com credenciais inválidas
- ✅ `login` - Falha com usuário inexistente
- ❌ Geração de JWT payload

#### Controllers

- ✅ `UsersController` - Todos os endpoints
- ✅ `AuthController` - Endpoint de login
- ❌ Validação de DTOs
- ❌ Tratamento de erros HTTP

### Testes E2E

#### Fluxo Completo de Usuário

1. ✅ Criação de usuário
2. ✅ Login com credenciais válidas
3. ✅ Busca de usuário por ID
4. ✅ Busca de usuário autenticado (`/me`)

#### Validações de API

- ✅ Validação de DTOs
- ✅ Códigos de status HTTP
- ✅ Autenticação JWT
- ✅ Tratamento de erros

## Cobertura de Testes

### Services

- **UsersService**: 100% dos métodos públicos
- **AuthService**: 100% dos métodos públicos

### Controllers

- **UsersController**: 100% dos endpoints
- **AuthController**: 100% dos endpoints

### Cenários Testados

- ✅ Casos de sucesso
- ✅ Casos de erro
- ✅ Validações de entrada
- ✅ Autenticação e autorização

## Executando Testes Específicos

### Por Arquivo

```bash
npm run test -- users.service.spec.ts
```

### Por Padrão

```bash
npm run test -- --testNamePattern="createUser"
```

### Com Debug

```bash
npm run test:debug
```

## Troubleshooting

### Erro de Configuração

Se os testes falharem por configuração, verifique:

1. Variáveis de ambiente estão definidas
2. Dependências estão instaladas
3. Banco de dados de teste está configurado

### Erro de Timeout

Para testes E2E, o timeout padrão é 10 segundos. Ajuste se necessário no `jest-e2e.json`.

### Mock Issues

Se mocks não funcionarem, verifique:

1. Imports corretos
2. Tipos TypeScript
3. Configuração do Jest


