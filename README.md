# JV Vogler — Portfólio

[![en](https://img.shields.io/badge/README%20in-english-red.svg)](./README.en.md)

Portfólio pessoal e blog construído com uma stack moderna, seguindo a **Layered Frontend Architecture**.

### [**Página ao vivo**](https://jvvogler.com)

---

## Tech Stack

| Categoria           | Tecnologia                                |
| ------------------- | ----------------------------------------- |
| Framework           | Next.js 16 (App Router, RSC)              |
| Linguagem           | TypeScript 5                              |
| Gerenciador         | pnpm                                      |
| Estilização         | Tailwind CSS v4 + shadcn/ui               |
| Internacionalização | next-intl (EN / PT-BR)                    |
| Formulários         | React Hook Form + Zod                     |
| Ícones              | lucide-react + simple-icons               |
| Animações           | Framer Motion                             |
| Blog                | MDX local + next-mdx-remote + gray-matter |
| SEO                 | Metadata API, sitemap, robots, JSON-LD    |
| Analytics           | Vercel Analytics + Speed Insights         |
| E-mail              | Resend (via Server Actions)               |
| Linting             | Oxlint                                    |
| Formatação          | Oxfmt                                     |
| Deploy              | Vercel                                    |

---

## Arquitetura

O projeto segue uma **Layered Frontend Architecture** com 4 camadas:

```
src/
├── core/       # Tipos de domínio + lógica pura (zero imports de framework)
├── lib/        # Utilitários genéricos (zero conhecimento de domínio)
├── app/        # Roteamento Next.js + Server Actions + acesso a dados
├── ui/         # Componentes React, hooks, tema, animações
├── i18n/       # Configuração de internacionalização
└── messages/   # Arquivos de tradução (en.json, pt.json)
```

**Regras de dependência:**

- `core/` → sem dependências externas (apenas Zod)
- `lib/` → sem imports de `core/`, `app/` ou `ui/`
- `app/` → pode importar de `core/` e `lib/`
- `ui/` → pode importar de `core/`, `lib/` e `app/`

---

## Início Rápido

### Pré-requisitos

- Node.js ≥ 20
- pnpm ≥ 9

### Instalação

```bash
pnpm install
```

### Variáveis de Ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env.local
```

Variáveis necessárias:

| Variável                        | Descrição                         |
| ------------------------------- | --------------------------------- |
| `RESEND_API_KEY`                | Chave da API do Resend            |
| `CONTACT_EMAIL_TO`              | Email de destino do formulário    |
| `CONTACT_EMAIL_FROM`            | Email remetente (domínio Resend)  |
| `NEXT_PUBLIC_BASE_URL`          | URL de produção                   |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ID do Google Analytics (opcional) |

### Desenvolvimento

```bash
pnpm dev          # Servidor de desenvolvimento (Turbopack)
pnpm build        # Build de produção
pnpm start        # Servir build de produção
```

### Qualidade de Código

```bash
pnpm lint           # Oxlint
pnpm format         # Oxfmt (auto-fix)
pnpm format:check   # Oxfmt (verificação)
pnpm typecheck      # tsc --noEmit
pnpm typecheck:go   # tsgo --noEmit (experimental)
```

---

## Blog

Posts são escritos em MDX e ficam em `content/blog/<locale>/`:

```
content/blog/
├── en/
│   └── meu-post.mdx
└── pt/
    └── meu-post.mdx
```

Cada arquivo MDX precisa de frontmatter:

```yaml
---
title: 'Título do Post'
description: 'Descrição breve'
date: '2026-02-28'
tags: ['react', 'next.js']
published: true
---
```

Posts com `published: false` são excluídos do build. ISR com revalidação de 1 hora.

---

## Deploy

O projeto é deployado automaticamente na **Vercel** a cada push no `main`. Preview deployments são criados para cada PR.

---

## Licença

[MIT](https://choosealicense.com/licenses/mit/).
Todos os direitos reservados &copy; 2026 JV Vogler.
