import React, { useState, useEffect } from "react";
import CreateAttendanceForm from "./CreateAttendanceForm";
import AttendanceList from "./AttendanceList";
import UpdateAttendanceForm from "./UpdateAttendanceForm";

const App = () => {
  const [attendance, setAttendance] = useState([]);
  const [updateAttendanceId, setUpdateAttendanceId] = useState(null);

  useEffect(() => {
    // Fetch attendance data from the server
    fetch("http://localhost:5000/attendance")
      .then((response) => response.json())
      .then((data) => setAttendance(data))
      .catch((error) => console.log(error));
  }, []);

  const createAttendance = (studentId, date, present) => {
    // Convert date to the desired format (YYYY-MM-DD)
    const formattedDate = date.toISOString().split("T")[0];
    console.log("date" + formattedDate);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, date: formattedDate, present }),
    };

    fetch("http://localhost:5000/attendance", requestOptions)
      .then((response) => response.json())
      .then((newRecord) => {
        setAttendance([...attendance, newRecord]);
      })
      .catch((error) => console.log(error));
  };

  const updateAttendance = (attendanceId, present) => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ present }),
    };

    fetch(`http://localhost:5000/attendance/${attendanceId}`, requestOptions)
      .then((response) => response.json())
      .then((updatedRecord) => {
        console.log("Response:", updatedRecord); // Check the response
        // Update the attendance state with the updated record
        setAttendance((prevAttendance) =>
          prevAttendance.map((record) => {
            if (record.id === attendanceId) {
              return { ...record, present: updatedRecord.present };
            }
            return record;
          })
        );
        setUpdateAttendanceId(null); // Reset the update attendance form
      })
      .catch((error) => console.log(error));
  };

  const deleteAttendance = (attendanceId) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendanceId }),
    };

    fetch(`http://localhost:5000/attendance/${attendanceId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete attendance record");
        }
        // Return an empty object to indicate successful deletion
        return response.json();
      })
      .then(() => {
        // Update the attendance state by removing the deleted record
        const updatedAttendance = attendance.filter(
          (record) => record.id !== attendanceId
        );
        setAttendance(updatedAttendance);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Student Attendance App</h1>
      <CreateAttendanceForm
        createAttendance={createAttendance}
        updateAttendance={updateAttendance}
      />
      <AttendanceList
        attendance={attendance}
        setUpdateAttendanceId={setUpdateAttendanceId}
        deleteAttendance={deleteAttendance}
      />
      {updateAttendanceId && (
        <UpdateAttendanceForm
          attendanceId={updateAttendanceId}
          updateAttendance={updateAttendance}
        />
      )}
    </div>
  );
};

export default App;
