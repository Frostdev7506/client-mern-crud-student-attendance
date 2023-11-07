import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
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
  const [date, setDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const divRef = useRef(null);
  const AttendanceListHeight = 3000;

  const getRecordsForPage = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const searchValue = searchQuery.toLowerCase();
    const filteredAttendance = attendance.filter((record) => {
      if (!searchValue) return true;
      return record.student_id.toLowerCase().includes(searchValue) || false;
    });
    return filteredAttendance.slice(startIndex, endIndex);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    const divHeight = divRef.current.clientHeight;
    setExpanded(divHeight <= AttendanceListHeight);
  }, [attendance]);

  const handleDelete = (attendanceId) => {
    deleteAttendance(attendanceId);
  };

  const handleEdit = (attendanceId) => {
    setEditMode(attendanceId);
    const recordToUpdate = attendance.find(
      (record) => record.id === attendanceId
    );
    setUpdatedValues(recordToUpdate);
    setDate(new Date(recordToUpdate.date));
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
    setDate(null);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    worksheet.columns = [
      { header: "Student ID", key: "studentId", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Present", key: "present", width: 15 },
    ];

    attendance.forEach((record) => {
      worksheet.addRow({
        studentId: record.student_id,
        date: DateTime.fromISO(record.date).toISODate(),
        present: record.present ? "Yes" : "No",
      });
    });

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
              const studentId = row.getCell("A").value;
              const dateCellValue = row.getCell("B").value;
              const present = row.getCell("C").value === "Yes";

              let date = "";
              if (dateCellValue) {
                const dateObj = new Date(dateCellValue);
                if (!isNaN(dateObj.getTime())) {
                  date = dateObj.toISOString().slice(0, 10);
                }
              }
              importedAttendance.push({ student_id: studentId, date, present });
            }
          });

          fetch("http://localhost:5000/attendance", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(importedAttendance),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Import successful:", data);
              fetchAttendance();
            })
            .catch((error) => {
              console.log("Import error:", error);
            });
        });
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const recordsToDisplay = getRecordsForPage();
  const numPages = Math.ceil(attendance.length / recordsPerPage);
  return (
    <div className="attendance_list" id="attendance_list">
      <div
        ref={divRef}
        style={{
          margin: "auto",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px black",
          marginLeft: "50px",
          marginRight: "50px",
          maxHeight: expanded ? "none" : AttendanceListHeight,
          overflowY: expanded ? "scroll" : "hidden",
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
            <div className="exportbtn" style={{ padding: "10px" }}>
              <input
                type="file"
                accept=".xlsx"
                style={{
                  width: "200px",
                  height: "30px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  padding: "5px",
                }}
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
            <div className="search">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  marginBottom: "10px",
                  boxShadow: "10px",
                  width: "300px",
                  height: "50px",
                  borderRadius: 25,
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  marginLeft: "10px",
                  color: "white",
                  height: "50px",
                  borderRadius: 25,
                  width: "70px",
                  backgroundColor: "#6B128B",
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        {recordsToDisplay.map((record) => (
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
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{
              color: "white",
              height: "50px",
              width: "140px",
              margin: "5px",
              backgroundColor: currentPage === 1 ? "#ccc" : "#6B128B",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous Page
          </button>
          <span style={{ fontSize: "1.2rem", margin: "5px" }}>
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= numPages}
            style={{
              color: "white",
              height: "50px",
              width: "140px",
              margin: "5px",
              backgroundColor: currentPage >= numPages ? "#ccc" : "#6B128B",
              cursor: currentPage >= numPages ? "not-allowed" : "pointer",
            }}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
