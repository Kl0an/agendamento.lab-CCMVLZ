document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Redirecionar para a página de login se não estiver logado
        window.location.href = 'index.html';
        return;
    }

    // Exibir nome do usuário
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('user-name').textContent = `Olá, ${userName}`;
    }

    // Elementos da página
    const chatList = document.getElementById('chat-list');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatInputContainer = document.getElementById('chat-input-container');
    const currentChatName = document.getElementById('current-chat-name');
    const currentChatStatus = document.getElementById('current-chat-status');
    const newChatBtn = document.querySelector('.new-chat-btn');
    const newChatModal = document.getElementById('new-chat-modal');
    const closeModal = document.querySelector('.close-modal');
    const teachersList = document.getElementById('teachers-list');
    const searchTeacher = document.getElementById('search-teacher');
    const searchChat = document.getElementById('search-chat');

    // Variáveis para armazenar dados
    let currentChat = null;
    let chats = JSON.parse(localStorage.getItem('chats') || '[]');
    let messages = JSON.parse(localStorage.getItem('messages') || '{}');

    // Lista de professores (simulação)
    const teachers = [
        { id: 1, name: 'Ana Silva', subject: 'Matemática', status: 'Online' },
        { id: 2, name: 'Carlos Oliveira', subject: 'Língua Portuguesa', status: 'Offline' },
        { id: 3, name: 'Mariana Santos', subject: 'Programação Front-end', status: 'Online' },
        { id: 4, name: 'Pedro Costa', subject: 'Lógica Computacional', status: 'Ausente' },
        { id: 5, name: 'Juliana Lima', subject: 'Programação Mobile', status: 'Online' },
        { id: 6, name: 'Roberto Alves', subject: 'Análise e Desenvolvimento de Sistemas', status: 'Offline' },
        { id: 7, name: 'Fernanda Martins', subject: 'Língua Inglesa', status: 'Online' },
        { id: 8, name: 'Lucas Pereira', subject: 'Programação Back-end', status: 'Ausente' }
    ];

    // Inicializar a página
    loadChats();

    // Carregar conversas
    function loadChats() {
        chatList.innerHTML = '';
        
        // Se não houver conversas, criar algumas de exemplo
        if (chats.length === 0) {
            // Criar algumas conversas de exemplo
            const exampleChats = [
                { id: 1, teacherId: 1, lastMessage: 'Olá, tudo bem?', timestamp: new Date().getTime() - 3600000 },
                { id: 2, teacherId: 3, lastMessage: 'Podemos conversar sobre o projeto?', timestamp: new Date().getTime() - 86400000 },
                { id: 3, teacherId: 5, lastMessage: 'Vou agendar o laboratório para amanhã.', timestamp: new Date().getTime() - 172800000 }
            ];
            
            chats = exampleChats;
            localStorage.setItem('chats', JSON.stringify(chats));
            
            // Criar algumas mensagens de exemplo
            const exampleMessages = {
                '1': [
                    { senderId: 1, text: 'Olá, tudo bem?', timestamp: new Date().getTime() - 3600000 - 300000 },
                    { senderId: 'me', text: 'Tudo ótimo! E com você?', timestamp: new Date().getTime() - 3600000 }
                ],
                '2': [
                    { senderId: 3, text: 'Bom dia! Você já viu o novo projeto?', timestamp: new Date().getTime() - 86400000 - 600000 },
                    { senderId: 'me', text: 'Ainda não, do que se trata?', timestamp: new Date().getTime() - 86400000 - 300000 },
                    { senderId: 3, text: 'Podemos conversar sobre o projeto?', timestamp: new Date().getTime() - 86400000 }
                ],
                '3': [
                    { senderId: 'me', text: 'Preciso agendar o laboratório para a aula de amanhã.', timestamp: new Date().getTime() - 172800000 - 900000 },
                    { senderId: 5, text: 'Qual horário você precisa?', timestamp: new Date().getTime() - 172800000 - 600000 },
                    { senderId: 'me', text: 'Das 10:15 às 11:05.', timestamp: new Date().getTime() - 172800000 - 300000 },
                    { senderId: 5, text: 'Vou agendar o laboratório para amanhã.', timestamp: new Date().getTime() - 172800000 }
                ]
            };
            
            messages = exampleMessages;
            localStorage.setItem('messages', JSON.stringify(messages));
        }
        
        // Ordenar conversas por timestamp (mais recentes primeiro)
        const sortedChats = [...chats].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedChats.forEach(chat => {
            const teacher = teachers.find(t => t.id === chat.teacherId);
            if (teacher) {
                const chatElement = createChatElement(chat, teacher);
                chatList.appendChild(chatElement);
            }
        });
    }

    // Criar elemento de conversa
    function createChatElement(chat, teacher) {
        const chatElement = document.createElement('div');
        chatElement.className = 'chat-item';
        chatElement.dataset.id = chat.id;
        
        // Formatar hora
        const chatTime = formatTime(chat.timestamp);
        
        chatElement.innerHTML = `
            <div class="chat-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="chat-info">
                <h4>${teacher.name}</h4>
                <p>${chat.lastMessage}</p>
            </div>
            <div class="chat-meta">
                <span class="chat-time">${chatTime}</span>
            </div>
        `;
        
        // Adicionar evento de clique para selecionar a conversa
        chatElement.addEventListener('click', () => {
            // Remover seleção anterior
            document.querySelectorAll('.chat-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Adicionar seleção atual
            chatElement.classList.add('active');
            
            // Definir conversa atual
            currentChat = { ...chat, teacher };
            
            // Exibir mensagens da conversa
            loadMessages(chat.id);
            
            // Atualizar informações do cabeçalho
            currentChatName.textContent = teacher.name;
            currentChatStatus.textContent = teacher.status;
            
            // Exibir campo de entrada de mensagem
            chatInputContainer.style.display = 'flex';
        });
        
        return chatElement;
    }

    // Carregar mensagens de uma conversa
    function loadMessages(chatId) {
        chatMessages.innerHTML = '';

        const chatMessageArray = messages[chatId] || [];

        if (chatMessageArray.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-chat-message';
            emptyMessage.innerHTML = `
                <i class="fas fa-comments"></i>
                <p>Nenhuma mensagem encontrada. Comece a conversar!</p>
            `;

            chatMessages.appendChild(emptyMessage);
            return;
        }

        chatMessageArray.forEach(message => {
            const messageElement = createMessageElement(message);
            chatMessages.appendChild(messageElement);
        });

        // Rolar para a última mensagem
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Criar elemento de mensagem
    function createMessageElement(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.senderId === 'me' ? 'message-sent' : 'message-received'}`;
        
        // Formatar hora
        const messageTime = formatTime(message.timestamp);
        
        messageElement.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-time">${messageTime}</div>
        `;
        
        return messageElement;
    }

    // Formatar timestamp para hora legível
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Hoje
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            // Ontem
            return 'Ontem';
        } else if (diffDays < 7) {
            // Esta semana
            const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
            return days[date.getDay()];
        } else {
            // Mais de uma semana
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }
    }

    // Enviar mensagem
    function sendMessage() {
        const text = chatInput.value.trim();
        
        if (text === '' || !currentChat) return;
        
        // Criar nova mensagem
        const newMessage = {
            senderId: 'me',
            text,
            timestamp: new Date().getTime()
        };
        
        // Adicionar mensagem à conversa
        if (!messages[currentChat.id]) {
            messages[currentChat.id] = [];
        }
        
        messages[currentChat.id].push(newMessage);
        
        // Atualizar última mensagem da conversa
        const chatIndex = chats.findIndex(c => c.id === currentChat.id);
        if (chatIndex !== -1) {
            chats[chatIndex].lastMessage = text;
            chats[chatIndex].timestamp = newMessage.timestamp;
        }
        
        // Salvar alterações
        localStorage.setItem('messages', JSON.stringify(messages));
        localStorage.setItem('chats', JSON.stringify(chats));
        
        // Limpar campo de entrada
        chatInput.value = '';
        
        // Recarregar mensagens e conversas
        loadMessages(currentChat.id);
        loadChats();
    }



    // Carregar lista de professores no modal
    function loadTeachers() {
        teachersList.innerHTML = '';
        
        teachers.forEach(teacher => {
            const teacherElement = document.createElement('div');
            teacherElement.className = 'teacher-item';
            teacherElement.innerHTML = `
                <div class="teacher-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="teacher-info">
                    <h4>${teacher.name}</h4>
                    <p>${teacher.subject}</p>
                </div>
            `;
            
            // Adicionar evento de clique para iniciar conversa
            teacherElement.addEventListener('click', () => {
                startNewChat(teacher);
            });
            
            teachersList.appendChild(teacherElement);
        });
    }

    // Iniciar nova conversa
    function startNewChat(teacher) {
        // Verificar se já existe uma conversa com este professor
        const existingChat = chats.find(c => c.teacherId === teacher.id);
        
        if (existingChat) {
            // Selecionar conversa existente
            const chatElement = document.querySelector(`.chat-item[data-id="${existingChat.id}"]`);
            if (chatElement) {
                chatElement.click();
            }
        } else {
            // Criar nova conversa
            const newChat = {
                id: Date.now(),
                teacherId: teacher.id,
                lastMessage: 'Iniciar conversa',
                timestamp: new Date().getTime()
            };
            
            chats.push(newChat);
            localStorage.setItem('chats', JSON.stringify(chats));
            
            // Recarregar conversas
            loadChats();
            
            // Selecionar nova conversa
            const chatElement = document.querySelector(`.chat-item[data-id="${newChat.id}"]`);
            if (chatElement) {
                chatElement.click();
            }
        }
        
        // Fechar modal
        newChatModal.style.display = 'none';
    }

    // Filtrar professores
    searchTeacher.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const teacherItems = teachersList.querySelectorAll('.teacher-item');
        
        teacherItems.forEach(item => {
            const teacherName = item.querySelector('h4').textContent.toLowerCase();
            const teacherSubject = item.querySelector('p').textContent.toLowerCase();
            
            if (teacherName.includes(searchTerm) || teacherSubject.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Filtrar conversas
    searchChat.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const chatItems = chatList.querySelectorAll('.chat-item');
        
        chatItems.forEach(item => {
            const chatName = item.querySelector('h4').textContent.toLowerCase();
            const chatMessage = item.querySelector('p').textContent.toLowerCase();
            
            if (chatName.includes(searchTerm) || chatMessage.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Evento de clique no botão de enviar mensagem
    sendMessageBtn.addEventListener('click', sendMessage);

    // Evento de tecla Enter no campo de entrada
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Evento de clique no botão de nova conversa
    newChatBtn.addEventListener('click', function() {
        loadTeachers();
        newChatModal.style.display = 'block';
    });

    // Fechar modal ao clicar no X
    closeModal.addEventListener('click', function() {
        newChatModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(e) {
        if (e.target === newChatModal) {
            newChatModal.style.display = 'none';
        }
    });
});