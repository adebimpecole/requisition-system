import React, { useState, useEffect, useMemo } from 'react'
import { useTable } from "react-table";

import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc } from 'firebase/firestore';

import "./Settings.sass"

const Admins = (props) => {
    const db = getFirestore();

    const [data, setData] = useState([]);
    const [approverData, setApproverData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isApproverLoading, setIsApproverLoading] = useState(false);


    // columns.js
    const COLUMNS = [
        {
            Header: 'Employee Name',
            accessor: (row) => {
                return `${row.first_name} ${row.last_name}`;
            },
        },
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Department',
            accessor: 'department',
        },
        {
            Header: 'Role',
            accessor: 'role',
        },
    ];

    useEffect(() => {
        setIsApproverLoading(true);
        const userCollectionRef = collection(db, 'users');
        const query4 = query(userCollectionRef, where('company_name', '==', props.company));

        getDocs(query4)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userData = [];
                    const approverData = [];

                    querySnapshot.forEach((doc) => {
                        if(doc.data().role == "requester"){
                            userData.push(doc.data());
                        }
                        else if(doc.data().role == "Approver"){
                            approverData.push(doc.data());
                        }
                    });
                    setApproverData(approverData);
                    setData(userData)
                } else {
                    console.log('No user data found for this company name.');
                }
            })
            .catch((error) => {
                console.error('Error getting user data:', error);
            })
            .finally(() => {
                setIsApproverLoading(false);
            });

        setIsLoading(false);
    }, []);

    const columns = useMemo(() => COLUMNS, []);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    const {
        getTableProps: getEmployeesTableProps,
        getTableBodyProps: getEmployeesTableBodyProps,
        headerGroups: employeesHeaderGroups,
        rows: employeesRows,
        prepareRow: employeesPrepareRow
    } = useTable({ columns, data: data });
    const {
        getTableProps: getApproversTableProps,
        getTableBodyProps: getApproversTableBodyProps,
        headerGroups: approversHeaderGroups,
        rows: approversRows,
        prepareRow: approversPrepareRow
    } = useTable({ columns, data: approverData });

    return (
        <div className='admin'>
            <div className='admin_table'>
                <span className='admin_title'>Approvers</span>
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
                                                {column.render('Header')}
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
                                                        {cell.render('Cell')}
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
            <div className='admin_table'>
                <span className='admin_title'>Add Approvers</span>
                {isLoading ? (
                    <p>Loading data...</p>
                ) : (
                    <>
                        <table {...getEmployeesTableProps()}>
                            <thead>
                                {employeesHeaderGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        <th>S/N</th>
                                        {headerGroup.headers.map((column) => (
                                            <th {...column.getHeaderProps()}>
                                                {column.render('Header')}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getEmployeesTableBodyProps()}>
                                {employeesRows.map((row, index) => {
                                    employeesPrepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            <td>{index + 1}</td>
                                            {row.cells.map((cell) => {
                                                return (
                                                    <td {...cell.getCellProps()}>
                                                        {cell.render('Cell')}
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
    )
}

export default Admins
