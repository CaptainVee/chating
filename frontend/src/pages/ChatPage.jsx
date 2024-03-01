import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from "react-redux"; // Remove if not using Redux
// import { getMessages } from '../features/chats/chatSlice'; // Remove if not using Redux

function ChatPage() {
  const location = useLocation();
  // 'cow-room_9coa'
  const room_name = location.state; //
  console.log("jkjdfd", room_name)
  const socket = new WebSocket(`ws://localhost:8000/chat/${room_name}/`);
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(messageHistory)
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/room/${room_name}`);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      setMessageHistory(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadReceipt = (messageId) => {
    socket.send(JSON.stringify({ type: "read_receipt", messageId }));
    // Update local state for immediate UI feedback
    setMessageStatuses((prevState) => ({
      ...prevState,
      [messageId]: "read",
    }));
  };
    

  useEffect(() => {
    socket.onopen = () => {
      fetchData();
      data.forEach((messageObj) => {
        if (messageObj.read === false) {
          handleReadReceipt(messageObj.id);
        }
      })
      console.log("Socket opened");
    };

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessageHistory((prevMessage) => [
        ...prevMessage,
        { message: receivedMessage.message }
      ]);
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };


    return () => {
      socket.close();
    };
  }, []);

  const submitMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.send(JSON.stringify({ message }));
      setMessage('');
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="grid grid-cols-1 my-4 xl:grid-cols-2 xl:gap-4">
        <div>
          {isLoading ? (
            <p>Loading messages...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="chat-content">
              {Array.isArray(messageHistory) ? (
                messageHistory.map((item) => (
                  <React.Fragment key={item.id}>
                    <div>

                    <p>{item.message}</p> read <p>{item.id}</p>
                    <br />
                    <br />
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <p>No recent transactions available.</p>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center h-screen">
          <form onSubmit={submitMessage} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
            <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
            <label htmlFor="text" className="block text-gray-700 text-sm font-bold mb-2">
              Message
            </label>
            <input
              type="text"
              id="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="appearance-none rounded-w-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white shadow-sm w-full mb-4"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
