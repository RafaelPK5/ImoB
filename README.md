# Frontend - Site Imobiliária

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Consome a API do backend para listar e exibir imóveis.

## Pré-requisitos

- Backend rodando em `http://localhost:3001` (ou configure `NEXT_PUBLIC_API_URL` no `.env.local`)

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## O que tem

- **Home**: listagem de imóveis com paginação e filtros (finalidade, tipo, cidade, ordenação)
- **Detalhe do imóvel** (`/imovel/[slug]`): título, preço, endereço, características, descrição e galeria de fotos

Somente imóveis com **status "ativo"** aparecem. Para testar, cadastre imóveis pelo painel admin (quando implementado) ou pelo Prisma Studio: `cd backend && npm run prisma:studio`.

## Variável de ambiente

- `NEXT_PUBLIC_API_URL`: URL base da API (ex: `http://localhost:3001`)
