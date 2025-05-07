//TODOS DATA MANAGEMENT AND HANDLES BUSINESS OPERATIONS
//todosService Object with selfdefined methods e.g. findAl()...
export const todosService = {
  _state: {
    todos: [
      { id: '0', label: 'Make Todo API', done: true },
      { id: '1', label: 'Make functional Todo Frontend', done: true },
      { id: '2', label: 'Style Todo Frontend', done: false },
      { id: '3', label: 'Extend Todo app to create todos', done: false },
      { id: '4', label: 'Extend Toto app to update todos', done: false },
      { id: '5', label: 'Extend Todo app to delete todos', done: false },
      { id: '6', label: 'Separation of Concerns', done: false },
    ],
    idCounter: 6,
  },
  findAll: () => {
    return todosService._state.todos.map((todo) => ({ ...todo }));
  },
  findById: (id) => {
    const todo = todosService._state.todos.find((todo) => todo.id === id);
    return todo ? { ...todo } : undefined;
  },
  create: (todo) => {
    const newTodo = {
      ...todo,
      id: `${(todosService._state.idCounter += 1)}`,
    };
    todosService._state.todos.push(newTodo);

    return newTodo.id;
  },
  update: (todo, id) => {
    const wc = { ...todo, id };
    const index = todosService._state.todos.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }

    todosService._state.todos[index] = wc;

    return { ...todosService._state.todos[index] };
  },
  remove: (id) => {
    const index = todosService._state.todos.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }

    return todosService._state.todos.splice(index, 1)[0];
  },
};
