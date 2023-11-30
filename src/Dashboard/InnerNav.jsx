import React, {useContext} from 'react'

import { Context } from '../Utilities/Context';
import "./InnerNav.sass"

const InnerNav = () => {
  const {view, setView} = useContext(Context);

    return (
        <div className='innernav'>
            <ul>
                <li onClick={()=>setView("Profile")} className= {`${view === "Profile" ? 'selected_tab' : ''}`}><span>Profile</span></li>
                <li onClick={()=>setView("Admins")} className= {`${view === "Admins" ? 'selected_tab' : ''}`}><span>Members</span></li>
                <li ><span>Budget</span></li>
                <li onClick={()=>setView("Departments")} className= {`${view === "Departments" ? 'selected_tab' : ''}`}><span>Department</span></li>
                <li onClick={()=>setView("EditCompany")} className= {`${view === "EditCompany" ? 'selected_tab' : ''}`}><span>Company</span></li>
            </ul>
        </div>
    )
}

export default InnerNav
