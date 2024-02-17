import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useTable } from "react-table";

import { openRequest } from '../config/Modals';

import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc } from 'firebase/firestore';


import { Context } from '../Utilities/Context';
import '../Dashboard2/Company.sass';
import './Table.sass'

export default function Table() {

    const db = getFirestore();

    const { user, id, errorMessage, setpage } = useContext(Context);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // columns
    const COLUMNS = [
        {
            Header: 'ID',
            accessor: 'requset_id',
        },
        {
            Header: 'Title',
            accessor: 'title',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Department',
            accessor: 'department',
        },
        {
            Header: 'Date',
            accessor: 'date',
        },
        {
            Header: 'Status',
            accessor: 'status',
        },
    ];

    useEffect(() => {
        setIsLoading(true);
        const userCollectionRef = collection(db, 'requests');
        const query4 = query(userCollectionRef, where('user_id', '==', id));

        getDocs(query4)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userData = [];
                    querySnapshot.forEach((doc) => {
                        userData.push(doc.data());
                    });
                    setData(userData);
                } else {
                    console.log('No user data found for this id.');
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
        <div className="the_table">
            <div className='table_name'>Recent Requests <span onClick={() => setpage("Requests")}>View All</span></div>
            {isLoading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, columnIndex) => (
                                        <th {...column.getHeaderProps()} className='fixed-column'>
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} onClick={() => openRequest(row.values)}>
                                        {row.cells.map((cell, cellIndex) => {
                                            return (
                                                <td {...cell.getCellProps()} className='fixed-column'>
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
    )
}

