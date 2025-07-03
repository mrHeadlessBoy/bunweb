// client/src/components/TodoList.tsx
import React, { useState, useEffect } from 'react';
import { todos } from '../api';
import toast from 'react-hot-toast'; // Import toast

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  onLogout: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ onLogout }) => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  // const [error, setError] = useState(''); // No longer needed for display directly

  const fetchTodos = async () => {
    try {
      const data = await todos.getAll();
      if (Array.isArray(data)) {
        setTodoList(data);
      } else if (data && typeof data === 'object' && 'message' in data) {
        toast.error((data as { message?: string }).message || 'Failed to fetch todos'); // Use toast
      } else {
        toast.error('Failed to fetch todos.'); // Use toast
      }
    } catch (err: any) {
      toast.error(err.message || 'Error fetching todos.'); // Use toast
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
      toast.error('Todo title cannot be empty.'); // Add toast for validation
      return;
    }
    try {
      const newTodo = await todos.create(newTodoTitle);
      if (newTodo.id) {
        setTodoList([...todoList, newTodo]);
        setNewTodoTitle('');
        toast.success('Todo added successfully!'); // Success toast
      } else {
        toast.error((newTodo as any).message || 'Failed to add todo.'); // Use toast
      }
    } catch (err: any) {
      toast.error(err.message || 'Error adding todo.'); // Use toast
      console.error(err);
    }
  };

  const handleToggleComplete = async (id: string, currentCompleted: boolean, title: string) => {
    try {
      const response = await todos.update(id, title, !currentCompleted);
      if (response.id) {
        setTodoList(
          todoList.map((todo) =>
            todo.id === id ? { ...todo, completed: !currentCompleted } : todo
          )
        );
        toast.success('Todo updated!'); // Success toast
      } else {
        toast.error((response as any).message || 'Failed to update todo.'); // Use toast
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating todo.'); // Use toast
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await todos.delete(id);
      if (response.success) {
        setTodoList(todoList.filter((todo) => todo.id !== id));
        toast.success('Todo deleted!'); // Success toast
      } else {
        toast.error('Failed to delete todo.'); // Use toast
      }
    } catch (err: any) {
      toast.error(err.message || 'Error deleting todo.'); // Use toast
      console.error(err);
    }
  };

  const handleLogoutClick = () => { // Renamed to avoid conflict with prop
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    onLogout();
    toast.success('Logged out successfully!'); // Logout toast
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My To-Do List</h1>
        <button
          onClick={handleLogoutClick} // Use the renamed handler
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>

      {/* {error && <p className="text-red-500 mb-4 text-center">{error}</p>} */}
      {/* The error message will now appear as a toast */}

      <form onSubmit={handleAddTodo} className="mb-4 flex">
        <input
          type="text"
          className="flex-grow shadow appearance-none border rounded-l py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Add a new todo"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
        >
          Add
        </button>
      </form>

      <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
        {todoList.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed, todo.title)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className={`ml-3 text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        ))}
        {todoList.length === 0 && <p className="p-4 text-center text-gray-500">No todos yet!</p>}
      </ul>
    </div>
  );
};

export default TodoList;