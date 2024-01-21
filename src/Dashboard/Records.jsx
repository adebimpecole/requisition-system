import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import iclose from '../assets/close.svg';
import { Context } from '../Utilities/Context';

import '../Dashboard2/Company.sass';
import './Dashboard.sass';
import "../Dashboard2/Home.sass";
import './Records.sass';

const Records = ({ firstname, lastname, mail, company, role, dept }) => {
  const { user, setuser, id, setid, errorMessage } = useContext(Context);
  const db = getFirestore();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [selectedDepartment, setSelectedDepartment] = useState('Department');

  const options = [
    { value: 'Status', label: 'Status' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Pending', label: 'Pending' },
  ];

  const options2 = [
    { value: 'Department', label: 'Department' },
    { value: 'Audit', label: 'Audit' },
    { value: 'Finance', label: 'Finance' },
    { value: 'HR', label: 'HR' },
    { value: 'Account', label: 'Account' },
  ];

  // Define the ColumnFilter component here
  const ColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) => {
    const count = preFilteredRows.length;

    const [filterInput, setFilterInput] = useState(filterValue);

    setFilter(filterInput || undefined, id);
  };

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
      Header: 'Requester',
      accessor: 'requester',
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


// get requests
  useEffect(() => {
    setIsLoading(true);
    const userCollectionRef = collection(db, 'requests');
    const query4 = query(userCollectionRef, where('company', '==', company));

    getDocs(query4)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = [];
          querySnapshot.forEach((doc) => {
            userData.push(doc.data());
          });
          setData(userData);
        } else {
          
        }
      })
      .catch((error) => {
        console.error('Error getting user data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [company]);

// set requester name for each request
  const updateRequester = (rowIndex, newRequesterValue) => {
    const updatedData = [...data];
    updatedData[rowIndex].requester = newRequesterValue;
    setData(updatedData);
  };

  // get requester name from firebase for each request
  useEffect(() => {
    data.forEach((item, index) => {
      const userCollectionRef = collection(db, 'users');
      const query6 = query(userCollectionRef, where('userId', '==', data[index].user_id));

      getDocs(query6)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const docSnapshot2 = querySnapshot.docs[0];
            const userData = docSnapshot2.data();
            updateRequester(index, `${userData.first_name} ${userData.last_name}`);
          } else {
            console.log('No user data found for this company name.');
          }
        })
        .catch((error) => {
          console.error('Error getting user data:', error);
        });
    });
  }, [data]);

  const columns = useMemo(() => COLUMNS, []);

  // close request container
  const CloseReq = () => {
    Swal.close();
  };

  // request container
  const openRequest = (e) => {
    const swal = Swal.fire({
      html:
        "<div class='the_title'>" +
        e.values.title +
        "<img id='close' src='" +
        iclose +
        "' alt='alert_icon' style='cursor:pointer'/>" +
        '</div>' +
        '<div class="to_who">' +
        'To - Mary' +
        '</div>' +
        '<div class="the_description" >' +
        data[e.id].description +
        '</div>' +
        '<div class="other_details">' +
        '<span>Sent on the' +
        e.values.date +
        '</span>' +
        '<span>Received on the' +
        e.values.date +
        '</span>' +
        '<span>Seen by ' +
        e.values.date +
        '</span>' +
        '<span>Status - ' +
        e.values.status +
        '</span>' +
        '</div>' +
        '</span>',
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: {
        popup: 'popup',
        htmlContainer: 'container',
      },
    });

    const closeButton = document.getElementById('close');
    closeButton.addEventListener('click', () => CloseReq());
  };

  const colourStyles = {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: state.isSelected ? '#e2f3fd' : '#f4f4f4',
      border: 'none',
    }),
  };

  const filterRequester = (rows, id, filterValue) => {
    return rows.filter((row) => {
      const rowValue = row.values.requester.toLowerCase();
      return rowValue.includes(filterValue.toLowerCase());
    });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter, // For global filtering
  } = useTable(
    {
      columns,
      data,
    },
    useFilters, // Add this hook for filtering
    useGlobalFilter, // Add this hook for global filtering
  );

  const setFilter = state.globalFilter;
  useEffect(() => {
    setGlobalFilter(selectedStatus);
  }, [selectedStatus]);

  return (
    <div className='records'>
      <div className='home_intro'>
        <div className='home_tab'>
          <div className='welcome'>
            {firstname} {lastname}
          </div>
          <div className='welcome_text'>{dept} Department</div>
        </div>

        <div className='the_table'>
          <div className='table_filters'>
            <span> All</span>
            <Select
              options={options}
              styles={colourStyles}
              defaultValue={options[0]}
              value={selectedStatus}
              onChange={(selectedOption) => setSelectedStatus(selectedOption.value)}
            />
            <Select
              options={options2}
              styles={colourStyles}
              defaultValue={options2[0]}
              value={selectedDepartment}
              onChange={(selectedOption) => setSelectedDepartment(selectedOption.value)}
            />
          </div>
          {isLoading ? (
            <p>Loading data...</p>
          ) : (
            <>
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()} >
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
                      <tr onClick={() => openRequest(row)} key={index}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
  );
};

export default Records;
