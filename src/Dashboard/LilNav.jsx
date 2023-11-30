import React, { useContext, useEffect, useState } from 'react'

import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc } from 'firebase/firestore';

import "./Nav.sass"
import { Context } from '../Utilities/Context';

import bell from "../assets/notifications.svg"
import profile from "../assets/profile.svg"



const LilNav = ({ firstname, lastname, mail, company, role, dept, url }) => {

  const db = getFirestore();

  const { user, setuser, id, setid, errorMessage, successMessage, page, setpage } = useContext(Context);
  const [the_role, setthe_role] = useState();

  useEffect(() => {
    // Reference to the user's document in Firestore
    const userDocRef = collection(db, 'users');
    const compDocRef = collection(db, 'companies');

    const query1 = query(userDocRef, where("userId", "==", id));
    const query2 = query(compDocRef, where("userId", "==", id));

    getDocs(query1).then((querySnapshot1) => {
      if (!querySnapshot1.empty) {
        // Retrieve the first document that matches the query from the 'users' collection
        const docSnapshot1 = querySnapshot1.docs[0];
        const userData = docSnapshot1.data();
        setthe_role(userData.role);

      } else {
        // If no data is found in the 'users' collection, check the 'companies' collection
        getDocs(query2).then((querySnapshot2) => {
          if (!querySnapshot2.empty) {
            // Retrieve the first document that matches the query from the 'companies' collection
            const docSnapshot2 = querySnapshot2.docs[0];
            const companyData = docSnapshot2.data();
            setthe_role(companyData.role);;
          } else {
            errorMessage('No user found.');
          }
        }).catch((error) => {
          console.error('Error getting company data:', error);
        });
      }
    })
  }, []);

  return (
    <div className='LilNav'>
      <div className='nav_title'>{page}</div>
      <ul>
        <li>
          {the_role === "Admin" ? (
            <span></span>
          ) : (
            url ? <img src={url} alt="My image" className='profile_picture' /> : <img src={profile} alt='profile_icon' className='profile_icon' />
          )}
          <span className='dash_name'>{firstname} {lastname}</span>
        </li>
        <li><img src={bell} alt='bell' className='lilnav_icon' /></li>
      </ul>
    </div>
  )
}

export default LilNav
