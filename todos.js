const input = document.querySelector('input[name=tarefa]');
const registerButton = document.querySelector('#register_button');
const tasks = document.querySelector('#list');
const completedTasks = document.querySelector('#completed-list');
const card = document.querySelector('.card');
let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  tasks.innerHTML = '';
  completedTasks.innerHTML = '';
  for (let i = 0; i < allTasks.length; i++) {
    let taskItem = document.createElement('li');
    taskItem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center');

    let textItem = document.createTextNode(allTasks[i].text);
    taskItem.appendChild(textItem);

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
    deleteButton.innerHTML = '<i class="fas fa-times"></i>';
    deleteButton.onclick = function(event) {
      event.stopPropagation(); // prevent task item from being marked as completed
      deleteTask(i);
    };

    taskItem.appendChild(deleteButton);

    let checkButton = document.createElement('button');
    checkButton.classList.add('btn', 'btn-sm', 'btn-success', 'ml-2');
    checkButton.innerHTML = '<i class="fas fa-check"></i>';
    if (allTasks[i].completed) {
      taskItem.classList.add('completed');
      checkButton.setAttribute('checked', true);
    }
    checkButton.onclick = function(event) {
      event.stopPropagation(); // prevent task item from being marked as completed
      handleCheck(event);
    };
    checkButton.dataset.id = allTasks[i].id;

    taskItem.appendChild(checkButton);

    if (allTasks[i].completed) {
      completedTasks.appendChild(taskItem);
    } else {
      tasks.appendChild(taskItem);
    }

    taskItem.addEventListener('click', function() {
      taskItem.classList.toggle('completed');
      handleCheck(event);
      saveTasks();
    });
  }
}

function handleCheck(event) {
  const checked = event.target.getAttribute('checked') === null ? true : false;
  const id = event.target.dataset.id;
  allTasks = allTasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: checked };
    } else {
      return task;
    }
  });
  saveTasks();
  renderTasks();
}

input.addEventListener('keydown', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    addTask();
  }
});

function addTask() {
  const newTaskText = input.value.trim();

  if (newTaskText !== '') {
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
    };
    allTasks.push(newTask);
    renderTasks();
    input.value = '';
    removeWarnings();
    saveTasks();
  } else {
    removeWarnings();
    const span = document.createElement('span');
    span.classList.add('alert', 'alert-warning');
    span.textContent = 'You have to enter some task to be added to the list.';
    card.appendChild(span);
  }
}

function removeWarnings() {
  const warnings = document.querySelectorAll('span');

  warnings.forEach((warning) => {
    card.removeChild(warning);
  });
}

function deleteTask(index) {
  allTasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}

renderTasks();
