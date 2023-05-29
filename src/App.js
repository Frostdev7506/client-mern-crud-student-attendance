import React, { useState, useEffect } from "react";
import CreateAttendanceForm from "./CreateAttendanceForm";
import AttendanceList from "./AttendanceList";
import UpdateAttendanceForm from "./UpdateAttendanceForm";

const App = () => {
  const [attendance, setAttendance] = useState([]);
  const [updateAttendanceId, setUpdateAttendanceId] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});

  const fetchAttendance = () => {
    fetch("http://localhost:5000/attendance")
      .then((response) => response.json())
      .then((data) => setAttendance(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const createAttendance = (studentId, date, present) => {
    const formattedDate = date.toISOString().split("T")[0];

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, date: formattedDate, present }),
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
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedValues),
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
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, date, present }),
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
    <div>
      <h1 style={{ textAlign: "center" }}>Student Attendance App</h1>
      <CreateAttendanceForm createAttendance={createAttendance} />
      <AttendanceList
        attendance={attendance}
        setUpdateAttendanceId={setUpdateAttendanceId}
        deleteAttendance={deleteAttendance}
        updateAttendance={updateAttendance}
      />
      {updateAttendanceId && (
        <UpdateAttendanceForm
          attendanceId={updateAttendanceId}
          handleUpdate={handleUpdate}
          updatedValues={updatedValues}
          setUpdatedValues={setUpdatedValues}
        />
      )}
    </div>
  );
};

export default App;
