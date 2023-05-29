import React, { useState } from "react";

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
    <div>
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
                onClick={() => handleUpdate(record.id, updatedValues.present)}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p>Student ID: {record.student_id}</p>
              <p>Date: {record.date}</p>
              <p>Present: {record.present ? "Yes" : "No"}</p>
              <button onClick={() => handleEdit(record.id)}>Edit</button>
              <button onClick={() => handleDelete(record.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttendanceList;
