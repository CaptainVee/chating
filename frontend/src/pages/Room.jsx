import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { createRoom } from '../features/chats/chatSlice';
import { useSelector, useDispatch } from "react-redux";
function Room() {

    const [room, setRoom] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate login logic (replace with your actual logic)    
        dispatch(createRoom(room))
        .then((payload) => {
        console.log("loggin in", payload)
        navigate("/chat", { state: room });
        })
        .catch((e) => {console.log(e)});
      };
    
  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
      <label htmlFor="room" className="block text-gray-700 text-sm font-bold mb-2">
        Room
      </label>
      <input
        type="text"
        id="room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="appearance-none rounded-w-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white shadow-sm w-full mb-4"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
        Login
      </button>
    </form>
  </div>
  )
}

export default Room