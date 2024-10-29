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
filterButtons.forEach(btn => btn.addEventListener('click', filterTasks));

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;
    const dueDate = dueDateInput.value;

    if (!taskText) {
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

// Display a task in the list
function displayTask(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
        <div>
            <strong>${task.text}</strong> 
            <em>(${task.category} - ${task.dueDate || 'No due date'})</em>
        </div>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
    `;
    li.classList.toggle('completed', task.completed);
    taskList.appendChild(li);
}

// Save task to localStorage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Handle task actions (delete or toggle complete)
function handleTaskActions(e) {
    if (e.target.classList.contains('delete-btn')) {
        const taskId = e.target.getAttribute('data-id');
        deleteTask(taskId);
        e.target.closest('li').remove();
    } else if (e.target.type === 'checkbox') {
        const taskId = e.target.getAttribute('data-id');
        toggleTaskCompletion(taskId, e.target.checked);
    }
}

// Delete task from localStorage
function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle task completion status
function toggleTaskCompletion(id, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id == id);
    if (task) {
        task.completed = isCompleted;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        filterTasks({ target: { dataset: { filter: 'all' } } }); // Refresh list
    }
}

// Filter tasks by status
function filterTasks(e) {
    const filter = e.target.dataset.filter;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';

    tasks.forEach(task => {
        if (
            filter === 'all' ||
            (filter === 'completed' && task.completed) ||
            (filter === 'pending' && !task.completed)
        ) {
            displayTask(task);
        }
    });
}
