import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/AttendanceReport.css";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import { DateTime } from "luxon";

const AttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);

  useEffect(() => {
    // Fetch attendance data from the server
    fetch("http://localhost:5000/attendance")
      .then((response) => response.json())
      .then((data) => {
        setAttendanceData(data);
      })
      .catch((error) => console.log(error));
  });

  const handleCheckAttendance = () => {
    if (selectedMonth === null) {
      alert("Please select a month.");
      return;
    }

    if (studentId.trim() === "") {
      alert("Please enter a student ID.");
      return;
    }

    const filteredAttendance = attendanceData.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        record.student_id.toLowerCase() === studentId.toLowerCase() &&
        recordDate.getMonth() === selectedMonth.getMonth() &&
        recordDate.getFullYear() === selectedMonth.getFullYear()
      );
    });

    // Set the monthlyAttendance state
    setMonthlyAttendance(filteredAttendance);

    setTotalAttendance(monthlyAttendance.length);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px black",
          marginLeft: "50px",
          marginRight: "50px",
          marginTop: "50px",
          padding: "10px",
          minHeight: "50vh",
        }}
      >
        <h2>Attendance Report</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "2px",
            margin: "4px",
          }}
        >
          <label htmlFor="studentId">Student ID:</label>
          <input
            style={{
              width: "200px",
              height: "30px",
              margin: "2px auto",

              padding: "2px",
            }}
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "2px",
            margin: "4px",
          }}
        >
          <label htmlFor="monthPicker">Select Month:</label>
          <DatePicker
            id="monthPicker"
            style={{
              width: "200px",
              height: "30px",

              margin: "2px auto",

              padding: "2px",
            }}
            selected={selectedMonth}
            onChange={(date) => setSelectedMonth(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            showFullMonthYearPicker
            scrollableMonthYearDropdown
          />
        </div>
        <button
          style={{
            color: "white",
            marginTop: "30px",
            height: "50px",
            width: "140px",
            backgroundColor: "#6B128B",
          }}
          onClick={handleCheckAttendance}
        >
          Check Attendance
        </button>
        {totalAttendance > 0 ? (
          <p>
            Total attendance for student ID {studentId} in{" "}
            {selectedMonth.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
            : {totalAttendance}
          </p>
        ) : (
          <p>No result found </p>
        )}

        {totalAttendance > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Id</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Present</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.student_id}</TableCell>
                    <TableCell>{record.date.slice(0, 10)}</TableCell>
                    <TableCell>{record.present ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
