import React, { useContext, useEffect, useState } from "react";

import { Context } from "../Utilities/Context";
import "../Dashboard/Settings.sass";
import InnerNav from "../Dashboard/InnerNav";
import Profile from "../Dashboard/Profile";
import Admins from "../Dashboard/Admins";
import EditCompany from "./EditCompany";
import Departments from "./Departments";

const AdminSettings = () => {
  const {
    user,
    setuser,
    id,
    setid,
    errorMessage,
    successMessage,
    view,
    setView,
  } = useContext(Context);
  return (
    <div className="setting">
      <InnerNav />
      <div className="sub_set">
        {(() => {
          switch (view) {
            case "Profile":
              return <Profile />;
            case "Admins":
              return <Admins company={user} />;
            case "EditCompany":
              return <EditCompany />;
            case "Departments":
              return <Departments />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default AdminSettings;
