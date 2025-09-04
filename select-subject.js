document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Redirecionar para a página de login se não estiver logado
        window.location.href = 'index.html';
        return;
    }

    // Verificar se uma turma foi selecionada
    const currentClass = JSON.parse(localStorage.getItem('currentClass'));
    if (!currentClass) {
        // Redirecionar para a página de seleção de turma se nenhuma turma foi selecionada
        window.location.href = 'select-class.html';
        return;
    }

    const subjectGrid = document.getElementById('subject-grid');
    const viewLabsButton = document.getElementById('view-labs');
    const backButton = document.getElementById('back-button');
    let selectedSubject = null;

    // Lista de matérias disponíveis
    const subjects = [
        { id: 1, name: 'Língua Inglesa' },
        { id: 2, name: 'Programação Mobile' },
        { id: 3, name: 'Análise e Desenvolvimento de Sistemas' },
        { id: 4, name: 'Programação Front-end' },
        { id: 5, name: 'Programação Back-end' },
        { id: 6, name: 'Programação no Desenvolvimento de Sistemas' },
        { id: 7, name: 'Lógica Computacional' },
        { id: 8, name: 'Língua Portuguesa' },
        { id: 9, name: 'Matemática' }
    ];

    // Carregar matérias na grade
    function loadSubjects() {
        subjectGrid.innerHTML = '';
        
        subjects.forEach(subject => {
            const subjectElement = document.createElement('div');
            subjectElement.className = 'selection-item';
            subjectElement.dataset.id = subject.id;
            subjectElement.innerHTML = `<h3>${subject.name}</h3>`;
            
            // Adicionar evento de clique para selecionar a matéria
            subjectElement.addEventListener('click', () => {
                // Remover seleção anterior
                document.querySelectorAll('.selection-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Adicionar seleção atual
                subjectElement.classList.add('selected');
                selectedSubject = subject;
                
                // Habilitar botão de confirmação
                viewLabsButton.disabled = false;
            });
            
            subjectGrid.appendChild(subjectElement);
        });
    }

    // Inicializar a página
    loadSubjects();

    // Evento de clique no botão de voltar
    backButton.addEventListener('click', () => {
        window.location.href = 'select-class.html';
    });

    // Evento de clique no botão de ver salas disponíveis
    viewLabsButton.addEventListener('click', () => {
        if (selectedSubject) {
            // Salvar a matéria selecionada
            localStorage.setItem('currentSubject', JSON.stringify(selectedSubject));
            
            // Redirecionar para a página de agendamento
            window.location.href = 'schedule.html';
        }
    });
});