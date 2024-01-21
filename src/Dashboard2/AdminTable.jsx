import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useTable } from "react-table";

import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc, orderBy, limitToLast  } from 'firebase/firestore';

import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

import { Context } from '../Utilities/Context';
import '../Dashboard2/Company.sass';
import '../Dashboard/Table.sass'

import iclose from "../assets/close.svg"

const AdminTable = () => {
        
    const db = getFirestore();
    
    const { user, id, errorMessage } = useContext(Context);
    
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
      const query4 = query(userCollectionRef, where('company', '==', user), orderBy('date'), limitToLast(7));
    
      getDocs(query4)
          .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                  const userData = [];
                  querySnapshot.forEach((doc) => {
                      userData.push(doc.data());
                  });
                  setData(userData);
              } else {
                  console.log('No user data found for this company.');
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
    
    const CloseReq = () => {
      Swal.close()
    }
    
    const openRequest = (e) => {
      console.log(e)
      console.log(e.values.date)
      const swal = Swal.fire({
          html:
              "<div class='the_title'>" +
              e.values.title +
              "<img id='close' src='" + iclose + "' alt='alert_icon' style='cursor:pointer'/>" +
              "</div>" +
              '<div class="to_who">' +
              'To - Mary' +
              '</div>' +
              '<div class="the_description" >' +
              e.values.description +
              '</div>' +
              '<div class="other_details">' +
              '<span>Sent on the' + e.values.date + '</span>' +
              '<span>Received on the' + e.values.date + '</span>' +
              '<span>Seen by ' + e.values.date + '</span>' +
              '<span>Status - ' + e.values.status + '</span>' +
              '</div>' +
              "</span>",
          allowOutsideClick: false,
          showConfirmButton: false,
          customClass: {
              popup: 'popup',
              htmlContainer: 'container',
          },
      });
      // Close request
      const closeButton = document.getElementById('close');
      closeButton.addEventListener('click', () => CloseReq());
    }
  return (
        <div className="the_table">
            <div className='table_name'>Recent Requests <span>View All</span></div>
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
                                    <tr {...row.getRowProps()} onClick={() => openRequest(row)}>
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

export default AdminTable
