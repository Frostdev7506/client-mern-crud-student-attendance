import React, { useState, useEffect } from "react";
import ChangePasswordModal from "./components/ChangePasswordModal.js";
import { Modal, Button, Form } from "react-bootstrap";

const LoginForm = ({ handleLogin, loginState }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formtype, setFormtype] = useState("Teacher's Sign In");
  const [islogin, setislogin] = useState(null);
  const [userError, setuserError] = useState(null);
  const [passError, setpassError] = useState(null);

  console.log(islogin);

  useEffect(() => {
    setislogin(loginState);
  }, [loginState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  const checkUser = (userValue) => {};

  const checkPass = (passValue) => {
    if (passValue.length === 0) {
      return "";
    }
    if (passValue.length <= 7) {
      return "The password Length Should be more than 7 characters";
    }

    return null;
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>{formtype}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputContainer}>
            <label style={styles.label} htmlFor="username">
              Username:
            </label>
            <input
              style={{
                ...styles.input,
                ...(islogin ? {} : styles.redBorder),
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
          <div style={styles.inputContainer}>
            <label style={styles.label} htmlFor="password">
              Password:
            </label>
            <input
              style={{
                ...styles.input,
                ...(islogin ? {} : styles.redBorder),
              }}
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setpassError(checkPass(e.target.value));
                setislogin(loginState);
              }}
            />
          </div>
          {passError && <p style={{ color: "red" }}>{passError}</p>}
          <p hidden={islogin} style={{ color: "red" }}>
            Please check your username or your password.
          </p>
          <ChangePasswordModal />
          <button style={styles.submitButton} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

const styles = {
  container: {
    display: "flex",
    margin: "100px",
    flexDirection: "row",
    justifyContent: "center",
  },
  formContainer: {
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
  },
  heading: {
    textAlign: "center",
    color: "#6B128B",
    fontSize: "2rem",
    marginBottom: "100px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "5px",
    marginBottom: "5px",
    padding: "4px",
  },
  label: {
    padding: 2,
    fontSize: "1.5rem",
    color: "#6B128B",
  },
  input: {
    width: "200px",
    borderRadius: "15px",
    height: "30px",
    margin: "4px auto",
    padding: "2px",
  },
  redBorder: {
    border: "1.5px solid red",
  },
  submitButton: {
    color: "white",
    marginTop: "10px",
    borderRadius: "25px",
    justifyItems: "center",
    height: "50px",
    width: "100px",
    backgroundColor: "#6B128B",
    paddingBottom: "2px",
    margin: "2px solid black",
  },
};
