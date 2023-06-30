import React, { useState } from "react";
import "./App.css";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AttendanceList = ({ attendance, deleteAttendance, updateAttendance }) => {
  const [editMode, setEditMode] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [date, setDate] = useState(null); // State for the date picker

  const handleDelete = (attendanceId) => {
    deleteAttendance(attendanceId);
  };

  const handleEdit = (attendanceId) => {
    setEditMode(attendanceId);
    const recordToUpdate = attendance.find(
      (record) => record.id === attendanceId
    );
    setUpdatedValues(recordToUpdate);
    setDate(new Date(recordToUpdate.date)); // Set the date picker value
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
    const { student_id, present } = updatedValues; // Remove date from here
    const updatedRecord = { student_id, date: date.toISOString(), present }; // Include the updated date from the date picker
    updateAttendance(attendanceId, updatedRecord);
    setEditMode(null);
    setUpdatedValues({});
    setDate(null); // Reset the date picker value
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    // Set column headers
    worksheet.columns = [
      { header: "Student ID", key: "studentId", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Present", key: "present", width: 15 },
    ];

    // Add attendance data to worksheet
    attendance.forEach((record) => {
      worksheet.addRow({
        studentId: record.student_id,
        date: record.date.slice(0, 10),
        present: record.present ? "Yes" : "No",
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "attendance.xlsx");
  };

  return (
    <div>
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
        <h1 style={{ textAlign: "center" }}>Attendance List</h1>
        <div className="exportbtn">
          <button className="export-button" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>

        {attendance.map((record) => (
          <div
            key={record.id}
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "40px",
              justifyContent: "space-between",
            }}
          >
            {editMode === record.id ? (
              <>
                <input
                  type="text"
                  name="student_id"
                  value={updatedValues.student_id}
                  onChange={handleChange}
                />
                <div className="datepicker-container">
                  <DatePicker
                    id="date"
                    selected={date}
                    onChange={(selectedDate) => setDate(selectedDate)}
                    autoComplete="off"
                    dateFormat="yyyy-MM-dd"
                    isClearable
                  />
                </div>
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
                  onClick={() => handleUpdate(record.id)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div className="line">
                  <div className="studentid lineElement">
                    <p className="Titles">Student ID:</p>{" "}
                    <p>{record.student_id}</p>
                  </div>
                  <div className="date lineElement">
                    <p className="Titles">Date:</p>{" "}
                    <p>{record.date.slice(0, 10).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="present lineElement">
                    <p className="Titles">Present:</p>
                    <p>{record.present ? "Yes" : "No"}</p>
                  </div>

                  <button
                    className="editbtn lineElement"
                    style={{
                      color: "white",
                      marginTop: "30px",
                      height: "50px",
                      width: "70px",
                      backgroundColor: "#6B128B",
                    }}
                    onClick={() => handleEdit(record.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="deletebtn lineElement"
                    style={{
                      color: "white",
                      marginTop: "30px",
                      height: "50px",
                      width: "70px",
                      backgroundColor: "#6B128B",
                    }}
                    onClick={() => handleDelete(record.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceList;
