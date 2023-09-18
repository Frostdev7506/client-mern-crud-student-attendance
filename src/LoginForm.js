import React, { useState } from "react";
import { useEffect } from "react";

const LoginForm = ({ handleLogin, loginState }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formtype, setFormtype] = useState("Teacher's Sign In");
  const [islogin, setislogin] = useState(null);
  console.log(islogin);

  useEffect(() => {
    setislogin(loginState);
  }, [loginState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div
      style={{
        display: "flex",
        margin: "100px",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          borderRadius: "10px",
          marginTop: "200px",

          height: "50vh",
          width: "40vw",
          boxShadow: "0px 0px 10px black",
          margin: "50px",
          padding: "30px",
          backgroundColor: "#F5F5F5",
          marginLeft: "50px",
          marginRight: "50px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: "100px",
          }}
        >
          {formtype}
        </h2>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "5px",
              marginBottom: "5px",
              padding: "4px",
            }}
          >
            <label style={{ fontSize: "1.5rem" }} htmlFor="username">
              Username:
            </label>
            <input
              style={{
                width: "200px",
                borderRadius: "15px",
                height: "30px",
                border: `1.5px solid ${islogin ? "black" : "red"}`,
                margin: "4px auto",
                padding: "2px",
              }}
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setislogin(loginState);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",

              flexDirection: "column",
              marginTop: "5px",
              marginBottom: "5px",
              padding: "4px",
            }}
          >
            <label style={{ fontSize: "1.5rem" }} htmlFor="password">
              Password:
            </label>
            <input
              style={{
                width: "200px",
                borderRadius: "15px",
                border: `1.5px solid ${islogin ? "black" : "red"}`,
                height: "30px",
                margin: "4px auto",
                padding: "2px",
              }}
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setislogin(loginState);
              }}
            />
          </div>
          <p hidden={islogin} style={{ color: "red" }}>
            Please check your username or your password.
          </p>
          <button
            style={{
              color: "white",
              marginTop: "10px",
              borderRadius: "25px",
              justifyItems: "center",
              height: "50px",
              width: "100px",
              backgroundColor: "#6B128B",
              paddingBottom: "2px",
              margin: "2px solid black",
            }}
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
