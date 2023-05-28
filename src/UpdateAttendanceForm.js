import React, { useState } from "react";

const UpdateAttendanceForm = ({ attendanceId, updateAttendance }) => {
  const [present, setPresent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAttendance(attendanceId, present);
  };

  return (
    <div>
      <h2>Update Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Present:</label>
          <input
            type="checkbox"
            checked={present}
            onChange={(e) => setPresent(e.target.checked)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateAttendanceForm;
