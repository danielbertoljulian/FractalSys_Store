# ✦ FractalSyS Store - Overview do Projeto

## 1. Segmento e Propósito
A **FractalSyS Store** é um e-commerce de **Techwear Premium**, focado na interseção entre tecnologia, arte digital e moda. O site não é apenas uma loja, mas uma extensão da identidade digital da FractalSyS, oferecendo "Hardware Têxtil" para entusiastas de programação, IA e cultura hacker.

---

## 2. Identidade Visual
A identidade visual segue a estética **Cyberpunk/Futurista Minimalista**, caracterizada por:

- **Paleta de Cores**: 
  - Fundo: Dark-Grey/Black (#050505, #0A0A0A).
  - Acento 1: Cyan/Neon Blue (#06B6D4) - Representa tecnologia e clareza.
  - Acento 2: Violet/Purple (#7C3AED) - Representa criatividade e mistério.
  - Texto: Zinc/White (#F8FAFC, #A1A1AA).
- **Tipografia**: 
  - **Orbitron**: Usada em títulos e elementos de UI críticos para transmitir uma sensação aeroespacial e tecnológica.
  - **Inter/Sans-serif**: Usada para legibilidade em descrições e textos longos.
- **DNA Visual**: Uso extensivo de glassmorphism (efeitos de vidro/blur), bordas sutis neon e animações fluidas.

---

## 3. Experiência do Usuário (UX) & Efeitos Especiais
O site se destaca por elementos visuais dinâmicos que "reagem" ao usuário:

- **Galaxy Background**: Um campo de estrelas procedural (OGL) que reage ao movimento do mouse, criando profundidade infinita.
- **Audio-Reactive Hero**: O logo central na página inicial reage fisicamente às frequências sonoras da trilha do site, distorcendo-se conforme o bass.
- **Fuzzy Text/Image**: Elementos tipográficos e imagens que possuem uma distorção digital orgânica, lembrando glitches controlados de sistemas avançados.
- **LaserFlow**: Divisores de seção com fluxos de laser e neblina volumétrica.

---

## 4. Funcionalidades de E-commerce
- **Navegação Fluida**: Filtros por categoria (Camisetas, Moletons, Acessórios, Oversized).
- **Gestão de Carrinho**: Estado persistente usando `Zustand`.
- **Checkout via WhatsApp**: Integração direta para fechar vendas via API do WhatsApp, mantendo o atendimento personalizado.
- **Galeria de Produtos**: Visualização de múltiplos ângulos (Assets) com suporte a zoom e placeholders inteligentes.

---

## 5. Ecossistema Administrativo (Fractal Admin)
Um painel de controle robusto para gestão total da loja:
- **Inventory Management**: CRUD completo de produtos.
- **Image Upload System**: Integração direta com **Vercel Blob** para upload de imagens com um clique.
- **Drag & Drop Reordering**: Capacidade de reordenar visualmente os produtos na vitrine apenas arrastando os cards.
- **Secure Access**: Proteção por chave de acesso administrativa.

---

## 6. Arquitetura Técnica
O site é construído com tecnologia de ponta para performance e SEO:

- **Frontend**: Next.js 15+ (App Router) & React 19.
- **Estilização**: Tailwind CSS 4.
- **Banco de Dados**: Neon PostgreSQL (Serverless).
- **ORM**: Drizzle ORM (Type-safe SQL).
- **Armazenamento de Mídia**: Vercel Blob.
- **Animações**: Framer Motion & OGL (WebGL).
- **Lógica de Moeda**: Parser customizado para Real Brasileiro (BRL).

---

## 7. Filosofia "Resiliente"
O site foi projetado para nunca falhar:
- Se o banco de dados estiver inacessível durante o build, o sistema utiliza um **Fallback Estático** (`src/data/products.ts`) para garantir que o cliente sempre veja os itens principais.
- **Image Proxy**: Sistema de tratamento de URLs para garantir que as imagens carreguem corretamente independente da origem.

---
*FractalSyS - Construindo o inimaginável.*
