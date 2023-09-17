import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/App.css";

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
    <div className="createAttendance">
      <div
        id="createAttendance"
        className="form-container"
        style={{
          textAlign: "center",
          borderRadius: "10px",
          height: "50vh",
          boxShadow: "0px 0px 20px black",
          backgroundColor: "#F5F5F5",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "2rem" }}>
          Create Attendance
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
            <label htmlFor="studentId">Student ID:</label>
            <br />
            <input
              className="text-input "
              label="Enter your student id"
              autoComplete="off"
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          <div style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
            <label htmlFor="date">Date:</label>
            <DatePicker
              id="date"
              className="custom-datepicker" // Add a class name for styling
              selected={date}
              onChange={(selectedDate) => setDate(selectedDate)}
              autoComplete="off"
              placeholder="Enter Date"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
          </div>
          <div style={{ fontSize: "1.5rem" }}>
            <label>Present:</label>
            <br />
            <input
              style={{ marginBottom: "20px" }}
              type="checkbox"
              checked={present}
              onChange={(e) => setPresent(e.target.checked)}
            />
          </div>
          <button
            type="submit"
            style={{
              color: "white",
              height: "50px",
              width: "100px",
              backgroundColor: "#6B128B",
              paddingBottom: "2px",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAttendanceForm;
