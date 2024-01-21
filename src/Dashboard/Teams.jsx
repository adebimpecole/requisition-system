import React, { useContext, useState, useEffect, useMemo } from 'react'
import { useTable } from "react-table";

import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc } from 'firebase/firestore';

import { Context } from '../Utilities/Context';
import '../Dashboard2/Company.sass';
import "../Dashboard2/Home"
import "../Dashboard2/Home.sass"
import "./Records.sass"

const Teams = ({ firstname, lastname, mail, company, role, dept, }) => {
    const { user, setuser, id, setid, errorMessage } = useContext(Context);
    const db = getFirestore();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [numbering, setNumbering] = useState(0);

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
        setIsLoading(true);
        const userCollectionRef = collection(db, 'users');
        const query4 = query(userCollectionRef, where('company_name', '==', company));

        getDocs(query4)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userData = [];
                    querySnapshot.forEach((doc) => {
                        userData.push(doc.data());
                    });
                    setData(userData);
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

    }, []);


    const columns = useMemo(() => COLUMNS, []);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });
    return (
        <div className='records'>
            <div className='home_intro'>
                <div className='home_tab'>

                    <div className='welcome'>{firstname} {lastname}</div>
                    <div className='welcome_text'>{dept} Department</div>
                </div>

                <div className="the_table">
                    <div className='table_filters'>
                        <span> All</span>
                        <span> Department</span>
                        <span> Role</span>
                    </div>
                    {isLoading ? (
                        <p>Loading data...</p>
                    ) : (
                        <>
                            <table {...getTableProps()}>
                                <thead>
                                    {headerGroups.map((headerGroup) => (
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
                                <tbody {...getTableBodyProps()}>
                                    {rows.map((row, index) => {
                                        prepareRow(row);
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
        </div>
    )
}

export default Teams
