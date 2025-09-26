# HistoriAção 🚀

**HistoriAção** é uma plataforma interativa que disponibiliza questões de edições anteriores das Olimpíadas Nacionais em História do Brasil (ONHB). O projeto foi desenvolvido para apoiar **estudantes e professores da rede pública**, oferecendo uma ferramenta pedagógica rica, organizada e de fácil acesso.  

🌐 **Acesse o site:** [HistoriAção](https://d27g8rl30ph7b4.cloudfront.net/)

---

## 🖼️ Imagens do Projeto

| Tela Inicial | Questões |
|--------------|----------|
| <img src="https://raw.githubusercontent.com/rayxves/HistoriAcao/main/readme-images/home.png" /> | <img src="https://raw.githubusercontent.com/rayxves/HistoriAcao/main/readme-images/question-screen.png"/> |

---

## ✨ Funcionalidades

### Para Todos os Usuários

#### Página Inicial `/`
- Apresentação do projeto com design moderno e **parallax scrolling**.
- Links diretos para:
  - "Explorar Questões"
  - "Criar Quiz"
- Seção **Como Funciona** explicando o passo a passo da plataforma.

#### Explorar Questões `/questoes`
- **Busca e Filtragem Avançada**:
  - Texto livre no enunciado, alternativas ou tópico.
  - Edição da Olimpíada.
  - Fase da competição.
  - Nível de dificuldade: Fácil, Média, Difícil.
  - Tema e subtema histórico.
  - Período (data inicial e final).

- **Visualização de Questões**:
  - Cada questão em card interativo com enunciado, alternativas e documentos de apoio.

- **Visualizador de Documentos**:
  - Modal para exibir textos e imagens, com informações de título, tipo e origem.

- **Feedback de Respostas**:
  - Indicação visual de pontuação ao selecionar uma alternativa.

- **Paginação**:
  - Navegação eficiente entre resultados da busca.

#### Criar e Jogar Quiz `/quiz`
- **Montagem de Questionário**:
  - Adicione questões do módulo de exploração para criar quizzes personalizados.

- **Gerenciamento do Quiz**:
  - Revisar, remover questões individualmente ou limpar toda a seleção.

- **Modo de Jogo (Quiz Player)**:
  - Interface imersiva com cronômetro.
  - Navegação entre questões.
  - Relatório de resultados: pontuação total, percentual de acerto e tempo gasto.

- **Exportação para PDF**:
  - Exporta o quiz criado com título customizável e gabarito incluso.

### Para Administradores
- A plataforma possui **dashboard de analytics** integrado ao Google Analytics, que fornece métricas de uso da plataforma, incluindo:
  - Número de usuários e visualizações.
  - Duração média de sessões e taxa de rejeição.
  - Páginas mais visitadas e fontes de tráfego.

> O acesso a funcionalidades administrativas é restrito e não é exposto aos usuários comuns.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Framework:** React + Vite  
- **Linguagem:** TypeScript  
- **Estilização:** Tailwind CSS + Shadcn/ui  
- **Roteamento:** React Router DOM  
- **Comunicação com API:** Axios  
- **Gerenciamento de Estado:** React Context API, `useState` / `useEffect`  
- **Testes:**  
  - **Unitários e de Componentes:** Jest + React Testing Library  

### Backend
- **Framework:** .NET 8 (ASP.NET Core Web API)  
- **Linguagem:** C#  
- **Banco de Dados:** PostgreSQL (Supabase)  
- **ORM:** Entity Framework Core  
- **Autenticação:** ASP.NET Core Identity + JWT  
- **Testes:**    
  - **Integração:** xUnit para testes de integração.

### Infraestrutura e Deploy
- **Frontend:** AWS S3 + AWS CloudFront (CDN)  
- **Backend:** AWS Lambda  
- **Banco de Dados:** Supabase  

---
