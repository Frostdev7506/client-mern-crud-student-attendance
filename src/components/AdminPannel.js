import AdminPannelTable from "./AdminPannelTable";
const AdminPannel = ({ userName }) => {
  return (
    <>
      <div className="Maincontainer" style={styles.MainContainer}>
        <AdminPannelTable />
      </div>
    </>
  );
};

export default AdminPannel;

const styles = {
  MainContainer: {
    display: "flex",
    // minHeight: "100vh",
    flexDirection: "row",
    justifyContent: "center",
  },
};
