
# 📅 Escala de Voluntários 2026

Um Progressive Web App (SPA) moderno para gerenciamento de escalas de voluntários, projetado especificamente para o calendário de 2026, com foco em domingos e quartas-feiras.

![Status do Projeto](https://img.shields.io/badge/Status-Pronto_para_uso-brightgreen)
![Firebase](https://img.shields.io/badge/Backend-Firebase_Firestore-orange)
![React](https://img.shields.io/badge/Frontend-React_19-blue)

## 🚀 Funcionalidades

- **Gerenciamento Anual (2026):** Cálculo automático de domingos (manhã/noite) e quartas-feiras (noite).
- **Sincronização em Tempo Real:** Integração direta com Google Firebase Firestore. Os dados são salvos instantaneamente ao digitar (blur ou enter).
- **Interface Premium:** Design baseado em cartões (Cards), com distinção visual por cores (Laranja para Domingos, Azul para Quartas).
- **Feedback de Status:** Indicadores visuais de carregamento, sucesso e erro para cada campo de entrada.
- **Responsividade Total:** Otimizado para dispositivos móveis, tablets e desktops.

## 🛠️ Tecnologias Utilizadas

- **React 19:** Biblioteca principal para a interface.
- **Tailwind CSS:** Estilização utilitária moderna.
- **Firebase Firestore:** Banco de dados NoSQL em tempo real.
- **Lucide React:** Conjunto de ícones minimalistas.
- **ESM.sh:** Gerenciamento de módulos sem necessidade de build complexo.

## 📦 Como subir seu próprio repositório

1. **Clone o projeto:**
   ```bash
   git clone https://github.com/seu-usuario/escala-voluntarios-2026.git
   ```

2. **Configuração do Firebase:**
   O arquivo `firebase.ts` já contém as credenciais configuradas para o projeto `escala-2026`. Se desejar usar seu próprio banco:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
   - Ative o Firestore Database.
   - Substitua o objeto `firebaseConfig` em `firebase.ts`.

3. **Deploy no GitHub Pages:**
   Este projeto foi estruturado para funcionar como um site estático. Você pode usar o comando `npm run deploy` se estiver usando um bundler como Vite, ou simplesmente configurar as GitHub Actions para hospedar o `index.html`.

## 🎨 Guia de Cores

- **Domingos:** `#FFF9F2` (Fundo) | `text-orange-600` (Destaque)
- **Quartas:** `#F5F7FF` (Fundo) | `#4a36d1` (Destaque/Header)

---
Desenvolvido com ❤️ por [Seu Nome/Empresa]
