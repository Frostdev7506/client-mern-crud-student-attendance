import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/AttendanceReport.css";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

// Import TableContainer separately
import TableContainer from "@mui/material/TableContainer";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { DateTime } from "luxon";

console.log("--------------", `${process.env.REACT_APP_CLIENT_URL}`);
const AttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const [studentId, setStudentId] = useState("");
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const checkBtnRef = useRef();
  const pdfRef = useRef(null);

  const handleCheckAttendance = async () => {
    if (studentId == null) {
      setStudentId("anon");
    }

    if (selectedMonth == null) {
      setSelectedMonth("1923-07-16T18:30:00.000Z");
    }

    // Calculate the end date based on the selected duration
    const endDate = DateTime.fromJSDate(selectedMonth)
      .plus({ months: selectedDuration })
      .toJSDate();

    try {
      // Fetch attendance data from the server using async/await
      const response = await fetch(`http://localhost:5000/attendance`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Attendance Report Data", data);
      setAttendanceData(data);

      // Filter the attendance data based on the selected duration
      const filteredAttendance = attendanceData.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          record.student_id.toLowerCase() === studentId.toLowerCase() &&
          recordDate >= selectedMonth &&
          recordDate <= endDate
        );
      });

      // Set the monthlyAttendance state
      setMonthlyAttendance(filteredAttendance);

      setTotalAttendance(filteredAttendance.length);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleGenerateReport = () => {
    if (totalAttendance > 0) {
      generatePDF(monthlyAttendance, selectedDuration);
    } else {
      alert("No data for report ");
    }
  };
  return (
    <div id="attendance_report">
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
        <h2 style={{ fontSize: "2rem" }}>Attendance Report</h2>
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
            onInput={(e) => {
              setStudentId(e.target.value);
              setTotalAttendance(0);
            }}
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
            onChange={(date) => {
              setSelectedMonth(date);
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            showFullMonthYearPicker
            scrollableMonthYearDropdown
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
          <label htmlFor="attendance_duration">
            Choose the duration for report
          </label>
          <select
            name="attendance_duration"
            id="duration"
            style={{ height: "50px", width: "200px" }}
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
          >
            <option value="1">1 month</option>
            <option value="6">6 month</option>
          </select>
        </div>
        <button
          ref={checkBtnRef}
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
            No of rows found for {studentId} in{" "}
            {selectedMonth.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
            : {totalAttendance}
          </p>
        ) : totalAttendance > 0 ? (
          <p>No result found </p>
        ) : null}

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

        {totalAttendance > 0 && (
          <div className="yes">
            <button
              style={{
                color: "white",
                marginTop: "30px",
                height: "50px",
                width: "140px",
                backgroundColor: "#6B128B",
              }}
              onClick={handleGenerateReport}
            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;

const generatePDF = (monthlyAttendance, selectedDuration) => {
  const pdf = new jsPDF("p", "pt", "a4");
  const tableData = [];
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalWorkingDays = 20 * selectedDuration;

  // Convert monthlyAttendance to a 2D array with proper string representation
  monthlyAttendance.forEach((record, index) => {
    const rowData = [
      (index + 1).toString(),
      record.student_id.toString(), // Make sure student_id is converted to string
      record.date.slice(0, 10),
      record.present ? "Yes" : "No",
    ];

    record.present ? totalPresent++ : totalAbsent++;

    tableData.push(rowData);
  });

  // Change font size and remove background shade for the summary rows
  const valuestyles = {
    fontSize: 12,
    fillColor: false, // Remove background shade
  };

  // Calculate totalWorkingDays as per your requirement
  const calculatedTotalWorkingDays =
    totalAbsent + totalPresent > 20
      ? totalAbsent + totalPresent
      : totalWorkingDays;

  totalAbsent = calculatedTotalWorkingDays - totalPresent;

  // empty data for adding space between table and values in the pdf
  tableData.push([
    "", // Empty cell for serial number
    "", // Empty cell for student_id
    "", // Label for the total days present
    "", // Number of days present
  ]);

  // Add the calculated values to the tableData array
  tableData.push([
    { content: "", valuestyles }, // Empty cell for serial number
    { content: "", valuestyles }, // Empty cell for student_id
    { content: "Total Days Present:", valuestyles }, // Label for the total days present
    { content: totalPresent.toString(), valuestyles }, // Number of days present
  ]);
  tableData.push([
    { content: "", valuestyles }, // Empty cell for serial number
    { content: "", valuestyles }, // Empty cell for student_id
    { content: "Total Days Absent:", valuestyles }, // Label for the total days absent
    { content: totalAbsent.toString(), valuestyles }, // Number of days absent
  ]);
  tableData.push([
    { content: "", valuestyles }, // Empty cell for serial number
    { content: "", valuestyles }, // Empty cell for student_id
    { content: "Total Working Days:", valuestyles }, // Label for the total working days
    { content: calculatedTotalWorkingDays.toString(), valuestyles }, // Number of total working days
  ]);
  // Add table to PDF using autoTable function
  pdf.autoTable({
    head: [["Sr.no", "Student ID", "Date", "Present"]],
    body: tableData,
    startY: 100,
  });

  pdf.save("attendance_report.pdf");
};
