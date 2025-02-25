import React, { useState, useEffect, createContext, useContext } from "react";
import { Button, Input, Card, CardContent, CardHeader, Select, SelectItem } from "@/components/ui";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit } from "lucide-react";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title, description) => {
    setTasks([...tasks, { id: Date.now(), title, description, status: "in-progress" }]);
  };

  const editTask = (id, newTitle, newDescription) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, title: newTitle, description: newDescription } : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, status: task.status === "in-progress" ? "completed" : "in-progress" } : task)));
  };

  return (
    <TaskContext.Provider value={{ tasks, filter, setFilter, addTask, editTask, deleteTask, toggleStatus }}>
      {children}
    </TaskContext.Provider>
  );
};

const TaskList = () => {
  const { tasks, filter, editTask, deleteTask, toggleStatus } = useContext(TaskContext);
  const filteredTasks = tasks.filter(task => (filter === "all" ? true : task.status === filter));

  return (
    <div className="space-y-4">
      {filteredTasks.map(task => (
        <Card key={task.id} className="p-4 flex justify-between items-center">
          <CardContent>
            <h3 className="font-bold text-lg">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
          </CardContent>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => toggleStatus(task.id)}>
              {task.status === "in-progress" ? "Mark Completed" : "Mark In Progress"}
            </Button>
            <Button variant="outline" onClick={() => editTask(task.id, prompt("New Title"), prompt("New Description"))}>
              <Edit />
            </Button>
            <Button variant="destructive" onClick={() => deleteTask(task.id)}>
              <Trash2 />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

const TaskForm = () => {
  const { addTask } = useContext(TaskContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addTask(title, description);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Button type="submit">
        <Plus /> Add
      </Button>
    </form>
  );
};

const FilterTasks = () => {
  const { setFilter } = useContext(TaskContext);
  return (
    <Select onChange={(e) => setFilter(e.target.value)}>
      <SelectItem value="all">All</SelectItem>
      <SelectItem value="in-progress">In Progress</SelectItem>
      <SelectItem value="completed">Completed</SelectItem>
    </Select>
  );
};

const TodoApp = () => {
  return (
    <TaskProvider>
      <div className="max-w-lg mx-auto p-4">
        <Card>
          <CardHeader className="text-xl font-bold">To-Do List</CardHeader>
          <CardContent>
            <TaskForm />
            <FilterTasks />
            <TaskList />
          </CardContent>
        </Card>
      </div>
    </TaskProvider>
  );
};

export default TodoApp;