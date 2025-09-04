# Sistema de Agendamento de Laboratórios de Informática

O sistema web desenvolvido para facilitar o agendamento de laboratórios de informática por professores e equipe pedagógica. O sistema permite que os usuários agendem salas de acordo com horários específicos, turmas e matérias, além de oferecer funcionalidades de comunicação entre professores e gerenciamento de configurações pessoais.

## Funcionalidades Principais

-   **Login e Registro**: Sistema de autenticação para professores e equipe pedagógica.
-   **Seleção de Turma e Matéria**: Fluxo intuitivo para seleção de turma e matéria antes do agendamento.
-   **Agendamento de Laboratórios**: Interface para visualizar e agendar laboratórios em horários específicos.
-   **Gerenciamento de Agendamentos**: Visualização, filtragem e cancelamento de agendamentos realizados.
-   **Chat com Professores**: Sistema de mensagens para comunicação entre professores e equipe pedagógica.
-   **Configurações de Usuário**: Gerenciamento de perfil, turmas e preferências de notificação.

## Estrutura do Projeto

### Páginas

-   **index.html**: Página de login e registro.
-   **home.html**: Página inicial com acesso rápido às principais funcionalidades.
-   **select-class.html**: Seleção de turma.
-   **select-subject.html**: Seleção de matéria.
-   **schedule.html**: Agendamento de laboratórios.
-   **my-schedules.html**: Visualização e gerenciamento de agendamentos.
-   **chat.html**: Sistema de mensagens.
-   **settings.html**: Configurações de usuário.

### Estilos (CSS)

-   **style.css**: Estilos globais e página de login.
-   **dashboard.css**: Estilos para o layout do dashboard e páginas de seleção.
-   **home.css**: Estilos para a página inicial.
-   **schedule.css**: Estilos para a página de agendamento.
-   **my-schedules.css**: Estilos para a página de gerenciamento de agendamentos.
-   **chat.css**: Estilos para o sistema de chat.
-   **settings.css**: Estilos para a página de configurações.

### Scripts (JavaScript)

-   **login.js**: Funcionalidades de login e registro.
-   **select-class.js**: Gerenciamento da seleção de turmas.
-   **select-subject.js**: Gerenciamento da seleção de matérias.
-   **schedule.js**: Funcionalidades de agendamento de laboratórios.
-   **home.js**: Gerenciamento da página inicial.
-   **my-schedules.js**: Gerenciamento de agendamentos.
-   **chat.js**: Funcionalidades do sistema de mensagens.
-   **settings.js**: Gerenciamento de configurações de usuário.

## Horários Disponíveis

O sistema permite agendamento nos seguintes horários:

-   07:30 até 08:20
-   08:20 até 09:10
-   09:10 até 10:00
-   10:15 até 11:05
-   11:05 até 11:55
-   11:55 até 12:40

## Matérias Disponíveis

O sistema inclui as seguintes matérias:

-   Língua Inglesa
-   Programação Mobile
-   Análise e Desenvolvimento de Sistemas
-   Programação Front-end
-   Programação Back-end
-   Programação no Desenvolvimento de Sistemas
-   Lógica Computacional
-   Língua Portuguesa
-   Matemática

## Tecnologias Utilizadas

-   HTML5
-   CSS3
-   JavaScript (ES6+)
-   LocalStorage para persistência de dados (simulação)
-   Font Awesome para ícones

## Como Usar

1.  Abra o arquivo `index.html` em um navegador web moderno.
2.  Faça login ou registre-se como novo usuário.
3.  Na página inicial, você terá acesso a todas as funcionalidades do sistema.
4.  Para agendar um laboratório, clique em "Agendar" e siga o fluxo de seleção de turma e matéria.
5.  Utilize o chat para se comunicar com outros professores.
6.  Gerencie suas configurações pessoais na página de configurações.

## Observações

-   Este projeto utiliza LocalStorage para simular a persistência de dados. Em um ambiente de produção, seria necessário implementar um backend com banco de dados.
-   O sistema é totalmente responsivo e foi projetado para funcionar em dispositivos móveis e desktops.
-   Todas as funcionalidades são simuladas no frontend para demonstração.

## Próximos Passos

-   **Backend e Banco de Dados**: Implementação de um backend (ex: com PHP, Node.js) e um banco de dados (ex: MySQL, PostgreSQL) para persistência real dos dados de usuários, agendamentos e mensagens.
-   **Melhorias no Chat**:
    -   Implementar um sistema de WebSockets (ex: com Socket.IO) para permitir um chat multiusuário em tempo real.
    -   Realizar testes de usabilidade para garantir que a rolagem de mensagens e a barra de digitação fixa estão funcionando corretamente.
-   **Sistema de Notificações**: Desenvolver notificações em tempo real para avisar sobre novos agendamentos ou mensagens.
-   **Calendário Visual**: Criar uma interface de calendário para uma visualização mais intuitiva dos agendamentos.
-   **Relatórios**: Gerar relatórios sobre o uso dos laboratórios para a equipe pedagógica.
