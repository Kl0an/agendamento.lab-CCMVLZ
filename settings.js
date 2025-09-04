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
    const settingsTabs = document.querySelectorAll('.settings-sidebar li');
    const tabContents = document.querySelectorAll('.settings-tab');
    const profileForm = document.getElementById('profile-form');
    const passwordForm = document.getElementById('password-form');
    const logoutBtn = document.getElementById('logout-btn');
    const addClassBtn = document.getElementById('add-class-btn');
    const classesList = document.getElementById('classes-list');
    const saveNotificationsBtn = document.getElementById('save-notifications');

    // Carregar dados do perfil
    loadProfileData();

    // Carregar turmas
    loadClasses();

    // Alternar entre abas
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover classe ativa de todas as abas
            settingsTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Adicionar classe ativa à aba clicada
            tab.classList.add('active');
            
            // Exibir conteúdo correspondente
            const tabId = tab.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Carregar dados do perfil
    function loadProfileData() {
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileSubject = document.getElementById('profile-subject');
        const profileBio = document.getElementById('profile-bio');
        
        // Carregar dados do localStorage (simulação)
        profileName.value = localStorage.getItem('userName') || '';
        profileEmail.value = localStorage.getItem('userEmail') || '';
        profileSubject.value = localStorage.getItem('userSubject') || '';
        profileBio.value = localStorage.getItem('userBio') || '';
    }

    // Carregar turmas
    function loadClasses() {
        classesList.innerHTML = '';
        
        // Carregar turmas do localStorage (simulação)
        const userClasses = JSON.parse(localStorage.getItem('userClasses') || '[]');
        
        if (userClasses.length === 0) {
            classesList.innerHTML = '<p class="empty-message">Nenhuma turma adicionada.</p>';
            return;
        }
        
        userClasses.forEach(classItem => {
            const classElement = document.createElement('div');
            classElement.className = 'class-item';
            classElement.innerHTML = `
                <div class="class-info">
                    <h4>${classItem.name}</h4>
                    <p>${getPeriodName(classItem.period)}</p>
                </div>
                <div class="class-actions">
                    <button class="remove-class-btn" data-id="${classItem.id}">Remover</button>
                </div>
            `;
            
            classesList.appendChild(classElement);
        });
        
        // Adicionar evento de clique aos botões de remover
        document.querySelectorAll('.remove-class-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const classId = parseInt(this.dataset.id);
                removeClass(classId);
            });
        });
    }

    // Obter nome do período
    function getPeriodName(period) {
        const periods = {
            'morning': 'Manhã',
            'afternoon': 'Tarde',
            'evening': 'Noite'
        };
        
        return periods[period] || 'Período não especificado';
    }

    // Remover turma
    function removeClass(classId) {
        // Carregar turmas do localStorage
        let userClasses = JSON.parse(localStorage.getItem('userClasses') || '[]');
        
        // Filtrar a turma a ser removida
        userClasses = userClasses.filter(classItem => classItem.id !== classId);
        
        // Salvar turmas atualizadas
        localStorage.setItem('userClasses', JSON.stringify(userClasses));
        
        // Recarregar lista de turmas
        loadClasses();
        
        // Exibir mensagem de sucesso
        alert('Turma removida com sucesso!');
    }

    // Adicionar turma
    function addClass() {
        const newClassName = document.getElementById('new-class-name').value.trim();
        const newClassPeriod = document.getElementById('new-class-period').value;
        
        if (newClassName === '' || newClassPeriod === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Carregar turmas do localStorage
        let userClasses = JSON.parse(localStorage.getItem('userClasses') || '[]');
        
        // Criar nova turma
        const newClass = {
            id: Date.now(),
            name: newClassName,
            period: newClassPeriod
        };
        
        // Adicionar nova turma
        userClasses.push(newClass);
        
        // Salvar turmas atualizadas
        localStorage.setItem('userClasses', JSON.stringify(userClasses));
        
        // Limpar campos
        document.getElementById('new-class-name').value = '';
        document.getElementById('new-class-period').value = '';
        
        // Recarregar lista de turmas
        loadClasses();
        
        // Exibir mensagem de sucesso
        alert('Turma adicionada com sucesso!');
    }

    // Salvar dados do perfil
    function saveProfile(e) {
        e.preventDefault();
        
        const profileName = document.getElementById('profile-name').value.trim();
        const profileSubject = document.getElementById('profile-subject').value;
        const profileBio = document.getElementById('profile-bio').value.trim();
        
        if (profileName === '') {
            alert('Por favor, preencha seu nome.');
            return;
        }
        
        // Salvar dados no localStorage
        localStorage.setItem('userName', profileName);
        localStorage.setItem('userSubject', profileSubject);
        localStorage.setItem('userBio', profileBio);
        
        // Atualizar nome exibido
        document.getElementById('user-name').textContent = `Olá, ${profileName}`;
        
        // Exibir mensagem de sucesso
        alert('Perfil atualizado com sucesso!');
    }

    // Alterar senha
    function changePassword(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        
        // Em uma aplicação real, você verificaria a senha atual e atualizaria no banco de dados
        // Aqui, apenas simulamos o sucesso
        
        // Limpar campos
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        // Exibir mensagem de sucesso
        alert('Senha alterada com sucesso!');
    }

    // Salvar preferências de notificação
    function saveNotifications() {
        const emailNotifications = document.getElementById('email-notifications').checked;
        const scheduleNotifications = document.getElementById('schedule-notifications').checked;
        const chatNotifications = document.getElementById('chat-notifications').checked;
        const reminderNotifications = document.getElementById('reminder-notifications').checked;
        
        // Salvar preferências no localStorage
        const notifications = {
            email: emailNotifications,
            schedule: scheduleNotifications,
            chat: chatNotifications,
            reminder: reminderNotifications
        };
        
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        // Exibir mensagem de sucesso
        alert('Preferências de notificação salvas com sucesso!');
    }

    // Carregar preferências de notificação
    function loadNotifications() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
        
        if (Object.keys(notifications).length > 0) {
            document.getElementById('email-notifications').checked = notifications.email !== false;
            document.getElementById('schedule-notifications').checked = notifications.schedule !== false;
            document.getElementById('chat-notifications').checked = notifications.chat !== false;
            document.getElementById('reminder-notifications').checked = notifications.reminder !== false;
        }
    }

    // Sair da conta
    function logout() {
        // Limpar dados de sessão
        localStorage.removeItem('isLoggedIn');
        
        // Redirecionar para a página de login
        window.location.href = 'index.html';
    }

    // Inicializar a página
    loadNotifications();

    // Eventos
    profileForm.addEventListener('submit', saveProfile);
    passwordForm.addEventListener('submit', changePassword);
    logoutBtn.addEventListener('click', logout);
    addClassBtn.addEventListener('click', addClass);
    saveNotificationsBtn.addEventListener('click', saveNotifications);
});