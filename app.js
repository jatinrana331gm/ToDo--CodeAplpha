let tasks = [];
let history = [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function saveHistory() {
  localStorage.setItem('history', JSON.stringify(history));
}
function loadData() {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  history = JSON.parse(localStorage.getItem('history')) || [];
  displayTasks('all');
  history.forEach(entry => addToDOMHistory(entry));
}

function logHistory(action, text) {
  const time = new Date().toLocaleTimeString();
  const entry = `[${time}] ${action}: "${text}"`;
  history.unshift(entry);
  saveHistory();
  addToDOMHistory(entry);
}
function addToDOMHistory(entry) {
  const historyList = document.getElementById('taskHistory');
  const li = document.createElement('li');
  li.textContent = entry;
  historyList.prepend(li);
}


function addTask() {
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('priority').value;
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false, priority });
  saveTasks();
  logHistory('Added', text);
  input.value = '';
  displayTasks(currentFilter);
}

function displayTasks(filter = 'all') {
  currentFilter = filter;
  const taskList = document.getElementById('taskList');
  const emptyMsg = document.getElementById('emptyMsg');
  taskList.innerHTML = '';

  let filtered = tasks;
  if (filter === 'active')      filtered = tasks.filter(t => !t.completed);
  else if (filter === 'completed') filtered = tasks.filter(t => t.completed);

  if (!filtered.length) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  filtered.forEach(task => {
    const idx = tasks.indexOf(task);
    const li = document.createElement('li');

    
    const span = document.createElement('span');
    span.textContent = `${task.text} (${task.priority})`;
    span.style.textDecoration = task.completed ? 'line-through' : 'none';
    span.onclick = () => toggleComplete(idx);
    span.ondblclick = () => editTask(idx);


    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.onclick = () => editTask(idx);

    
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = () => deleteTask(idx);

    li.append(span, editBtn, delBtn);
    taskList.appendChild(li);
  });
}


function toggleComplete(idx) {
  tasks[idx].completed = !tasks[idx].completed;
  saveTasks();
  logHistory(tasks[idx].completed ? 'Completed' : 'Reopened', tasks[idx].text);
  displayTasks(currentFilter);
}

function editTask(idx) {
  const oldText = tasks[idx].text;
  const newText = prompt('Edit your task:', oldText);
  if (newText && newText.trim()) {
    tasks[idx].text = newText.trim();
    saveTasks();
    logHistory('Edited', `${oldText} → ${newText.trim()}`);
    displayTasks(currentFilter);
  }
}

function deleteTask(idx) {
  const [removed] = tasks.splice(idx, 1);
  saveTasks();
  logHistory('Deleted', removed.text);
  displayTasks(currentFilter);
}

function clearHistory() {
  history = [];
  saveHistory();
  document.getElementById('taskHistory').innerHTML = '';
}


function filterTasks(type) {
  const list = document.getElementById('taskList');
  const hist = document.getElementById('taskHistory');
  const emptyMsg = document.getElementById('emptyMsg');

  if (type === 'history') {
    list.style.display = 'none';
    emptyMsg.style.display = 'none';
    hist.style.display = 'block';
  } else {
    hist.style.display = 'none';
    list.style.display = 'block';
    displayTasks(type);
  }
}


document.getElementById('taskInput')
  .addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });

window.onload = loadData;
