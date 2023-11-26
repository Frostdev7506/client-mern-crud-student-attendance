import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const AdminPannelTable = () => {
  const [adminData, setAdminData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/getAdminData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setAdminData(data);
    };

    fetchData().catch((error) => {
      console.error("Error:", error);
    });
  }, []);

  // Define your data
  const data = useMemo(() => adminData, [adminData]);

  // Define your columns
  /** @type import('@tanstack/react-table').columnDef<any>*/
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessorKey: "id", // accessor is the "key" in the data
        id: "id",
      },
      {
        Header: "Username",
        accessorKey: "username",
        id: "username",
      },
      {
        Header: "Status",
        accessorKey: "status",
        id: "status",
      },
      {
        Header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <button onClick={() => handleEdit(row.original)}>Edit</button>
        ),
      },
    ],
    []
  );

  // Handle edit button click
  const handleEdit = (rowData) => {
    console.log("Edit button clicked for row: ", rowData);
    // Add your edit logic here
  };

  // // Create an instance of the table
  const instance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Render the UI for your table
  return (
    <div style={styles.container}>
      <table style={styles.tableContainer}>
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th key={column.id}>
                  {flexRender(
                    column.column.columnDef.Header,
                    column.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPannelTable;

const styles = {
  container: {
    display: "flex",
    margin: 10,
    // padding: 5,
    minWidth: "40%",
    paddingHorizontal: 10,
    marginHorizontal: 10,
    border: "2px solid white",

    flexDirection: "row",
    justifyContent: "space-around",
  },
  tableContainer: {
    padding: 5,
    margin: 20,
  },
};
