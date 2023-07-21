import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const GroupChat = ({ userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  console.log(userName);

  let previousMessages = () => {
    // Check if the socket is available before emitting the event
    if (socket) {
      // Emit the "previousMessages" event to request previous messages
      socket.emit("previousMessages", {});
    }
  };

  useEffect(() => {
    // Connect to the WebSocket server when the component mounts
    const newSocket = io("http://localhost:5000"); // Replace with your WebSocket server URL
    setSocket(newSocket);

    // Listener for incoming messages from the WebSocket server
    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listener for previous messages from the WebSocket server
    newSocket.on("previous_messages", (previousMessages) => {
      console.log(previousMessages);
      setMessages(previousMessages);
    });
    // Listener for previous messages from the WebSocket server
    newSocket.on("previousMessages", (previousMessages) => {
      console.log(previousMessages);
      setMessages(previousMessages);
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Check if the userName is set and the socket connection is established
    const userToConnect = userName || "Teacher"; // Set the default username to "Teacher" if userName is null or empty

    if (userToConnect && socket) {
      // Send the userName to the server upon connection
      socket.emit("login", userToConnect);

      previousMessages();
    }
  }, [userName, socket]);

  const handleSendMessage = () => {
    let username = userName || "Teacher";
    if (newMessage.trim() !== "") {
      // Send the message to the WebSocket server with the username
      const message = { sender: username, message: newMessage }; // Use the same property names as the server expects
      socket.emit("message", message);
      setNewMessage("");
    }
    previousMessages();
  };

  // Fetch previous messages from the server
  const fetchpreviousMessages = () => {
    fetch("http://localhost:5000/messages")
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div
      id="groupchat"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "50px",
        margin: "10px",
        height: "auto",
        minWidth: "90%",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>Group Chat</h2>
      <h3>
        <strong>Hi, {userName}</strong>
      </h3>
      <div
        style={{
          width: "80vw",
          height: "70vh",
          borderRadius: "30px",
          border: "2px solid red",
          display: "flex",
          flexDirection: "column-reverse",
          overflowY: "scroll",
          padding: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            style={{
              backgroundColor:
                message.sender === userName ? "#007bff" : "#f0f0f0",
              color: message.sender === userName ? "#fff" : "#000",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px",
              maxWidth: "70%",
              wordWrap: "break-word",
              alignSelf:
                message.userName === userName ? "flex-end" : "flex-start",
            }}
          >
            <strong
              style={{
                color: message.userName === userName ? "#fff" : "purple",
              }}
            >
              {message.sender}:
            </strong>{" "}
            {message.message}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row", width: "90%" }}>
        <input
          style={{
            marginLeft: "40px",
            width: "90%",
            padding: "10px",
            height: "20px",
            marginTop: "5px",
            borderRadius: "20px",
          }}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          style={{
            height: "40px",
            margin: "5px",
            borderRadius: "80px",
          }}
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
