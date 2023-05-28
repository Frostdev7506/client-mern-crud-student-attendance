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
    <div className="form-container">
      <h2>Create Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="studentId">Student ID:</label>
          <br />
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="date">Date:</label>
          <DatePicker
            id="date"
            selected={date}
            onChange={(selectedDate) => setDate(selectedDate)}
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </div>

        <div>
          <label>Present:</label>
          <br />
          <input
            type="checkbox"
            checked={present}
            onChange={(e) => setPresent(e.target.checked)}
          />
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateAttendanceForm;
