// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskActions);

// Functions

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const task = { id: Date.now(), text: taskText };
    displayTask(task);
    saveTask(task);
    taskInput.value = '';
}

function displayTask(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span contenteditable="true">${task.text}</span>
        <button data-id="${task.id}">Delete</button>
    `;
    taskList.appendChild(li);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function handleTaskActions(e) {
    if (e.target.tagName === 'BUTTON') {
        const taskId = e.target.getAttribute('data-id');
        deleteTask(taskId);
        e.target.parentElement.remove();
    } else if (e.target.tagName === 'SPAN') {
        e.target.addEventListener('blur', () => updateTask(e.target));
    }
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(span) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskId = span.nextElementSibling.getAttribute('data-id');
    const updatedText = span.textContent;

    tasks.forEach(task => {
        if (task.id == taskId) {
            task.text = updatedText;
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}
