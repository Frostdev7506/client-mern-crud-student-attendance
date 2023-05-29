import React, { useState } from "react";
import "./App.css";
const AttendanceList = ({ attendance, deleteAttendance, updateAttendance }) => {
  const [editMode, setEditMode] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});

  const handleDelete = (attendanceId) => {
    deleteAttendance(attendanceId);
  };

  const handleEdit = (attendanceId) => {
    setEditMode(attendanceId);
    const recordToUpdate = attendance.find(
      (record) => record.id === attendanceId
    );
    setUpdatedValues(recordToUpdate);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setUpdatedValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleUpdate = (attendanceId) => {
    const { student_id, date, present } = updatedValues; // Destructure the values from updatedValues object
    const updatedRecord = { student_id, date, present }; // Create an object with the updated values
    updateAttendance(attendanceId, updatedRecord);
    setEditMode(null);
    setUpdatedValues({});
  };

  return (
    <div
      style={{
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",

        boxShadow: "0px 0px 10px black",
        marginLeft: "50px",
        marginRight: "50px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Attendance List</h2>
      {attendance.map((record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "40px",
            justifyContent: "space-between",
          }}
          key={record.id}
        >
          {editMode === record.id ? (
            <>
              <input
                type="text"
                name="student_id"
                value={updatedValues.student_id}
                onChange={handleChange}
              />
              <input
                type="text"
                name="date"
                value={updatedValues.date?.slice(0, 10)}
                onChange={handleChange}
              />
              <input
                type="checkbox"
                name="present"
                checked={updatedValues.present}
                onChange={handleChange}
              />
              <button
                className="my-button"
                style={{
                  color: "white",
                  height: "50px",
                  width: "70px",
                  backgroundColor: "#6B128B",
                }}
                onClick={() => handleUpdate(record.id, updatedValues.present)}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p>Student ID: {record.student_id}</p>
              <p>Date: {record.date.slice(0, 10)}</p>
              <p>Present: {record.present ? "Yes" : "No"}</p>
              <button
                style={{
                  color: "white",
                  height: "50px",
                  width: "70px",
                  backgroundColor: "#6B128B",
                }}
                onClick={() => handleEdit(record.id)}
              >
                Edit
              </button>
              <button
                style={{
                  color: "white",
                  height: "50px",
                  width: "70px",
                  backgroundColor: "#6B128B",
                }}
                onClick={() => handleDelete(record.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttendanceList;
