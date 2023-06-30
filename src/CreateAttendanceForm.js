import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
const CreateAttendanceForm = ({ createAttendance }) => {
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(null);
  const [present, setPresent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAttendance(studentId, date, present);
    setStudentId("");
    setDate(null);
    setPresent(false);
  };

  return (
    <div
      className="form-container"
      style={{
        textAlign: "center",
        borderRadius: "10px",

        boxShadow: "0px 0px 10px black",
        margin: "50px",
        padding: "30px",
        backgroundColor: "#F5F5F5",
        marginLeft: "50px",
        marginRight: "50px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Create Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="studentId">Student ID:</label>
          <br />
          <input
            style={{
              width: "200px",
              height: "30px",
              margin: "2px auto",
              padding: "2px",
            }}
            label="Enter your student id"
            placeholderText="Enter Your Student Id"
            autoComplete="off"
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label htmlFor="date">Date:</label>
          <DatePicker
            id="date"
            style={{
              display: "flex",
              justifyContent: "center ",
              textAlign: "center",
              alignItems: "center",
              left: "50%",
              top: "50%",

              margin: "2px auto",
              padding: "2px",
            }}
            selected={date}
            onChange={(selectedDate) => setDate(selectedDate)}
            autoComplete="off"
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </div>
        <br />
        <div>
          <label>Present:</label>
          <br />
          <input
            style={{
              width: "15px",
              height: "15px",
              margin: "2px auto",
              marginTop: "4px",
              paddingTop: "4px",
            }}
            type="checkbox"
            checked={present}
            onChange={(e) => setPresent(e.target.checked)}
          />
        </div>
        <br />
        <button
          type="submit"
          style={{
            color: "white",
            height: "50px",
            width: "70px",
            backgroundColor: "#6B128B",
            paddingBottom: "2px",
            margin: "2px solid black",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateAttendanceForm;
