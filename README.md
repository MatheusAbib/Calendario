# Calendário — Almanaque Botânico

Um calendário interativo inspirado nos antigos almanaques e nas ilustrações botânicas históricas. O projeto combina uma identidade visual vintage com funcionalidades para organização de compromissos, consulta de datas e acompanhamento do calendário anual.

Desenvolvido com **React, JavaScript, CSS e Vite**, o almanaque apresenta os doze meses do ano em uma interface ilustrada, com navegação entre anos, registros personalizados e informações complementares sobre datas, feriados e condições meteorológicas.

> 🔗 **Acesse online:** (https://matheusabib.github.io/Calendario/)

---

## Funcionalidades

### Calendário anual

- Visualização dos doze meses em um único painel.
- Navegação entre diferentes anos.
- Botão para retornar ao ano atual.
- Identificação do dia atual.
- Destaque visual para datas especiais e compromissos.
- Seleção de dias para consultar e gerenciar registros.
- Ilustrações e elementos visuais inspirados nas estações do ano.

### Registro de compromissos

O calendário possui um sistema de registros acessível ao selecionar uma data.

- Criação de compromissos personalizados.
- Edição e exclusão de registros existentes.
- Organização por quatro categorias:
  - **Pessoal:** verde.
  - **Trabalho:** azul.
  - **Saúde:** terracota.
  - **Lazer:** lavanda.
- Identificação visual das categorias por cores.
- Visualização dos compromissos associados a cada data.
- Persistência dos registros no armazenamento local do navegador.

### Compromissos recorrentes

Além dos registros individuais, o calendário permite organizar compromissos que se repetem ao longo do tempo.

- Recorrências diárias, semanais, mensais e anuais.
- Configuração de padrões de repetição.
- Gerenciamento de compromissos recorrentes.
- Armazenamento local das informações.

### Feriados e datas especiais

- Identificação de feriados e datas comemorativas.
- Destaques visuais no calendário.
- Legenda para interpretação dos indicadores.
- Consulta de informações relacionadas às datas.

### Consultor de datas

Uma ferramenta complementar para consultar datas sem precisar navegar manualmente pelo calendário.

- Seleção de uma data específica.
- Identificação do dia da semana correspondente.
- Consulta de datas em diferentes anos.

### Informações meteorológicas

Integração com a **Open-Meteo API** para apresentar informações meteorológicas no almanaque.

- Consulta de informações do tempo.
- Exibição integrada à interface do calendário.
- Atualização das informações a partir de uma fonte externa.

### Relógio analógico

- Relógio integrado ao cabeçalho.
- Representação analógica das horas.
- Atualização em tempo real.
- Visual adaptado à identidade vintage do projeto.

---

## Identidade visual

O Calendário — Almanaque Botânico foi desenvolvido com uma proposta visual inspirada em publicações antigas de história natural, herbários ilustrados e calendários tradicionais.

Em vez de uma interface convencional de produtividade, o projeto utiliza elementos gráficos que remetem a um almanaque impresso.

### Principais características

- **Estética botânica vintage:** inspiração em gravuras científicas e ilustrações de plantas.
- **Textura de papel envelhecido:** cores e detalhes que remetem a publicações antigas.
- **Ornamentos em SVG:** ilustrações vetoriais independentes distribuídas pelas laterais.
- **Variedade botânica:** samambaias, flores, lavanda, margaridas, ramos e plantas silvestres.
- **Composição orgânica:** diferentes tamanhos, rotações e posições para evitar repetições excessivas.
- **Molduras ornamentais:** elementos decorativos que reforçam a aparência de um almanaque.
- **Cores naturais:** tons de pergaminho, verde, terracota, azul e lavanda.
- **Layout responsivo:** adaptação da interface e dos ornamentos a diferentes tamanhos de tela.

As ilustrações são construídas como elementos independentes, permitindo ajustar sua distribuição sem depender de uma imagem única de fundo.

---

## Tecnologias utilizadas

![React](https://img.shields.io/badge/React-149ECA?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Recursos e integrações

| Tecnologia | Utilização |
|---|---|
| React | Construção da interface e gerenciamento de estados |
| Vite | Ambiente de desenvolvimento e compilação |
| JavaScript | Lógica do calendário, datas e compromissos |
| CSS | Estilização, responsividade e elementos ornamentais |
| SVG | Ilustrações botânicas e elementos gráficos |
| localStorage | Persistência dos compromissos no navegador |
| Open-Meteo API | Consulta de informações meteorológicas |

---

### Organização da aplicação

**Componentes:** responsáveis pelas diferentes partes da interface, incluindo calendário, navegação, relógio, informações meteorológicas, registros e ornamentos.

**Utilitários:** concentram funções relacionadas à manipulação de datas, compromissos e datas especiais.

**Estilização:** utiliza CSS para organizar o layout, adaptar a interface a diferentes resoluções e construir a identidade visual do almanaque.

**Persistência:** os compromissos são armazenados localmente no navegador, sem necessidade de cadastro.

---

## Armazenamento dos dados

Os compromissos e registros do usuário são armazenados por meio da API `localStorage`.

Isso significa que:

- Não é necessário criar uma conta para registrar compromissos.
- Os registros permanecem disponíveis ao recarregar a página no mesmo navegador.
- Os dados não são sincronizados automaticamente entre dispositivos.
- A limpeza dos dados do navegador pode excluir os compromissos armazenados.

As informações meteorológicas dependem de uma conexão com a API externa.

---

## Responsividade

O calendário foi desenvolvido para se adaptar a diferentes resoluções.

- **Desktop:** visualização ampla dos meses e maior presença das ilustrações botânicas.
- **Tablet:** reorganização do conteúdo conforme a largura disponível.
- **Mobile:** adaptação dos elementos, controles e ornamentos para telas menores.

A camada botânica utiliza ilustrações independentes, permitindo controlar tamanhos, posições e visibilidade de acordo com o dispositivo.