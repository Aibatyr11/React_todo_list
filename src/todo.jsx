import { useState } from "react";
import "./App.css";

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all"); // Фильтр задач

  const [todos, setTodos] = useState([
    { id: 1, title: "Сделать домашнее задание", description: "По математике", is_checked: false, is_edit: false },
    { id: 2, title: "Купить продукты", description: "Молоко, хлеб, сыр", is_checked: true, is_edit: false },
  ]);

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleEditChange(event, id, field) {
    const updatedTodos = todos.map((elem) =>
      elem.id === id ? { ...elem, [field]: event.target.value } : elem
    );
    setTodos(updatedTodos);
  }

  function onAddTodo() {
    if (!title.trim() || !description.trim()) return; // Проверка на пустые строки

    const newTodo = {
      id: Date.now(),
      title,
      description,
      is_checked: false,
      is_edit: false,
    };
    setTodos([...todos, newTodo]);
    setTitle("");
    setDescription("");
  }

  function onRemoveTodo(id) {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  }

  function onChangeStatus(id) {
    const updatedTodos = todos.map((elem) =>
      elem.id === id ? { ...elem, is_checked: !elem.is_checked } : elem
    );
    setTodos(updatedTodos);
  }

  function onEditTodo(id) {
    const updatedTodos = todos.map((elem) =>
      elem.id === id ? { ...elem, is_edit: !elem.is_edit } : elem
    );
    setTodos(updatedTodos);
  }

  function filteredTodos() {
    if (filter === "inProgress") return todos.filter((todo) => !todo.is_checked);
    if (filter === "completed") return todos.filter((todo) => todo.is_checked);
    return todos;
  }

  return (
    <div className="todoList_wrapper">
      <h1>React To-Do List</h1>

      <div className="add_todo_container">
        <input
          type="text"
          placeholder="Название задачи"
          onChange={handleTitleChange}
          value={title}
        />
        <input
          type="text"
          placeholder="Описание задачи"
          onChange={handleDescriptionChange}
          value={description}
        />
        <button onClick={onAddTodo}>Добавить задачу</button>
      </div>

      <div className="filter_container">
        <button onClick={() => setFilter("all")}>Все</button>
        <button onClick={() => setFilter("inProgress")}>В процессе</button>
        <button onClick={() => setFilter("completed")}>Выполнено</button>
      </div>

      <div className="todo_list_container">
        <ul>
          {filteredTodos().map((elem) => (
            <li key={elem.id}>
              <input
                type="checkbox"
                checked={elem.is_checked}
                onChange={() => onChangeStatus(elem.id)}
              />

              {!elem.is_edit ? (
                <>
                  <strong className={elem.is_checked ? "todo_done" : ""}>{elem.title}</strong>
                  <p className={elem.is_checked ? "todo_done" : ""}>{elem.description}</p>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={elem.title}
                    onChange={(event) => handleEditChange(event, elem.id, "title")}
                  />
                  <input
                    type="text"
                    value={elem.description}
                    onChange={(event) => handleEditChange(event, elem.id, "description")}
                  />
                </>
              )}

              {!elem.is_checked && (
                <button onClick={() => onEditTodo(elem.id)}>
                  {elem.is_edit ? "Сохранить" : "Редактировать"}
                </button>
              )}
              <button onClick={() => onRemoveTodo(elem.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
