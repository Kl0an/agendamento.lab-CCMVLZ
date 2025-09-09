document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Redirecionar para a página de login se não estiver logado
        window.location.href = 'index.html';
        return;
    }

    // Verificar se uma turma e matéria foram selecionadas
    const currentClass = JSON.parse(localStorage.getItem('currentClass'));
    const currentSubject = JSON.parse(localStorage.getItem('currentSubject'));
    if (!currentClass || !currentSubject) {
        // Redirecionar para a página apropriada se faltarem informações
        if (!currentClass) {
            window.location.href = 'select-class.html';
        } else {
            window.location.href = 'select-subject.html';
        }
        return;
    }

    // Elementos da página
    const labsGrid = document.getElementById('labs-grid');
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    const scheduleButton = document.getElementById('schedule-button');
    const backButton = document.getElementById('back-button');
    const scheduleSummary = document.getElementById('schedule-summary');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModal = document.querySelector('.close-modal');
    const goToHomeButton = document.getElementById('go-to-home');

    // Exibir informações da turma e matéria selecionadas
    document.querySelector('#class-info span').textContent = currentClass.name;
    document.querySelector('#subject-info span').textContent = currentSubject.name;

    // Variáveis para armazenar a seleção atual
    let selectedLab = null;
    let selectedTimeSlot = null;
    let selectedDate = new Date();
    const formattedDate = selectedDate.toLocaleDateString('pt-BR');

    // Lista de laboratórios disponíveis
    const labs = [
        { id: 1, name: 'Laboratório 1', capacity: 30 },
        { id: 2, name: 'Laboratório 2', capacity: 25 },
        { id: 3, name: 'Laboratório 3', capacity: 30 },
        { id: 4, name: 'Laboratório 4', capacity: 20 },
        { id: 5, name: 'Laboratório 5', capacity: 35 }
    ];

    // Lista de horários disponíveis
    const timeSlots = [
        { id: 1, start: '07:30', end: '08:20' },
        { id: 2, start: '08:20', end: '09:10' },
        { id: 3, start: '09:10', end: '10:00' },
        { id: 4, start: '10:15', end: '11:05' },
        { id: 5, start: '11:05', end: '11:55' },
        { id: 6, start: '11:55', end: '12:40' }
    ];

    // Simular agendamentos existentes (em uma aplicação real, isso viria do banco de dados)
    const existingSchedules = [
        { labId: 1, date: formattedDate, timeSlotId: 1, professor: 'Prof. Ana Silva' },
        { labId: 2, date: formattedDate, timeSlotId: 3, professor: 'Prof. Carlos Oliveira' },
        { labId: 3, date: formattedDate, timeSlotId: 5, professor: 'Prof. Mariana Santos' }
    ];

    // Carregar laboratórios na grade
    function loadLabs() {
        labsGrid.innerHTML = '';
        
        labs.forEach(lab => {
            const labElement = document.createElement('div');
            labElement.className = 'selection-item';
            labElement.dataset.id = lab.id;
            labElement.innerHTML = `
                <h3>${lab.name}</h3>
                <p>Capacidade: ${lab.capacity} alunos</p>
            `;
            
            // Adicionar evento de clique para selecionar o laboratório
            labElement.addEventListener('click', () => {
                // Remover seleção anterior
                document.querySelectorAll('.labs-selection .selection-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Adicionar seleção atual
                labElement.classList.add('selected');
                selectedLab = lab;
                
                // Atualizar horários disponíveis para este laboratório
                updateTimeSlots();
                
                // Atualizar resumo
                updateSummary();
            });
            
            labsGrid.appendChild(labElement);
        });
    }

    // Atualizar horários disponíveis com base no laboratório selecionado
    function updateTimeSlots() {
        if (!selectedLab) return;
        
        timeSlotsGrid.innerHTML = '';
        
        timeSlots.forEach(timeSlot => {
            const timeSlotElement = document.createElement('div');
            timeSlotElement.className = 'time-slot';
            timeSlotElement.dataset.id = timeSlot.id;
            timeSlotElement.innerHTML = `${timeSlot.start} - ${timeSlot.end}`;
            
            // Clear previous event listeners by cloning the node
            const newTimeSlotElement = timeSlotElement.cloneNode(true);
            
            // Verificar se o horário está disponível
            const scheduleForSlot = existingSchedules.find(schedule => 
                schedule.labId === selectedLab.id && 
                schedule.date === formattedDate && 
                schedule.timeSlotId === timeSlot.id
            );
            
            if (scheduleForSlot) {
                newTimeSlotElement.classList.add('unavailable');
                newTimeSlotElement.title = `Horário indisponível - ${scheduleForSlot.professor}`;
                
                // Show professor info on hover
                newTimeSlotElement.addEventListener('mouseenter', () => {
                    const professorInfo = document.getElementById('professor-info');
                    professorInfo.textContent = `Professor ocupando: ${scheduleForSlot.professor}`;
                });
                newTimeSlotElement.addEventListener('mouseleave', () => {
                    const professorInfo = document.getElementById('professor-info');
                    professorInfo.textContent = '';
                });
                
                // Show professor info on click
                newTimeSlotElement.addEventListener('click', () => {
                    const professorInfo = document.getElementById('professor-info');
                    professorInfo.textContent = `Professor ocupando: ${scheduleForSlot.professor}`;
                });
            } else {
                // Adicionar evento de clique para selecionar o horário
                newTimeSlotElement.addEventListener('click', () => {
                    // Remover seleção anterior
                    document.querySelectorAll('.time-slot').forEach(item => {
                        item.classList.remove('selected');
                    });
                    
                    // Adicionar seleção atual
                    newTimeSlotElement.classList.add('selected');
                    selectedTimeSlot = timeSlot;
                    
                    // Habilitar botão de agendamento
                    scheduleButton.disabled = false;
                    
                    // Atualizar resumo
                    updateSummary();
                    
                    // Clear professor info display
                    const professorInfo = document.getElementById('professor-info');
                    professorInfo.textContent = '';
                });
            }
            
            timeSlotsGrid.appendChild(newTimeSlotElement);
        });
    }

    // Atualizar resumo do agendamento
    function updateSummary() {
        if (selectedLab) {
            document.getElementById('summary-lab').textContent = selectedLab.name;
            document.getElementById('summary-date').textContent = formattedDate;
            document.getElementById('summary-class').textContent = currentClass.name;
            document.getElementById('summary-subject').textContent = currentSubject.name;
            
            if (selectedTimeSlot) {
                document.getElementById('summary-time').textContent = `${selectedTimeSlot.start} - ${selectedTimeSlot.end}`;
            } else {
                document.getElementById('summary-time').textContent = '-';
            }
            
            scheduleSummary.style.display = 'block';
        }
    }

    // Preencher detalhes de confirmação no modal
    function fillConfirmationDetails() {
        document.getElementById('confirm-lab').textContent = selectedLab.name;
        document.getElementById('confirm-date').textContent = formattedDate;
        document.getElementById('confirm-time').textContent = `${selectedTimeSlot.start} - ${selectedTimeSlot.end}`;
        document.getElementById('confirm-class').textContent = currentClass.name;
        document.getElementById('confirm-subject').textContent = currentSubject.name;
    }

    // Inicializar a página
    loadLabs();

    // Evento de clique no botão de voltar
    backButton.addEventListener('click', () => {
        window.location.href = 'select-subject.html';
    });

    // Evento de clique no botão de agendar
    scheduleButton.addEventListener('click', () => {
        if (selectedLab && selectedTimeSlot) {
            // Em uma aplicação real, aqui você enviaria os dados para o servidor
            // Simular o salvamento do agendamento
            const newSchedule = {
                labId: selectedLab.id,
                date: formattedDate,
                timeSlotId: selectedTimeSlot.id,
                classId: currentClass.id,
                subjectId: currentSubject.id,
                userId: localStorage.getItem('userEmail')
            };
            
            // Adicionar à lista de agendamentos (simulação)
            existingSchedules.push(newSchedule);
            
            // Salvar no localStorage (simulação de banco de dados)
            const savedSchedules = JSON.parse(localStorage.getItem('schedules') || '[]');
            savedSchedules.push(newSchedule);
            localStorage.setItem('schedules', JSON.stringify(savedSchedules));
            
            // Preencher detalhes no modal
            fillConfirmationDetails();
            
            // Exibir modal de confirmação
            confirmationModal.style.display = 'block';
        }
    });

    // Fechar modal ao clicar no X
    closeModal.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });

    // Ir para a página inicial
    goToHomeButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    });
});