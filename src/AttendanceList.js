import React from "react";

const AttendanceList = ({ attendance, deleteAttendance }) => {
  const handleDelete = (attendanceId) => {
    deleteAttendance(attendanceId);
  };
  return (
    <div>
      <h2>Attendance List</h2>
      {attendance.map((record) => (
        <div key={record.id}>
          <p>Student ID: {record.student_id}</p>
          <p>Date: {record.date}</p>
          <p>Present: {record.present ? "Yes" : "No"}</p>
          <button onClick={() => handleDelete(record.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AttendanceList;
