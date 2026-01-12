# TODO - O Tabuleiro da Dominação

## Infraestrutura e Configuração
- [x] Integrar Supabase com o projeto (credenciais e cliente)
- [x] Configurar variáveis de ambiente (Supabase, Gemini, Stripe)
- [x] Instalar dependências necessárias (@supabase/ssr, @google/generative-ai, stripe, framer-motion)

## Backend - Banco de Dados e APIs
- [x] Criar schema Drizzle para profiles e user_progress
- [x] Implementar helpers de banco de dados (getUserProgress, updateProgress, etc.)
- [x] Criar API de chat com Gemini (/api/chat) com validação de respostas
- [x] Implementar lógica do "Guardião" (Mentor Arthur) com System Instruction)
- [x] Criar endpoint webhook Stripe (/api/webhook/stripe)
- [x] Implementar lógica de ativação de usuário após pagamento

## Frontend - Componentes e UI
- [x] Criar componente Map.tsx (tabuleiro isométrico com 20 casas)
- [x] Implementar lógica de bloqueio de fases no Map
- [x] Criar componente ChatBox para interação com o Mentor Arthur
- [x] Desenvolver Landing Page com headline e CTA para Stripe Checkout
- [x] Implementar página do Tabuleiro (dashboard do aluno)
- [x] Adicionar animações com Framer Motion

## Integração de Pagamento
- [x] Configurar Stripe Checkout
- [x] Criar link de pagamento na Landing Page
- [x] Implementar webhook handler para checkout.session.completed
- [x] Testar fluxo de pagamento e ativação

## Testes e Validação
- [ ] Testar autenticação Supabase
- [ ] Testar progressão de fases (bloqueio/desbloqueio)
- [ ] Testar validação de respostas com Gemini
- [ ] Testar webhook Stripe
- [ ] Validar fluxo completo end-to-end

## Deploy e Entrega
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Realizar deploy na Vercel
- [ ] Configurar webhook Stripe com URL de produção
- [ ] Testar aplicação em produção
- [ ] Entregar URLs (produção + repositório GitHub)

## Bugs Críticos
- [x] Corrigir erro de export default no server/_core/index.ts para Vercel (SyntaxError: module does not provide export named 'default')
