import React, {useContext, useEffect, useState} from 'react'

import { Context } from '../Utilities/Context'
import "./Settings.sass"
import InnerNav from './InnerNav'
import Profile from './Profile'
import Admins from './Admins'
import EditCompany from '../Dashboard2/EditCompany'
import Departments from '../Dashboard2/Departments'

const Settings = ({ firstname, lastname, mail, company, role, dept, }) => {
  const { user, setuser, id, setid, errorMessage, successMessage, view, setView } = useContext(Context);
  useEffect(()=>{
    console.log(view)
  },[view])
  return (
    <div className='setting'>
      <InnerNav/>
      <div className='sub_set'>
            {(() => {
              switch (view) {
                case "Profile":
                  return <Profile/>;
                case "Admins":
                  return <Admins company = {company}/>;
                case "EditCompany":
                  return <EditCompany/>;
                case "Departments":
                  return <Departments/>;
                default:
                  return null;
              }
            })()}
          </div>
    </div>
  )
}

export default Settings
