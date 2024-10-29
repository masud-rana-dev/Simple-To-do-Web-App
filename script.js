// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const categorySelect = document.getElementById('category-select');
const dueDateInput = document.getElementById('due-date');
const filterButtons = document.querySelectorAll('.filter-btn');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskActions);
filterButtons.forEach(btn =>
    btn.addEventListener('click', filterTasks)
);

// Functions

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

function addTask() {
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        category,
        dueDate,
        completed: false
    };

    displayTask(task);
    saveTask(task);
    taskInput.value = '';
}

function displayTask(task) {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    li.innerHTML = `
        <div>
            <strong>${task.text}</strong> 
            <em>(${task.category} - ${task.dueDate || 'No due date'})</em>
        </div>
        <div>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        </div>
    `;
    taskList.appendChild(li);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function handleTaskActions(e) {
    if (e.target.classList.contains('delete-btn')) {
        const taskId = e.target.getAttribute('data-id');
        deleteTask(taskId);
        e.target.closest('li').remove();
    }
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks(e) {
    const filter = e.target.dataset.filter;
    const tasks = taskList.querySelectorAll('li');
    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        if (filter === 'all' ||
            (filter === 'completed' && isCompleted) ||
            (filter === 'pending' && !isCompleted)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}
