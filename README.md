# 📅 Calendário Interativo 2026

Uma aplicação web completa de calendário com gerenciamento inteligente de compromissos, feriados nacionais e eventos recorrentes. Desenvolvido com foco em experiência do usuário, performance e design moderno.


## ✨ Demonstração

📱 **Totalmente responsivo** para desktop, tablet e mobile  
🎨 **Temas:** Claro e Escuro com troca automática  
⚡ **Performance:** Carregamento rápido, otimizado para offline

## 🚀 Funcionalidades Principais

### 📅 **Calendário Inteligente**
- ✅ Navegação intuitiva entre meses/anos
- ✅ Visualização mensal com destaque de dias
- ✅ Destaque automático para hoje e finais de semana
- ✅ Ícones das estações do ano (primavera, verão, outono, inverno)
- ✅ Busca rápida por mês e ano específico
- ✅ Consultor de datas (descubra em qual dia da semana cai qualquer data)

### 🎯 **Gerenciamento de Eventos**
- ✅ **4 categorias:** Pessoal, Trabalho, Saúde e Lazer
- ✅ **Sistema completo de recorrência:**
  - Diário, semanal, mensal e anual
  - Configuração de dias específicos para semanais
  - Opções de término: data específica, número de ocorrências ou nunca
- ✅ Edição e exclusão individual de ocorrências
- ✅ Exclusão completa de séries recorrentes
- ✅ Modal de confirmação para ações importantes

### 🏛️ **Feriados Nacionais**
- ✅ Integração com API pública de feriados
- ✅ 4 tipos de feriados:
  - **Nacionais** (vermelho) - Obrigatórios
  - **Facultativos** (laranja) - Consulte sua empresa
  - **Religiosos** (azul) - Feriados religiosos
  - **Locais** (roxo) - Estaduais/Municipais
- ✅ Fallback para feriados estáticos em caso de falha na API
- ✅ Próximo feriado destacado no painel informativo

### 🎨 **Interface & UX**
- ✅ **Temas claro/escuro** com persistência
- ✅ **Animações suaves** em todas as interações
- ✅ **Feedback visual** em tempo real
- ✅ **Tooltips informativos** em indicadores
- ✅ **Legenda completa** de cores e símbolos
- ✅ **Modal de dia** mostrando todos os eventos de uma data
- ✅ **Lista lateral** de compromissos do mês

### ⚙️ **Recursos Técnicos**
- ✅ **Persistência local** (localStorage)
- ✅ **Funciona offline** após primeiro carregamento
- ✅ **Seleção de fuso horário** brasileiro
- ✅ **Relógio em tempo real** com data atual
- ✅ **Progresso do ano** com barra visual
- ✅ **Estatísticas automáticas** (eventos, feriados)
- ✅ **Limpeza segura** de dados locais
- ✅ **Tratamento de erros** robusto

### 📱 **Responsividade Total**
- ✅ **Desktop:** Layout otimizado com painel lateral
- ✅ **Tablet:** Ajustes inteligentes de grid
- ✅ **Mobile:** Menu hamburguer para lista de eventos
- ✅ **Touch-friendly:** Botões e áreas de toque ampliadas
- ✅ **Otimização** para diferentes tamanhos de tela

## 🛠️ Tecnologias Utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![LocalStorage](https://img.shields.io/badge/Web_Storage-5A29E4?style=for-the-badge&logo=html5&logoColor=white)

**APIs e Bibliotecas:**
- 🌐 **[Nager.Date API](https://date.nager.at)** - Feriados nacionais
- 🎨 **[Font Awesome 6](https://fontawesome.com)** - Ícones
- 🔤 **[Google Fonts](https://fonts.google.com)** - Tipografia (Inter)
- 🎯 **[Pure JavaScript](https://developer.mozilla.org)** - Sem frameworks

## 📁 Estrutura do Projeto


**Arquitetura:**
- 🏗️ **Single Page Application** em um único arquivo HTML
- 🎨 **CSS interno** com variáveis para temas
- ⚡ **JavaScript modular** organizado em funções
- 💾 **Persistência** via localStorage API

