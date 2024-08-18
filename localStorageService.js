const getTodosFromStorage = () => {
  return JSON.parse(localStorage.getItem("todos")) || [];
};

const updateTodos = (todoList) => {
  localStorage.setItem("todos", JSON.stringify(todoList));
};

export { getTodosFromStorage, updateTodos };
