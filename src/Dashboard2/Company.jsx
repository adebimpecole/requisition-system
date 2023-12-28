import React, { useContext, useState, useEffect, useMemo } from 'react';

import { auth } from '../config/firebase';
import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc, updateDoc } from 'firebase/firestore';

import { Context } from '../Utilities/Context';
import './Company.sass';

import { ToastContainer } from 'react-toastify';
import Toastify from 'toastify-js'

import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

import { useTable } from 'react-table';
import iclose from "../assets/close.svg"


const Company = () => {
    const db = getFirestore();
    const { user, errorMessage } = useContext(Context);
    const [data, setData] = useState([]);
    const [approversData, setApproversData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingApprovers, setIsLoadingApprovers] = useState(false);

    // dummy state
    const [count, setCount] = useState(0);

    // columns.js

    const COLUMNS = [
        {
            Header: 'Name',
            accessor: 'name',
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

    const getUsers = () => {
        setIsLoading(true);
        const userCollectionRef = collection(db, 'users');
        const query4 = query(userCollectionRef, where('company_name', '==', user));

        getDocs(query4)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userData = [];
                    querySnapshot.forEach((doc) => {
                        userData.push(doc.data());
                    });
                    userData.forEach((element, index) => {
                        userData[index].name = `${userData[index].first_name} ${userData[index].last_name}`
                    });
                    setData(userData)
                } else {
                    console.log('No user data found for this company name.');
                }
            })
            .catch((error) => {
                console.error('Error getting user data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getUsers("Start");
     }, []);

    // handles request actions
    const DeleteReq = () => {
        Swal.close()
    }

    // assigns the role of an approver to the selected employee
    const assignApprover = (e) => {
        const collectionRef = collection(db, 'users');
        const q = query(collectionRef, where('userId', '==', e.original.userId));
        console.log(e)
        getDocs(q)
            .then((querySnapshot) => {
                querySnapshot.forEach((docSnap) => {
                    const docRef = doc(db, 'users', docSnap.id);
                    if(e.original.role == "Approver"){
                        const update = { role: "Requester" }
                        // Update the document
                        updateDoc(docRef, update)
                            .then(() => {
                                console.log('Document updated successfully');
                            })
                            .catch((error) => {
                                console.error('Error updating document:', error);
                            });
                    }
                    else if(e.original.role == "Requester"){
                        const update = { role: "Approver" }
                        // Update the document
                        updateDoc(docRef, update)
                            .then(() => {
                                console.log('Document updated successfully');
                            })
                            .catch((error) => {
                                console.error('Error updating document:', error);
                            });
                    }

                });
            })
            .catch((error) => {
                console.error('Error querying Firestore:', error);
            })
        Swal.close()
        setCount(count + 1);
    }

    const makeApprover = (e) => {
        console.log(e)
        if(e.original.role == "Approver"){
            const swal = Swal.fire({
                html:
                    "<div class='header_bar'>" +
                    "<span class='close_container'>" +
                    "<img id='close' src='" + iclose + "' alt='alert_icon' style='cursor:pointer'/>" +
                    "</span>" +
                    "<span class='big_heading'>" +
                    "Remove Approver" +
                    "</span>" +
                    "<span class='lil_heading'>Are you absolutely sure you want to remove " + e.values.name + " as an approver?</span>" +
                    "</div>" +
                    "<div class='confirm_buttons'>" +
                    "<button id='cancel-button' class='cancel_button'>Cancel</button>" +
                    "<button id='assign-button' class='button'>Yes</button>" +
                    "</div>",
                allowOutsideClick: false,
                showConfirmButton: false,
                customClass: {
                    popup: 'invite_popup',
                    htmlContainer: 'invite_container',
                },
            });
        }
        else if(e.original.role == "Requester"){
            const swal = Swal.fire({
                html:
                    "<div class='header_bar'>" +
                    "<span class='close_container'>" +
                    "<img id='close' src='" + iclose + "' alt='alert_icon' style='cursor:pointer'/>" +
                    "</span>" +
                    "<span class='big_heading'>" +
                    "Add Approver" +
                    "</span>" +
                    "<span class='lil_heading'>Are you absolutely sure you want to add " + e.values.name + " as an approver?</span>" +
                    "</div>" +
                    "<div class='confirm_buttons'>" +
                    "<button id='cancel-button' class='cancel_button'>Cancel</button>" +
                    "<button id='assign-button' class='button'>Yes</button>" +
                    "</div>",
                allowOutsideClick: false,
                showConfirmButton: false,
                customClass: {
                    popup: 'invite_popup',
                    htmlContainer: 'invite_container',
                },
            });
        }

        // Close request
        const closeButton = document.getElementById('close');
        closeButton.addEventListener('click', () => DeleteReq());

        // Close request
        const cancelButton = document.getElementById('cancel-button');
        cancelButton.addEventListener('click', () => DeleteReq());

        // Assign approver
        const assignButton = document.getElementById('assign-button');
        assignButton.addEventListener('click', () => assignApprover(e));
    }

    const columns = useMemo(() => COLUMNS, []);

    const {
        getTableProps: getEmployeesTableProps,
        getTableBodyProps: getEmployeesTableBodyProps,
        headerGroups: employeesHeaderGroups,
        rows: employeesRows,
        prepareRow: employeesPrepareRow
    } = useTable({ columns, data: data });

    const switchTable = (e) => {
        setIsLoading(true);
        const approversCollectionRef = collection(db, 'users');
        const approversQuery = query(approversCollectionRef, where('company_name', '==', user));
        console.log(e)
        getDocs(approversQuery)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const approversUserData = [];
                    querySnapshot.forEach((doc) => {
                        if(e == "Approver" && doc.data().role == "Approver"){
                            approversUserData.push(doc.data());
                        }
                        if(e == "Requester" && doc.data().role == "requester"){
                            approversUserData.push(doc.data());
                        }
                    });
                    approversUserData.forEach((element, index) => {
                        approversUserData[index].name = `${approversUserData[index].first_name} ${approversUserData[index].last_name}`
                    });
                    setData(approversUserData);
                } else {
                    console.log('No approvers data found for this company name.');
                }
            })
            .catch((error) => {
                console.error('Error getting approvers data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });

    }
    return (
        <div className="Home">
            <div className='home_tab'>
                <div className='welcome'>
                    {user}
                </div>
                <div className='welcome_text'>Department</div>
            </div>
            <div className="table">
                <div className='table_filters'>
                    <span onClick={()=>getUsers("All")}> All</span>
                    <span onClick={()=>switchTable("Approver")}> Approvers</span>
                    <span onClick={()=>switchTable("Requester")}> Requesters</span>
                </div>
                {isLoading ? (
                    <p>Loading employees data...</p>
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
                                        <tr {...row.getRowProps()} onClick={() => makeApprover(row)}>
                                            <td>{index+1}</td>
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

export default Company;
