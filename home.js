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

    // Carregar agendamentos recentes
    loadRecentSchedules();

    // Função para carregar agendamentos recentes
    function loadRecentSchedules() {
        const schedulesListElement = document.getElementById('recent-schedules-list');
        const savedSchedules = JSON.parse(localStorage.getItem('schedules') || '[]');
        
        // Verificar se existem agendamentos
        if (savedSchedules.length === 0) {
            return; // Manter a mensagem de "Nenhum agendamento recente encontrado"
        }

        // Limpar a lista
        schedulesListElement.innerHTML = '';
        
        // Obter os laboratórios e horários (em uma aplicação real, isso viria do banco de dados)
        const labs = [
            { id: 1, name: 'Laboratório 1' },
            { id: 2, name: 'Laboratório 2' },
            { id: 3, name: 'Laboratório 3' },
            { id: 4, name: 'Laboratório 4' },
            { id: 5, name: 'Laboratório 5' }
        ];
        
        const timeSlots = [
            { id: 1, start: '07:30', end: '08:20' },
            { id: 2, start: '08:20', end: '09:10' },
            { id: 3, start: '09:10', end: '10:00' },
            { id: 4, start: '10:15', end: '11:05' },
            { id: 5, start: '11:05', end: '11:55' },
            { id: 6, start: '11:55', end: '12:40' }
        ];
        
        // Ordenar agendamentos por data (mais recentes primeiro)
        const sortedSchedules = [...savedSchedules].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Exibir apenas os 4 agendamentos mais recentes
        const recentSchedules = sortedSchedules.slice(0, 4);
        
        recentSchedules.forEach(schedule => {
            const lab = labs.find(l => l.id === schedule.labId);
            const timeSlot = timeSlots.find(t => t.id === schedule.timeSlotId);
            
            if (lab && timeSlot) {
                const scheduleItem = document.createElement('div');
                scheduleItem.className = 'schedule-item';
                
                // Obter informações da turma e matéria
                let className = 'Turma não especificada';
                let subjectName = 'Matéria não especificada';
                
                // Em uma aplicação real, você buscaria essas informações do banco de dados
                // Aqui estamos simulando com os dados do localStorage
                const currentClass = JSON.parse(localStorage.getItem('currentClass'));
                const currentSubject = JSON.parse(localStorage.getItem('currentSubject'));
                
                if (currentClass && currentClass.id === schedule.classId) {
                    className = currentClass.name;
                }
                
                if (currentSubject && currentSubject.id === schedule.subjectId) {
                    subjectName = currentSubject.name;
                }
                
                scheduleItem.innerHTML = `
                    <h4>${lab.name}</h4>
                    <p class="schedule-date">${schedule.date} | ${timeSlot.start} - ${timeSlot.end}</p>
                    <p><strong>Turma:</strong> ${className}</p>
                    <p><strong>Matéria:</strong> ${subjectName}</p>
                `;
                
                schedulesListElement.appendChild(scheduleItem);
            }
        });
    }
});