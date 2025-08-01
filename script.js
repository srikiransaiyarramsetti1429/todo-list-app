const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const filterPriority = document.getElementById('filter-priority');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const text = document.getElementById('task-input').value.trim();
  const priority = document.getElementById('priority').value;
  const dueDate = document.getElementById('due-date').value;

  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    priority,
    dueDate,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  form.reset();
});

function renderTasks() {
  const filter = filterPriority.value;
  taskList.innerHTML = '';

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(task => task.priority === filter);

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const details = document.createElement('div');
    details.className = `task-details ${task.completed ? 'completed' : ''}`;
    details.innerHTML = `
      <strong>${task.text}</strong><br>
      <span class="priority-${task.priority}">${task.priority}</span> | 
      <small>Due: ${task.dueDate || 'N/A'}</small>
    `;
    details.addEventListener('click', () => toggleComplete(task.id));

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const delBtn = document.createElement('button');
    delBtn.innerHTML = '🗑️';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(delBtn);

    li.appendChild(details);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function toggleComplete(id) {
  tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

filterPriority.addEventListener('change', renderTasks);

// Initial render
renderTasks();
