import React from "react";
import CreateAttendanceForm from "../CreateAttendanceForm";
import AttendanceList from "../AttendanceList";
import UpdateAttendanceForm from "../UpdateAttendanceForm";
import AttendanceReport from "../AttendanceReport";
import GroupChat from "../GroupChat";

function MainContent({
  token,
  handleLogout,
  createAttendance,
  fetchAttendance,
  attendance,
  setUpdateAttendanceId,
  deleteAttendance,
  updateAttendance,
  updateAttendanceId,
  handleUpdate,
  updatedValues,
  setUpdatedValues,
  userName,
}) {
  return (
    <>
      <CreateAttendanceForm createAttendance={createAttendance} />
      <AttendanceList
        fetchAttendance={fetchAttendance}
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
      <AttendanceReport />
      <GroupChat userName={userName} />
    </>
  );
}

export default MainContent;
