document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Redirecionar para a página de login se não estiver logado
        window.location.href = 'index.html';
        return;
    }

    const classGrid = document.getElementById('class-grid');
    const confirmButton = document.getElementById('confirm-class');
    let selectedClass = null;

    // Lista de turmas disponíveis
    const classes = [
        { id: 1, name: 'Turma A - Manhã' },
        { id: 2, name: 'Turma B - Manhã' },
        { id: 3, name: 'Turma C - Manhã' },
        { id: 4, name: 'Turma D - Tarde' },
        { id: 5, name: 'Turma E - Tarde' },
        { id: 6, name: 'Turma F - Tarde' },
        { id: 7, name: 'Turma G - Noite' },
        { id: 8, name: 'Turma H - Noite' }
    ];

    // Carregar turmas na grade
    function loadClasses() {
        classGrid.innerHTML = '';
        
        classes.forEach(classItem => {
            const classElement = document.createElement('div');
            classElement.className = 'selection-item';
            classElement.dataset.id = classItem.id;
            classElement.innerHTML = `<h3>${classItem.name}</h3>`;
            
            // Adicionar evento de clique para selecionar a turma
            classElement.addEventListener('click', () => {
                // Remover seleção anterior
                document.querySelectorAll('.selection-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Adicionar seleção atual
                classElement.classList.add('selected');
                selectedClass = classItem;
                
                // Habilitar botão de confirmação
                confirmButton.disabled = false;
            });
            
            classGrid.appendChild(classElement);
        });
    }

    // Carregar turmas do usuário salvas anteriormente
    function loadUserClasses() {
        const userClasses = JSON.parse(localStorage.getItem('userClasses') || '[]');
        
        // Se o usuário já tiver turmas salvas, pré-selecionar a primeira
        if (userClasses.length > 0) {
            const firstClass = userClasses[0];
            const classElement = document.querySelector(`.selection-item[data-id="${firstClass.id}"]`);
            
            if (classElement) {
                classElement.classList.add('selected');
                selectedClass = firstClass;
                confirmButton.disabled = false;
            }
        }
    }

    // Inicializar a página
    loadClasses();
    loadUserClasses();

    // Evento de clique no botão de confirmação
    confirmButton.addEventListener('click', () => {
        if (selectedClass) {
            // Salvar a turma selecionada
            localStorage.setItem('currentClass', JSON.stringify(selectedClass));
            
            // Redirecionar para a página de seleção de matéria
            window.location.href = 'select-subject.html';
        }
    });
});