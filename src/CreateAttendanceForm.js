import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

        margin: "50px",
        padding: "30px",
        backgroundColor: "#F5F5F5",
        margin: "40px ",
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
              placeholderText: "Enter Student ID",
            }}
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
              width: "200px",
              height: "30px",
              margin: "2px auto",
              padding: "2px",
            }}
            placeholderText="Select Date"
            className="form-control"
            showIcon={true}
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
            width: "100px",
            paddingBottom: "2px",
            margin: "1px solid black",
            height: "50px",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateAttendanceForm;
