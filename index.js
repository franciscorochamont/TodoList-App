
const inputTask = document.querySelector("#task-input");
const addTask = document.querySelector('#add__button');
const taskList = document.querySelector('#task__list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

function saveLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTasks(){
    tasks.forEach(task => {
        const completedClass = task.completed ? 'task__item completed' : 'task__item';
        taskList.insertAdjacentHTML('beforeend', `
            <div class="task__item-container" data-id="${task.id}">
                <span class="${completedClass}">${task.texto}</span>
                <button class="delete-button" id="delete-button">
                    <img 
                        src="./delete.svg"
                        alt="delete icon"
                    >
                </button>
            </div>`)
    });
    updateEmptyMessage();
}

//? Mostrar/ocultar mensaje de "no hay tareas"
function updateEmptyMessage(){
    const itemTaskContainer = document.querySelectorAll('.task__item-container');
    const existingMessage = document.querySelector('.menssage');
    if(itemTaskContainer.length < 1){
        if(!existingMessage){
            const messageContainer = document.createElement('p');
            messageContainer.textContent = 'No hay tareas agregadas';
            messageContainer.classList.add('menssage');
            messageContainer.style.color = 'white';
            messageContainer.style.padding = '5px';
            messageContainer.style.fontSize = '15px';
            taskList.insertAdjacentElement('afterend', messageContainer);
        }
    } else {
        if(existingMessage){
            existingMessage.remove();
        }
    }
}

//? Validar que el input no este vacio
function validateInput(e){

    const value = inputTask.value.trim()

    //?Quitar espcios en blanco 
    if(value === ''){
       const errorMessage = document.createElement('p');
       errorMessage.textContent = 'Ingresa una tarea, por favor...';
       errorMessage.classList.add('error-message');
       errorMessage.style.color = 'white';
       errorMessage.style.padding = '5px';
       errorMessage.style.fontSize = '15px';
       inputTask.insertAdjacentElement('afterend', errorMessage);
    } else {
        const errorMessage = document.querySelector('.error-message');
        if(errorMessage){
            errorMessage.remove();
        } 
    }
}

// Validacion del task-input
inputTask.addEventListener('blur', (e) => {
    validateInput();
})

addTask.addEventListener('click', (e) => {
    
    e.preventDefault()
    validateInput();
    
    //? Quitar espcios en blanco
    const valueTask = inputTask.value.trim();
    if(valueTask === '') return;

    const newTask = { id: Date.now(), texto: valueTask, completed: false }
    tasks.push(newTask);

    taskList.insertAdjacentHTML('beforeend', `
        <div class="task__item-container" data-id="${newTask.id}">
            <span class="task__item">${valueTask}</span>
            <button class="delete-button" id="delete-button">
                <img 
                    src="./delete.svg"
                    alt="delete icon"
                >
            </button>
        </div>`)
    inputTask.value = '';
    saveLocalStorage();
    updateEmptyMessage();
})

taskList.addEventListener('click', (e) => {
    const container = e.target.closest('.task__item-container');
    if(!container) return;

    if(e.target.closest('.delete-button')){
        const id = Number(container.dataset.id);
        tasks = tasks.filter(task => task.id !== id);
        container.remove();
    } else {
        const id = Number(container.dataset.id);
        const task = tasks.find(task => task.id === id);
        if(task){
            task.completed = !task.completed;
            const span = container.querySelector('.task__item');
            if(span) span.classList.toggle('completed');
        }
    }

    saveLocalStorage();
    updateEmptyMessage();
})

renderTasks();
