# Trainify Frontend

<div align="center">
  <img src="https://raw.githubusercontent.com/willianOliveira-dev/trainify-frontend/main/public/logo.png" alt="Trainify Logo" width="200"/>
  
  <br/>
  
  <img src="https://img.shields.io/badge/Next.js-16.x-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Google_AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google AI"/>
</div>

<br/>

Aplicação web responsiva de última geração para o ecossistema Trainify. Projetada para performance, excelência estética e experiência de usuário premium.

---

## Sobre o Projeto

O frontend do Trainify é a interface para a evolução do treinamento. Transforma dados complexos de treino em uma experiência intuitiva e visualmente sofisticada. Construído com os recursos mais recentes do React 19 e Next.js 16, garante transições fluidas, interações em tempo real com IA e uma interface "viva" que se adapta à jornada fitness do usuário.

### Destaques Principais
- **UX Aprimorada por IA**: Chat integrado com IA (@ai-sdk/react) e onboarding inteligente
- **Type-Safe**: Integração com backend via cliente gerado pelo Orval
- **Componentização**: Design system consistente com Radix UI e Shadcn/UI

---

## Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Estilização** | Tailwind CSS v4, class-variance-authority, tailwind-merge |
| **Componentes** | Radix UI, Shadcn/UI, Vaul (drawers) |
| **Formulários** | React Hook Form, Zod, @hookform/resolvers |
| **Autenticação** | Better Auth 1.4.18 |
| **Integrações** | AI SDK, @ai-sdk/react (Google Gemini) |
| **Cliente API** | Orval (geração type-safe) |
| **Utilitários** | Day.js, nuqs (query params), sonner (toasts) |
| **Qualidade** | Biome, TypeScript |

---

## Primeiros Passos

### Pré-requisitos
- Node.js 20+
- pnpm (recomendado)
- API Trainify em execução (local ou produção)

### Instalação

```bash
git clone https://github.com/willianOliveira-dev/trainify-frontend.git
cd trainify-frontend
pnpm install
cp .env.example .env
```

Configure as variáveis no arquivo `.env`:
```env
NEXT_PUBLIC_API_URL=sua_url_da_api
NEXT_PUBLIC_GOOGLE_AI_KEY=sua_chave_api
```

### Execução

```bash
pnpm dev    # Modo desenvolvimento
pnpm build  # Build para produção
pnpm start  # Modo produção
```

### Sincronização com API

Para atualizar o cliente API type-safe quando o esquema do backend for alterado:

```bash
pnpm exec orval
```

---

## Estrutura do Projeto

```
src/
├── actions/
├── app/
│   ├── auth/
│   ├── onboarding/
│   ├── profile/
│   ├── stats/
│   ├── workout-plans/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── config/
├── constants/
├── context/
├── hooks/
├── lib/
└── providers/
```

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia servidor em desenvolvimento |
| `pnpm build` | Compila para produção |
| `pnpm start` | Inicia servidor em produção |
| `pnpm lint` | Verifica problemas de código com Biome |
| `pnpm format` | Formata código automaticamente |
| `pnpm orval` | Gera cliente API type-safe |

---

## Integração com Backend

O frontend consome a [Trainify API](https://github.com/willianOliveira-dev/trainify-api), que fornece:

- Geração de treinos com Google AI (Gemini)
- Gerenciamento de planos e sessões
- Autenticação segura com Better Auth
- Estatísticas e acompanhamento

### Endpoints Consumidos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/*` | Autenticação |
| GET | `/api/workout-plans` | Lista planos do usuário |
| POST | `/api/ia/generate-workout` | Gera treino com IA |
| POST | `/api/workout-sessions` | Inicia nova sessão |

---

## Funcionalidades Principais

- **Geração com IA**: Chat integrado para criar treinos personalizados
- **Design Responsivo**: Experiência otimizada para mobile e desktop
- **Vídeos Demonstrativos**: Integração com YouTube para execução correta
- **Dashboard Interativo**: Visualização de progresso e estatísticas
- **Tema Claro/Escuro**: Suporte nativo com next-themes

---

## Filosofia de UI

Acreditamos que o acompanhamento fitness deve ser tão motivador quanto o próprio treino. Nosso sistema de design prioriza:

- **Clareza**: Informações apresentadas de forma intuitiva
- **Microinterações**: Feedback visual em cada ação do usuário
- **Coesão**: Experiência consistente entre modos claro/escuro
- **Performance**: Carregamento otimizado e transições fluidas

---

## Aviso Legal

Este projeto foi desenvolvido exclusivamente para fins educacionais e como parte de portfólio pessoal.

- **Direitos Autorais**: A integração com a API do YouTube é utilizada apenas para busca de vídeos públicos. O Trainify não hospeda, reivindica autoria ou possui direitos sobre os vídeos exibidos.
- **Natureza do Projeto**: Este não é um produto comercial. Os planos gerados por IA são demonstrações e não substituem orientação profissional qualificada.
- **Uso do Código**: Sinta-se à vontade para explorar e usar como referência para seus próprios estudos.