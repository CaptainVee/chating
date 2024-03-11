// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login logic (replace with your actual logic)
    setEmail('');
    setPassword('');
    setUsername('');

    const userData = {
        username,
        email,
        password,
      };
    dispatch(login(userData))
    .then((payload) => {
    console.log("loggin in", payload)
    navigate("/chat");
    })
    .catch((e) => {console.log(e)});
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="appearance-none rounded-w-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white shadow-sm w-full mb-4"
        />
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="appearance-none rounded-w-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white shadow-sm w-full mb-4"
        />
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="appearance-none rounded-w-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white shadow-sm w-full"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
          Login
        </button>
      </form>
      <Link to="/sign-up"> Sign Up</Link>
    </div>
  );
};

export default Login;
