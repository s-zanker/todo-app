const todoListElement = document.getElementById('todoList');
/** @type {HTMLFormElement} */
const newTodoForm = document.getElementById('newTodoForm');

function TodoItem(todo) {
  const liElement = document.createElement('li');
  const labelElement = document.createElement('label');
  const deleteButtonElement = document.createElement('button');
  const deleteImgElement = document.createElement('img');
  const checkboxElement = document.createElement('input');

  checkboxElement.type = 'checkbox';
  if (todo.done) {
    checkboxElement.checked = todo.done;
    liElement.className = 'done';
  }

  deleteImgElement.src = './xmark.svg';
  deleteButtonElement.append(deleteImgElement);

  labelElement.append(checkboxElement, todo.label);
  liElement.append(labelElement, deleteButtonElement);

  checkboxElement.onchange = async (e) => {
    await updateTodo({ ...todo, done: checkboxElement.checked });
    updateTodos();
  };

  deleteButtonElement.onclick = async (e) => {
    await deleteTodo(todo.id);
    updateTodos();
  };

  return liElement;
}

function getTodos() {
  return fetch('/api/v1/todos').then((res) => res.json());
}

function createTodo(todo) {
  return fetch('/api/v1/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      done: false,
      ...todo,
    }),
  }).then((res) => res.json());
}

function updateTodo(todo) {
  return fetch(`/api/v1/todos/${todo.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  }).then((res) => res.json());
}

function deleteTodo(id) {
  return fetch(`/api/v1/todos/${id}`, {
    method: 'DELETE',
  });
}

async function updateTodos() {
  const todos = await getTodos();

  todoListElement.innerHTML = '';
  todoListElement.append(...todos.map((item) => TodoItem(item)));
}

newTodoForm.onsubmit = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  const formData = new FormData(newTodoForm);
  const todo = Object.fromEntries(formData);
  await createTodo(todo);

  updateTodos();
};

updateTodos();
