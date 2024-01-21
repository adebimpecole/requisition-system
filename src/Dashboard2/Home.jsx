import React, { useContext, useEffect, useMemo, useState } from 'react'
import Table from '../Dashboard/Table';
import './Home.sass';
import emailjs from '@emailjs/browser';

import { Context } from '../Utilities/Context';

import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc } from 'firebase/firestore';

import approve from "../assets/Group.svg";
import wait from "../assets/Group (1).svg"
import pend from "../assets/Vector.svg"
import decline from "../assets/Vector (1).svg"
import AdminTable from './AdminTable';


const Home = () => {

  const { user, setuser, id, setid, errorMessage } = useContext(Context);

  const db = getFirestore();
  useEffect(() => emailjs.init('SSs84it7yCrmBJnMt'), []);

  const [email, setEmail] = useState('');
  const [requests, setRequests] = useState('');
  const [pending, setPending] = useState('');
  const [complete, setComplete] = useState('');
  const [rejected, setRejected] = useState('');



  useEffect(() => {
    const userCollectionRef = collection(db, 'requests');
    const query8 = query(userCollectionRef, where('company', '==', user));

    getDocs(query8)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const itemCount = querySnapshot.size;
              setRequests(itemCount);
            } else {
                console.log('No user data found for this company name.');
            }
        })
        .catch((error) => {
            console.error('Error getting user data:', error);
        })
}, [user]);

  return (
    <div className='Home'>
          <div className='home_tab'>
            <div className='home_intro'>
              <div className='welcome'>{user}</div>
              <div className='welcome_text'>Department</div>
            </div>
            <div className='home_info'>
              <div className='info_card'>
                <img src={pend} alt='home_icon' />
                <div className='card_number'>0</div>
                <div className='card_label'>Pending requests</div>
              </div>
              <div className='info_card'>
                <img src={approve} alt='home_icon' />
                <div className='card_number'>0</div>
                <div className='card_label'>Completed requests</div>
              </div>
              <div className='info_card'>
                <img src={decline} alt='home_icon' />
                <div className='card_number'>0</div>
                <div className='card_label'>Rejected requests</div>
              </div>
              <div className='info_card'>
                <img src={wait} alt='home_icon' />
                <div className='card_number'>{requests}</div>
                <div className='card_label'>Total Requests</div>
              </div>
            </div>
          </div>
          <AdminTable/>
        </div>
  );
};

export default Home;
