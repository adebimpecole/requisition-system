import React, {useContext} from 'react'

import Home from './Home'
import SideNav from '../Dashboard/SideNav'
import Company from './Company'
import "../Dashboard/Dashboard.sass"
import AdminSideNav from './AdminSideNav'
import Settings from '../Dashboard/Settings'
import LilNav from '../Dashboard/LilNav'
import AdminRecords from './AdminRecords'

import { Context } from '../Utilities/Context';
import AdminSettings from './AdminSettings'

const AdminDash = () => {
  const {user, setuser, id, setid, page} = useContext(Context);
  return (
    <div className='Dashboard'>
      <>
        <AdminSideNav />
        <div className='sub_dash'>
          <LilNav/>
          {(() => {
            switch (page) {
              case "Dashboard":
                return <Home/>;
              case "Records":
                return <AdminRecords/>;
              case "Company":
                return <Company/>;
              case "Settings":
                return <AdminSettings/>;
              default:
                return null;
            }
          })()}
        </div>
      </>
    </div>
  )
}

export default AdminDash
