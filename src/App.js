import React, { useState, useEffect, useCallback } from "react";
import CreateAttendanceForm from "./CreateAttendanceForm";
import AttendanceList from "./AttendanceList";
import UpdateAttendanceForm from "./UpdateAttendanceForm";
import LoginForm from "./LoginForm";
import GroupChat from "./GroupChat";
import Navbar from "./Navbar";
import AttendanceReport from "./AttendanceReport";
import Footer from "./Footer";
import Appcss from "./styles/App.css";
import MainContent from "./components/MainContent";
import { DateTime } from "luxon";
import jwt_decode from "jwt-decode";

const App = () => {
  const [attendance, setAttendance] = useState([]);
  const [updateAttendanceId, setUpdateAttendanceId] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState("");
  const [loginState, setloginState] = useState(true);

  useEffect(() => {
    // Check if a token exists in local storage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);

      // Decode the JWT token to get user information (username)
      const decodedToken = jwt_decode(storedToken);
      // Set the username in state
      setUserName((previousUserName) => {
        return decodedToken.username || previousUserName;
      });
    }

    // Retrieve the username from localStorage
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // handle user login
  const handleLogin = (username, password) => {
    // Perform login request to the server
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check if login was successful
        if (data.token) {
          // Set the token to state and local storage
          setToken(data.token);
          localStorage.setItem("token", data.token);
          // Decode the JWT token to get user information (username)
          const decodedToken = jwt_decode(data.token);
          const dToken = jwt_decode(data.token);
          console.log("---------------", decodedToken.username);

          const { username } = decodedToken;
          // Set the username in state
          setUserName((previousUserName) => {
            return decodedToken.username || previousUserName;
          });

          // Store the username in localStorage
          localStorage.setItem("userName", userName || "");
          console.log("++++++++++++", userName);
        }
        if (data.error === "Invalid credentials") {
          // Handle invalid credentials or other login errors
          setloginState(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleLogout = () => {
    // Clear the token from state and local storage
    setToken(null);
    localStorage.removeItem("token");
  };

  const fetchAttendance = useCallback(() => {
    fetch("http://localhost:5000/attendance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setAttendance(data))
      .catch((error) => console.log(error));
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAttendance();
    }
  }, [token, fetchAttendance]);

  const createAttendance = (studentId, date, present) => {
    const formattedDate = DateTime.fromJSDate(date).toISODate();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { student_id: studentId, date: formattedDate, present },
      ]),
    };

    fetch("http://localhost:5000/attendance", requestOptions)
      .then((response) => response.json())
      .then((newRecord) => {
        setAttendance([...attendance, newRecord]);
        fetchAttendance(); // Fetch the updated attendance list
      })
      .catch((error) => console.log(error));
  };

  const handleUpdate = (attendanceId, updatedValues) => {
    const formattedDate = DateTime.fromJSDate(updatedValues.date).toISODate();
    const updatedRecord = { ...updatedValues, date: formattedDate };

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRecord),
    };

    fetch(`http://localhost:5000/attendance/${attendanceId}`, requestOptions)
      .then((response) => response.json())
      .then((updatedRecord) => {
        setAttendance((prevAttendance) =>
          prevAttendance.map((record) =>
            record.id === attendanceId ? updatedRecord : record
          )
        );
        setUpdateAttendanceId(null);
        setUpdatedValues({});
      })
      .catch((error) => console.log(error));
  };

  const updateAttendance = (attendanceId, studentId, date, present) => {
    const formattedDate = DateTime.fromJSDate(date).toISODate();
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, date: formattedDate, present }),
    };

    fetch(`http://localhost:5000/attendance/${attendanceId}`, requestOptions)
      .then((response) => response.json())
      .then((updatedRecord) => {
        setAttendance((prevAttendance) =>
          prevAttendance.map((record) =>
            record.id === attendanceId ? updatedRecord : record
          )
        );
        setUpdateAttendanceId(null);
      })
      .catch((error) => console.log(error));
  };

  const deleteAttendance = (attendanceId) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`http://localhost:5000/attendance/${attendanceId}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          setAttendance((prevAttendance) =>
            prevAttendance.filter((record) => record.id !== attendanceId)
          );
        }
        fetchAttendance(); // Fetch the updated attendance list
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="app-parent" key="app">
      {token ? (
        <>
          <Navbar token={token} handleLogout={handleLogout} />
          <MainContent
            token={token}
            handleLogout={handleLogout}
            createAttendance={createAttendance}
            fetchAttendance={fetchAttendance}
            attendance={attendance}
            setUpdateAttendanceId={setUpdateAttendanceId}
            deleteAttendance={deleteAttendance}
            updateAttendance={updateAttendance}
            updateAttendanceId={updateAttendanceId}
            handleUpdate={handleUpdate}
            updatedValues={updatedValues}
            setUpdatedValues={setUpdatedValues}
            userName={userName}
          />
          <Footer />
        </>
      ) : (
        <LoginForm handleLogin={handleLogin} loginState={loginState} />
      )}
    </div>
  );
};

export default App;
