import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { AiOutlineSend } from "react-icons/ai";

const GroupChat = ({ userName }) => {
  const currentDate = new Date();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  console.log(userName);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  let previousMessages = () => {
    // Check if the socket is available before emitting the event
    if (socket) {
      // Emit the "previousMessages" event to request previous messages
      socket.emit("previousMessages", {});
    }
  };

  useEffect(() => {
    // Connect to the WebSocket server when the component mounts
    const newSocket = io(`http://localhost:5000`); // Replace with your WebSocket server URL
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

  // Function to generate a random integer between min and max (inclusive)
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // List of unique teacher names
  const teacherNames = [
    "Teacher 1",
    "Teacher 2",
    "Teacher 3",
    "Teacher 4",
    "Teacher 5",
    "Teacher 6",
    "Teacher 7",
    "Teacher 8",
    "Teacher 9",
    "Teacher 10",
    // Add more names as needed
  ];

  const generateUniqueTeacherName = () => {
    // Generate a random index to select a name from the teacherNames array
    const randomIndex = Math.floor(Math.random() * teacherNames.length);
    return teacherNames[randomIndex];
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      // Send the message to the WebSocket server with the username
      const message = { sender: username, message: newMessage }; // Use the same property names as the server expects
      socket.emit("message", message);
      setNewMessage("");
    }
    previousMessages();
  };
  let username = userName || generateUniqueTeacherName();

  return (
    <div
      id="groupchat"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
        marginTop: "400px",
        marginLeft: "50px",
        marginRight: "50px",
        padding: "20px",
        paddingBottom: "100px",
        marginBottom: "50px",
        margin: "10px",
        height: "auto",
        boxShadow: "0px 0px 20px black",
        backgroundColor: "#F5F5F5",
        minWidth: "90%",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>Group Chat</h2>
      <h3>
        <strong>Hi, {username}</strong>
      </h3>
      <div
        style={{
          width: "80vw",
          height: "70vh",
          borderRadius: "30px",
          border: "2px solid red",
          display: "flex",
          flexDirection: "column",
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
              display: "flex",
              flexDirection: "column",
              padding: "10px",
              borderRadius: "20px",
              marginLeft: "30px",
              marginBottom: "10px",

              minWidth: "200px",
              maxWidth: "300px",
              wordWrap: "break-word",

              alignSelf:
                message.userName === userName ? "flex-start" : "flex-start",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <strong
              style={{
                color: message.userName === userName ? "#fff" : "purple",
              }}
            >
              {message.sender}
            </strong>{" "}
            <div
              ref={messagesEndRef}
              style={{
                marginLeft: "10px",
                marginTop: "2px",
              }}
            >
              {message.message}
            </div>
            <div
              style={{
                fontSize: "12px",
                alignSelf: "end",
              }}
            >
              {message.timestamp
                ? message.timestamp.slice(0, 10) ===
                  currentDate.toISOString().slice(0, 10)
                  ? message.timestamp.slice(11, 16)
                  : message.timestamp.slice(0, 10)
                : "Now"}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "10px",

          flexDirection: "row",
          width: "90%",
        }}
      >
        <input
          style={{
            marginLeft: "60px",
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
            marginTop: "10px",
            borderRadius: "80px",
          }}
          onClick={handleSendMessage}
        >
          <AiOutlineSend size={26} color="red" />
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
