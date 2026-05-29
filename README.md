# HFD - Ambiente Familiar Digital

Um espaço digital privado, simples e íntimo para famílias.

## 🏗 Arquitetura
- **Frontend**: React + Vite + TypeScript
- **Estilo**: TailwindCSS (Design Minimalista)
- **Backend/BaaS**: Firebase (Auth, Firestore)
- **Infra**: Vercel
- **Filosofia**: Mobile-first, PWA, Clean Code, Dados Isolados.

## 🚀 Deploy na Vercel (Direto do GitHub)
1. Acesse [Vercel](https://vercel.com) e conecte sua conta GitHub.
2. Clique em **Add New > Project** e selecione este repositório.
3. A Vercel detectará automaticamente que é um projeto Vite.
4. Em **Environment Variables**, adicione as chaves do Firebase:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `...` (etc)
5. Clique em **Deploy**.
