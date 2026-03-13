# Trainify Frontend

Aplicação web responsiva de última geração para o ecossistema Trainify. Projetada para performance, excelência estética e experiência de usuário premium.

## A Visão

O frontend do Trainify é a interface para a evolução do treinamento. Transforma dados complexos de treino em uma experiência intuitiva e visualmente sofisticada. Construído com os recursos mais recentes do React 19 e Next.js 16, garante transições fluidas, interações em tempo real com IA e uma interface "viva" que se adapta à jornada fitness do usuário.

### Destaques Principais
- **Estética Premium**: Desenvolvido com Tailwind CSS v4 e Framer Motion para animações e interações fluidas de alto padrão.
- **UX Aprimorada por IA**: Chat integrado com IA e onboarding inteligente para personalizar a jornada do usuário.
- **Integração Type-Safe com API**: Conexão direta com a API Trainify utilizando geração de código em nível enterprise (Orval).
- **Responsivo e Focado em Performance**: Otimizado para atletas em dispositivos móveis e desktop utilizando padrões modernos da web.

## Tecnologias

- **Framework**: Next.js 16 (App Router, Server Actions)
- **Biblioteca**: React 19
- **Estilização**: Tailwind CSS v4
- **Animações**: Framer Motion
- **Componentes**: Radix UI e Shadcn/UI
- **Estado e Formulários**: React Hook Form e Zod
- **Autenticação**: Better Auth
- **Cliente API**: Orval (geração type-safe de cliente)

## Estrutura do Projeto

- `src/app`: Estrutura moderna do App Router definindo a jornada do usuário (Onboarding, Planos de Treino, Estatísticas, Perfil).
- `src/components`: Componentes UI atômicos e de alto nível construídos com Radix e Tailwind v4.
- `src/hooks`: Lógica reativa customizada e hooks de interação com a API.
- `src/lib`: Funções utilitárias principais e configurações do sistema.
- `src/providers`: Context providers para temas, autenticação e estado global.

## Primeiros Passos

### Pré-requisitos
- Node.js 20+
- Pnpm (recomendado)

### Instalação
```bash
pnpm install
```

### Configuração de Ambiente
Crie um arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```

### Desenvolvimento
```bash
pnpm dev
```

### Sincronização com API
Para atualizar o cliente API type-safe quando o esquema do backend for alterado:
```bash
pnpm exec orval
```

## Filosofia de UI

Acreditamos que o acompanhamento fitness deve ser tão motivador quanto o próprio treino. Nosso sistema de design prioriza clareza, microinterações e uma experiência coesa entre modos claro/escuro que se apresenta como moderna e profissional.

---
*Potencializando sua evolução através de código e dedicação.*