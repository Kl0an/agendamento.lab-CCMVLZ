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
    const schedulesList = document.getElementById('schedules-list');
    const emptySchedules = document.querySelector('.empty-schedules');
    const filterStatus = document.getElementById('filter-status');
    const filterDate = document.getElementById('filter-date');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const scheduleDetailsModal = document.getElementById('schedule-details-modal');
    const cancelConfirmModal = document.getElementById('cancel-confirm-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelScheduleBtn = document.getElementById('cancel-schedule');
    const confirmCancelBtn = document.getElementById('confirm-cancel');
    const cancelCancelBtn = document.getElementById('cancel-cancel');

    // Variáveis para armazenar dados
    let allSchedules = [];
    let filteredSchedules = [];
    let currentScheduleId = null;

    // Carregar agendamentos
    loadSchedules();

    // Adicionar eventos de filtro
    filterStatus.addEventListener('change', applyFilters);
    filterDate.addEventListener('change', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Eventos para modais
    closeModalBtn.addEventListener('click', () => {
        scheduleDetailsModal.style.display = 'none';
    });

    cancelScheduleBtn.addEventListener('click', () => {
        scheduleDetailsModal.style.display = 'none';
        cancelConfirmModal.style.display = 'block';
    });

    confirmCancelBtn.addEventListener('click', () => {
        cancelSchedule(currentScheduleId);
        cancelConfirmModal.style.display = 'none';
    });

    cancelCancelBtn.addEventListener('click', () => {
        cancelConfirmModal.style.display = 'none';
        scheduleDetailsModal.style.display = 'block';
    });

    // Fechar modais ao clicar fora deles
    window.addEventListener('click', (e) => {
        if (e.target === scheduleDetailsModal) {
            scheduleDetailsModal.style.display = 'none';
        }
        if (e.target === cancelConfirmModal) {
            cancelConfirmModal.style.display = 'none';
        }
    });

    // Função para carregar agendamentos
    function loadSchedules() {
        // Em uma aplicação real, você buscaria os agendamentos do servidor
        // Aqui, vamos simular com dados do localStorage
        const savedSchedules = JSON.parse(localStorage.getItem('schedules') || '[]');
        
        if (savedSchedules.length === 0) {
            // Criar alguns agendamentos de exemplo se não houver nenhum
            const exampleSchedules = generateExampleSchedules();
            localStorage.setItem('schedules', JSON.stringify(exampleSchedules));
            allSchedules = exampleSchedules;
        } else {
            allSchedules = savedSchedules;
        }
        
        // Aplicar filtros iniciais (mostrar todos)
        filteredSchedules = [...allSchedules];
        renderSchedules();
    }

    // Gerar agendamentos de exemplo
    function generateExampleSchedules() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        return [
            {
                id: 1,
                lab: 'Laboratório 1',
                date: formatDate(tomorrow),
                time: '07:30 - 08:20',
                class: '2º Ano - Turma A',
                subject: 'Programação Front-end',
                status: 'upcoming'
            },
            {
                id: 2,
                lab: 'Laboratório 3',
                date: formatDate(yesterday),
                time: '10:15 - 11:05',
                class: '3º Ano - Turma B',
                subject: 'Programação Mobile',
                status: 'past'
            },
            {
                id: 3,
                lab: 'Laboratório 2',
                date: formatDate(nextWeek),
                time: '08:20 - 09:10',
                class: '1º Ano - Turma C',
                subject: 'Lógica Computacional',
                status: 'upcoming'
            },
            {
                id: 4,
                lab: 'Laboratório 4',
                date: formatDate(today),
                time: '11:05 - 11:55',
                class: '3º Ano - Turma A',
                subject: 'Análise e Desenvolvimento de Sistemas',
                status: 'canceled'
            }
        ];
    }

    // Formatar data para exibição
    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Formatar data para comparação
    function formatDateForCompare(dateStr) {
        const parts = dateStr.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // Renderizar agendamentos
    function renderSchedules() {
        // Limpar lista
        schedulesList.innerHTML = '';
        
        if (filteredSchedules.length === 0) {
            emptySchedules.classList.remove('hidden');
            return;
        }
        
        emptySchedules.classList.add('hidden');
        
        // Ordenar agendamentos: próximos primeiro, depois passados
        filteredSchedules.sort((a, b) => {
            // Primeiro por status (upcoming > past > canceled)
            const statusOrder = { 'upcoming': 0, 'past': 1, 'canceled': 2 };
            if (statusOrder[a.status] !== statusOrder[b.status]) {
                return statusOrder[a.status] - statusOrder[b.status];
            }
            
            // Depois por data (mais recente primeiro para upcoming, mais antigo primeiro para past)
            const dateA = new Date(formatDateForCompare(a.date));
            const dateB = new Date(formatDateForCompare(b.date));
            
            if (a.status === 'upcoming') {
                return dateA - dateB; // Próximos: do mais próximo para o mais distante
            } else {
                return dateB - dateA; // Passados: do mais recente para o mais antigo
            }
        });
        
        // Adicionar cada agendamento à lista
        filteredSchedules.forEach(schedule => {
            const scheduleItem = document.createElement('div');
            scheduleItem.className = `schedule-item ${schedule.status}`;
            
            let statusText = '';
            let statusClass = '';
            
            switch (schedule.status) {
                case 'upcoming':
                    statusText = 'Próximo';
                    statusClass = 'status-upcoming';
                    break;
                case 'past':
                    statusText = 'Realizado';
                    statusClass = 'status-past';
                    break;
                case 'canceled':
                    statusText = 'Cancelado';
                    statusClass = 'status-canceled';
                    break;
            }
            
            scheduleItem.innerHTML = `
                <div class="schedule-info">
                    <div class="schedule-title">${schedule.lab}</div>
                    <div class="schedule-details">
                        <div class="schedule-detail">
                            <i class="far fa-calendar"></i>
                            <span>${schedule.date}</span>
                        </div>
                        <div class="schedule-detail">
                            <i class="far fa-clock"></i>
                            <span>${schedule.time}</span>
                        </div>
                        <div class="schedule-detail">
                            <i class="fas fa-users"></i>
                            <span>${schedule.class}</span>
                        </div>
                    </div>
                </div>
                <div class="schedule-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <div class="schedule-actions">
                        <button class="action-button view-button" data-id="${schedule.id}" title="Ver detalhes">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${schedule.status === 'upcoming' ? `
                            <button class="action-button cancel-button" data-id="${schedule.id}" title="Cancelar agendamento">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
            
            schedulesList.appendChild(scheduleItem);
        });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.view-button').forEach(btn => {
            btn.addEventListener('click', function() {
                const scheduleId = parseInt(this.dataset.id);
                showScheduleDetails(scheduleId);
            });
        });
        
        document.querySelectorAll('.cancel-button').forEach(btn => {
            btn.addEventListener('click', function() {
                const scheduleId = parseInt(this.dataset.id);
                currentScheduleId = scheduleId;
                showCancelConfirmation(scheduleId);
            });
        });
    }

    // Mostrar detalhes do agendamento
    function showScheduleDetails(scheduleId) {
        const schedule = allSchedules.find(s => s.id === scheduleId);
        if (!schedule) return;
        
        currentScheduleId = scheduleId;
        
        // Preencher detalhes no modal
        document.getElementById('detail-lab').textContent = schedule.lab;
        document.getElementById('detail-date').textContent = schedule.date;
        document.getElementById('detail-time').textContent = schedule.time;
        document.getElementById('detail-class').textContent = schedule.class;
        document.getElementById('detail-subject').textContent = schedule.subject;
        
        let statusText = '';
        switch (schedule.status) {
            case 'upcoming':
                statusText = 'Próximo';
                break;
            case 'past':
                statusText = 'Realizado';
                break;
            case 'canceled':
                statusText = 'Cancelado';
                break;
        }
        
        document.getElementById('detail-status').textContent = statusText;
        
        // Mostrar/esconder botão de cancelar
        const cancelBtn = document.getElementById('cancel-schedule');
        if (schedule.status === 'upcoming') {
            cancelBtn.style.display = 'block';
        } else {
            cancelBtn.style.display = 'none';
        }
        
        // Exibir modal
        scheduleDetailsModal.style.display = 'block';
    }

    // Mostrar confirmação de cancelamento
    function showCancelConfirmation(scheduleId) {
        currentScheduleId = scheduleId;
        cancelConfirmModal.style.display = 'block';
    }

    // Cancelar agendamento
    function cancelSchedule(scheduleId) {
        // Encontrar o agendamento
        const scheduleIndex = allSchedules.findIndex(s => s.id === scheduleId);
        if (scheduleIndex === -1) return;
        
        // Atualizar status para cancelado
        allSchedules[scheduleIndex].status = 'canceled';
        
        // Salvar no localStorage
        localStorage.setItem('schedules', JSON.stringify(allSchedules));
        
        // Atualizar lista filtrada
        filteredSchedules = applyFiltersToData();
        
        // Renderizar novamente
        renderSchedules();
        
        // Exibir mensagem de sucesso
        alert('Agendamento cancelado com sucesso!');
    }

    // Aplicar filtros
    function applyFilters() {
        filteredSchedules = applyFiltersToData();
        renderSchedules();
    }

    // Aplicar filtros aos dados
    function applyFiltersToData() {
        const statusFilter = filterStatus.value;
        const dateFilter = filterDate.value;
        
        return allSchedules.filter(schedule => {
            // Filtrar por status
            if (statusFilter !== 'all' && schedule.status !== statusFilter) {
                return false;
            }
            
            // Filtrar por data
            if (dateFilter) {
                const scheduleDateFormatted = formatDateForCompare(schedule.date);
                if (scheduleDateFormatted !== dateFilter) {
                    return false;
                }
            }
            
            return true;
        });
    }

    // Limpar filtros
    function clearFilters() {
        filterStatus.value = 'all';
        filterDate.value = '';
        applyFilters();
    }
});