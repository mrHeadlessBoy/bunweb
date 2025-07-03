// client/src/components/AuthForm.tsx
import React, { useState } from 'react';
import { auth } from '../api';
import toast from 'react-hot-toast'; // Import toast

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState(''); // No longer needed for display directly in component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(''); // No longer needed
    try {
      let response;
      if (isLogin) {
        response = await auth.login(username, password);
      } else {
        response = await auth.signup(username, email, password);
      }

      console.log('Auth API Response:', response);

      // CRITICAL CORRECTION AGAIN: This line is still incorrect.
      // Your backend returns `response.userId` directly, not `response.userId.id`.
      // Based on our previous logs: Object { message: "Login successful", token: "...", userId: 2 }
      // So, `response.userId` is `2`, not an object with an `id` property.
      if (response && response.token && typeof response.userId !== 'undefined') { // Keep this condition correct
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId.toString()); // Convert number to string for localStorage
        onAuthSuccess();
        toast.success((response as any).message || (isLogin ? 'Logged in successfully!' : 'Signed up successfully!'));
      } else {
        const errorMessage = typeof response === 'object' && response !== null && 'message' in response
            ? (response as any).message
            : (isLogin ? 'Login failed.' : 'Signup failed.');
        toast.error(errorMessage); // Use toast for errors
      }
    } catch (err: any) { // Type 'err' as any or unknown
      console.error("Authentication error:", err);
      toast.error(err.message || 'An unexpected error occurred during authentication.'); // Display error from catch block
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {/* {error && <p className="text-red-500 mb-4 text-center">{error}</p>} */}
        {/* The error message will now appear as a toast, so this line can be removed */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;