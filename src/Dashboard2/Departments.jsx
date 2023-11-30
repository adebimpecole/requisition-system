import React, { useState, useEffect, useMemo, useContext } from "react";
import { useTable } from "react-table";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";

import { Context } from "../Utilities/Context";
import "../Dashboard/Settings.sass";

const Departments = (props) => {

  let { user, setuser, id, setid, errorMessage } = useContext(Context);
  const db = getFirestore();

  const [approverData, setApproverData] = useState();
  const [the_Data, setThe_Data] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isApproverLoading, setIsApproverLoading] = useState(false);

  // columns.js
  const COLUMNS = [
    {
      Header: "Department",
      accessor: "department",
    }
  ];

  useEffect(() => {
    setIsApproverLoading(true);
    const userCollectionRef = collection(db, "departments");
    const query4 = query(
      userCollectionRef,
      where("companyId", "==", id)
    );

    getDocs(query4)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const userData = [];
        querySnapshot.forEach((doc) => {
          userData.push(doc.data().department);
        });
        console.log(userData)
        setApproverData(userData);
      } else {
        console.log("No user data found for this company name.");
      }
    })
    .catch((error) => {
      console.error("Error getting user data:", error);
    })
    .finally(() => {
      setIsApproverLoading(false);
    });
  }, []);
  
  

  const columns = useMemo(() => COLUMNS, []);
  
  useEffect(()=>{
    console.log(approverData)
    
  },[approverData])
  const {
    getTableProps: getApproversTableProps,
    getTableBodyProps: getApproversTableBodyProps,
    headerGroups: approversHeaderGroups,
    rows: approversRows,
    prepareRow: approversPrepareRow,
  } = useTable({ columns, data: the_Data});
  
  
  useEffect(() => {
    console.log(approverData.length)
    if(approverData.length !== 0){

      setThe_Data(approverData.map((dept, index) => ({
        id: index, // Assuming each row needs a unique identifier
        department: dept,
      })))
    }
  }, [approverData]);
  
  return (
    <div className="admin">
      <div className="admin_table">
        <span className="admin_title">Departments</span>
        {isApproverLoading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <table {...getApproversTableProps()}>
              <thead>
                {approversHeaderGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    <th>S/N</th>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getApproversTableBodyProps()}>
                {approversRows.map((row, index) => {
                  approversPrepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      <td>{index + 1}</td>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Departments;
