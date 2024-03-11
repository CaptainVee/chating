
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { register } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { isLoading } = useSelector((state) => state.auth);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Simulate login logic (replace with your actual logic)
      setEmail('');
      setPassword1('');
      setPassword2('');
      setUsername('');
  
      const userData = {
          username,
          email,
          password1,
          password2,
        };
      dispatch(register(userData))
      .then((payload) => {
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
          <label htmlFor="password1" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password1"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="appearance-none rounded-w-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white shadow-sm w-full"
          />
          <label htmlFor="password2" className="block text-gray-700 text-sm font-bold mb-2">
            Password again
          </label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="appearance-none rounded-w-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white shadow-sm w-full"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
            Register
          </button>
        </form>
      </div>
    );
  };

export default Register