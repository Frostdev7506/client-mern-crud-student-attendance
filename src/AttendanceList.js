import React, { useState } from "react";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { DateTime } from "luxon";

const AttendanceList = ({
  fetchAttendance,
  attendance,
  deleteAttendance,
  updateAttendance,
}) => {
  const [editMode, setEditMode] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [date, setDate] = useState(null); // State for the date picker
  const [selectedFile, setSelectedFile] = useState(null);

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
    const { student_id, present } = updatedValues;
    const updatedRecord = {
      student_id,
      date: date ? DateTime.fromJSDate(date).toISODate() : "",
      present,
    };
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
        date: DateTime.fromISO(record.date).toISODate(),
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const importFromExcel = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.load(data).then(() => {
          const worksheet = workbook.getWorksheet("Attendance");
          const importedAttendance = [];

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              // Skip the first row (headers)
              const studentId = row.getCell("A").value;
              const dateCellValue = row.getCell("B").value;
              // const date = DateTime.fromJSDate(row.getCell("B").value);
              const present = row.getCell("C").value === "Yes";
              console.log("Date Cell Value:", dateCellValue);
              console.log("values------------", studentId, present);

              let date = ""; // Default empty date value
              if (dateCellValue) {
                const dateObj = new Date(dateCellValue);
                if (!isNaN(dateObj.getTime())) {
                  date = dateObj.toISOString().slice(0, 10);
                }
              }
              importedAttendance.push({ student_id: studentId, date, present });
            }
          });

          // Make API request to insert the imported attendance data
          fetch("http://localhost:5000/attendance", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(importedAttendance),
          })
            .then((response) => response.json())
            .then((data) => {
              // Handle the response data if needed
              console.log("Import successful:", data);
              fetchAttendance();
            })
            .catch((error) => {
              // Handle the error if needed
              console.log("Import error:", error);
            });
        });
      };

      reader.readAsArrayBuffer(selectedFile);
    }
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
        <h1 style={{ textAlign: "center", fontSize: "2rem " }}>
          Attendance List
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div className="iobtns">
            <div className="exportbtn">
              <button
                className="export-button"
                onClick={exportToExcel}
                style={{ width: "150px" }}
              >
                Export to Excel
              </button>
            </div>

            <div className="exportbtn" style={{ width: "200px" }}>
              <input
                type="file"
                accept=".xlsx"
                style={{ width: "200px" }}
                onChange={handleFileChange}
              />
            </div>

            <div className="exportbtn">
              <button
                className="export-button"
                onClick={importFromExcel}
                style={{ width: "150px" }}
              >
                Import From Excel
              </button>
            </div>
          </div>
        </div>
        {attendance.map((record) => (
          <div key={record.id}>
            <hr />
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
                    <div key={record.id} className="studentid lineElement">
                      <p style={{ fontSize: "1.2rem " }} className="Titles">
                        Student ID:
                      </p>{" "}
                      <p>{record.student_id}</p>
                    </div>
                    <div className="date lineElement">
                      <p style={{ fontSize: "1.2rem " }} className="Titles">
                        Date:
                      </p>{" "}
                      <p>{DateTime.fromISO(record.date).toISODate()}</p>
                    </div>
                    <div className="present lineElement">
                      <p style={{ fontSize: "1.2rem " }} className="Titles">
                        Present:
                      </p>
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
          </div>
        ))}
        <hr></hr>
      </div>
    </div>
  );
};

export default AttendanceList;
