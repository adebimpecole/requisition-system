import React, { useContext, useEffect, useMemo, useState } from 'react'

import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc } from 'firebase/firestore';

import approve from "../assets/Group.svg";
import wait from "../assets/Group (1).svg"
import pend from "../assets/Vector.svg"
import decline from "../assets/Vector (1).svg"

import "../Dashboard2/Home.sass"
import { Context } from '../Utilities/Context';
import Table from './Table';

const UserHome = ({firstname, lastname, mail, company, role, dept,}) => {
  const { user, setuser, id, setid, errorMessage } = useContext(Context);

  const db = getFirestore();

  return (
        <div className='Home'>
          <div className='home_tab'>
            <div className='home_intro'>
              <div className='welcome'>Welcome, {firstname}</div>
              <div className='welcome_text'>{dept} Department</div>
            </div>
            <div className='home_info'>
              <div className='info_card'>
                <img src={pend} alt='home_icon' />
                <div className='card_number'>3</div>
                <div className='card_label'>Pending requests</div>
              </div>
              <div className='info_card'>
                <img src={approve} alt='home_icon' />
                <div className='card_number'>31</div>
                <div className='card_label'>Approved requests</div>
              </div>
              <div className='info_card'>
                <img src={decline} alt='home_icon' />
                <div className='card_number'>13</div>
                <div className='card_label'>Rejected requests</div>
              </div>
              <div className='info_card'>
                <img src={wait} alt='home_icon' />
                <div className='card_number'>3</div>
                <div className='card_label'>Awaiting Approval</div>
              </div>
            </div>
          </div>
          <Table />
        </div>
  )
}

export default UserHome
