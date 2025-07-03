// client/src/App.tsx
import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import TodoList from './components/TodoList';
import './index.css';
import { Toaster } from 'react-hot-toast'; // Import Toaster

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Added for completeness, usually done in TodoList
    localStorage.removeItem('userId'); // Added for completeness, usually done in TodoList
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen">
      {/* Add the Toaster component here */}
      <Toaster
        position="top-center" // You can change this position (top-left, bottom-right, etc.)
        reverseOrder={false} // New toasts appear below existing ones
      />

      {isAuthenticated ? (
        <TodoList onLogout={handleLogout} />
      ) : (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;