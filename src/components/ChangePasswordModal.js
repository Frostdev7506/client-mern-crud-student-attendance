import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ChangePasswordModal = () => {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [userName, setUserName] = useState("");

  const [isEmailCodeCorrect, setIsEmailCodeCorrect] = useState(false);
  const [isUsernameSent, setIsUsernameSent] = useState(false);

  const handleClose = () => {
    setShow(false);
    setIsEmailCodeCorrect(false);
    setIsUsernameSent(false);
    setPassword("");
    setEmailCode("");
    setConfirmPassword("");
    setUserName("");
  };

  const handleShow = () => setShow(true);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Password change will continue");
    // Call your function to handle password change here
    console.log("Password changed to: ", password);
    handleClose();
  };

  const sendEmail = () => {
    setIsUsernameSent(true);
  };

  const SubmitEmailCode = () => {
    if (emailCode === "correct-code") {
      setEmailCode("");
      setIsEmailCodeCorrect(true);
    } else {
      setIsEmailCodeCorrect(false);
    }
  };

  return (
    <>
      <p onClick={handleShow} style={{ cursor: "pointer" }}>
        Forget Password?
      </p>

      {show && (
        <div style={styles.modalContainer}>
          <div style={styles.modalContent}>
            <div style={styles.closeContainer} className="close-button">
              <span style={styles.closeButton} onClick={handleClose}>
                X
              </span>
            </div>

            <h3 style={{ textAlign: "center" }}>Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              {!isEmailCodeCorrect ? (
                isUsernameSent ? (
                  <div style={styles.formGroup}>
                    <label>Email Code</label>
                    <input
                      type="text"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      placeholder="Enter email code"
                    />
                    <Button
                      style={styles.fancyButton}
                      onClick={SubmitEmailCode}
                    >
                      Submit
                    </Button>
                  </div>
                ) : (
                  <div style={styles.formGroup}>
                    <label>Username</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter username"
                    />
                    <Button style={styles.fancyButton} onClick={sendEmail}>
                      Submit
                    </Button>
                  </div>
                )
              ) : (
                <>
                  <div style={styles.formGroup}>
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      autoComplete="off"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button style={styles.fancyButton} type="submit">
                    Submit
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePasswordModal;

const styles = {
  modalContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  },
  formGroup: {
    marginBottom: "20px",
  },
  fancyButton: {
    backgroundColor: "#6B128B",
    color: "white",
    borderRadius: "25px",
    width: "100%",
    padding: "10px",
    cursor: "pointer",
  },
  closeButton: {
    cursor: "pointer",
    color: "red",
  },
  closeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
};
