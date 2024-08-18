/**
 * @author: FIN-FS18-Sanuja Ariyapperuma
 * @description: This is a simple todo list application build with HTML, CSS and JavaScript. The data source is local storage based.
 * @version: 2.1.0
 * @date: 2021-09-26
 *
 */

import { getTodosFromStorage, updateTodos } from "./localStorageService.js";

const renderInTable = (filteredList) => {
  const todos = filteredList || getTodosFromStorage();
  const table = document.querySelector("#table-todo-list");

  table.innerHTML = "";

  const fragment = document.createDocumentFragment();

  todos.forEach((todo) => {
    const { Id, IsCompleted, Description } = todo;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td width="10%">
        <input type='checkbox' ${
          IsCompleted ? "checked" : ""
        } class="chkTodo" data-id='${Id}' />
      </td>
      <td>
        <span>${Description}</span>
      </td>
      <td width="10%">
        <div class="btn-area">
          <button class='btnEdit' data-id='${Id}'>Edit</button>
          <button class='btnDelete' data-id='${Id}'>Delete</button>
        </div>
      </td>
    `;

    fragment.appendChild(row);
  });

  table.appendChild(fragment);
};

const updateTodoCount = () => {
  let todoList = getTodosFromStorage();
  const count = todoList.filter((todo) => !todo.IsCompleted).length;
  document.querySelector("#todo-count").innerText = count ?? 0;
};
const clearNewTodo = () => {
  document.querySelector("#new-todo").value = "";
  document.querySelector("#todo-id").value = "";
};

const editTodoItem = (id, description) => {
  let todoList = getTodosFromStorage();
  const savedTodo = todoList.find((todo) => todo.Id === id);
  savedTodo.Description = description;
  updateTodos(todoList);
  document.querySelector("#add-todo").innerText = "Add";
};

const getUniquieId = () => {
  let uniqId = Math.floor(Math.random() * 1000);

  let todoList = getTodosFromStorage();

  const isExist = todoList.some((todo) => todo.Id === uniqId);

  if (isExist) {
    return getUniquieId();
  }

  return uniqId;
};

const addTodoItem = (description) => {
  let todoList = getTodosFromStorage();

  let isTodoExist = todoList.some((todo) => todo.Description === description);

  if (isTodoExist) {
    alert("Todo already exists");
    return;
  }

  const todoObj = {
    Id: getUniquieId(),
    Description: description,
    IsCompleted: false,
  };

  todoList.push(todoObj);

  updateTodos(todoList);
  updateTodoCount();
};

const handleEdit = (event) => {
  const id = Number(event.target.getAttribute("data-id"));

  const todoList = getTodosFromStorage();

  const todo = todoList.find((todo) => todo.Id === id);

  document.querySelector("#new-todo").value = todo.Description;
  document.querySelector("#todo-id").value = todo.Id;
  document.querySelector("#add-todo").innerText = "Update";
};

const handleDelete = (event) => {
  const id = Number(event.target.getAttribute("data-id"));
  let todoList = getTodosFromStorage();
  todoList = todoList.filter((todo) => todo.Id !== id);

  updateTodos(todoList);
  renderInTable();
  updateTodoCount();
};

const checkTodoItem = (event) => {
  const id = Number(event.target.getAttribute("data-id"));
  const todoList = getTodosFromStorage();
  const todo = todoList.find((todo) => todo.Id === id);
  todo.IsCompleted = !todo.IsCompleted;
  updateTodos(todoList);
  updateTodoCount();
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const todoItem = document.querySelector("#new-todo").value.trim();
  const todoId = Number(document.querySelector("#todo-id").value.trim());

  if (todoItem === "") {
    alert("Please enter a todo item");
    return;
  }

  if (todoId) {
    editTodoItem(todoId, todoItem);
  } else {
    addTodoItem(todoItem);
  }

  clearNewTodo();
  renderInTable();
};

const filterTodo = (event) => {
  const filter = event.target.value.toLowerCase().trim();
  let todoList = getTodosFromStorage();
  const filteredList = todoList.filter((todo) =>
    todo.Description.toLowerCase().includes(filter)
  );

  renderInTable(filteredList);
};

document
  .querySelector("#todo-form")
  .addEventListener("submit", handleFormSubmit);
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btnEdit")) {
    handleEdit(event);
  }
  if (event.target.classList.contains("btnDelete")) {
    handleDelete(event);
  }
  if (event.target.classList.contains("chkTodo")) {
    checkTodoItem(event);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateTodoCount();
  renderInTable();
});
document.querySelector("#search").addEventListener("input", filterTodo);
