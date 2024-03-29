import { ExpandLessSharp } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { BsArrowRightSquareFill } from "react-icons/bs";

const LoginForm = ({ handleLogin, loginState }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formtype, setFormtype] = useState("Teacher Login");
  const [islogin, setislogin] = useState(null);
  const [userError, setuserError] = useState(null);
  const [passError, setpassError] = useState(null);
  const [apptype, setApptype] = useState("users");

  console.log(islogin);

  useEffect(() => {
    setislogin(loginState);
  }, [loginState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password, apptype);
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

  function changeForm() {
    if (formtype == "Teacher Login") {
      setApptype("admins");
      setFormtype("Admin Login");
    } else {
      setApptype("users");

      setFormtype("Teacher Login");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.headingContainer}>
          <button onClick={changeForm}>
            <BsArrowLeftSquareFill size={35} />
          </button>
          <h2 style={styles.heading}>{formtype}</h2>
          <button onClick={changeForm}>
            <BsArrowRightSquareFill size={35} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputContainer}>
            <label style={styles.label} htmlFor="username">
              Username
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
              Password
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
          {passError && <p style={styles.errorColor}>{passError}</p>}
          <p hidden={islogin} style={styles.errorColor}>
            Please check your username or your password.
          </p>

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
  headingContainer: {
    textAlign: "center",
    color: "#6B128B",
    display: "flex",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    color: "#6B128B",
    fontSize: "2rem",
    marginLeft: 4,
    marginRight: 4,
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
  errorColor: {
    color: "red",
  },
  input: {
    width: "200px",
    border: "2px solid gray",
    height: "30px",
    margin: "4px auto",
    padding: "2px",
  },
  redBorder: {
    border: "1.5px solid red",
  },
  submitButton: {
    color: "white",
    marginTop: "20px",

    justifyItems: "center",
    height: "50px",
    width: "120px",
    backgroundColor: "#6B128B",
    paddingBottom: "2px",
    margin: "2px solid gray",
  },
};
