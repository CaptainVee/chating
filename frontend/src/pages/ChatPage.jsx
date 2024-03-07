import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../features/auth/authSlice";

function ChatPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  const inputRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.auth.users);
  const access_token = user?.access; // Optional chaining to handle potential undefined user

  const to_user_id = selectedUser?.id; // Optional chaining to handle potential undefined selectedUser

  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!to_user_id || !access_token || !socketRef.current) {
      return; // Prevent unnecessary fetches and errors
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      };

      const response = await fetch(`http://localhost:8000/messages/${to_user_id}/`, {
        method: "GET",
        headers,
      });

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

  useEffect(() => {
    if (!to_user_id || !access_token) {
      return; // Prevent unnecessary socket creation
    }

    const socket = new WebSocket(
      `ws://localhost:8000/chat/${to_user_id}/?access_token=${access_token}`
    );
    socketRef.current = socket; // Store reference in useRef

    socket.onopen = () => {
      socketRef.current.send(JSON.stringify({ type: "read_receipt" }));
      fetchData();

      console.log("Socket opened");
    };

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log("this are old messages", messageHistory)
      
      if (socketRef.current && receivedMessage.type === 'new_message') {
        socketRef.current.send(JSON.stringify({ type: "read_receipt" })); // Send read receipt only if connected

        
      }

      if (socketRef.current && receivedMessage.type === 'message_history') {
        const updatedMessages = receivedMessage.messages
        setMessageHistory(updatedMessages)
      }


    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError(error.message); // Set error state for UI display
    };

    return () => {
      socket.close();
    };
  }, [to_user_id, access_token]);

  const submitMessage = (e) => {
    e.preventDefault();
    if (message && socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "chat_message", message }));
      setMessage("");
    }
  };

  const chatUser = (user) => {
    setSelectedUser(user)
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <div className="flex h-screen">
      {/* user */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">{user?.user.username}</h1>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="cursor-pointer py-2 hover:bg-gray-700"
              onClick={() => chatUser(user)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      {/* chat */}
      <div className="flex-1 bg-gray-200 p-4">
        {selectedUser === null ? (
          <p>Welcome to Chat, select a user to chat with</p>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">{selectedUser.username}</h2>
            <div className="h-4/5 overflow-y-auto mb-4">
              {isLoading ? (
                <p>Loading messages...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <>
                  {messageHistory.map((message, index) => (
                    
                    <div
                      key={index}
                      className={
                        message.user === user.user.pk ? "text-right" : "text-left"
                      }
                    >
                      <span className="text-gray-600 text-sm">
                        {message.username}
                      </span>
                      <p className="bg-white rounded-lg p-2 inline-block max-w-2/3 break-words">
                        {message.message}
                        <br />
                        <small className="text-gray-500">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </small>
                        <br />
                        {message.read ? (<small>seen</small>) : ("")}
                        
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
            <form className="flex">
              <input
                type="text"
                ref={inputRef}
                autoFocus
                className="flex-1 border rounded p-2"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 ml-2"
                onClick={submitMessage}
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
export default ChatPage;