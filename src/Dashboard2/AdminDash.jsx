import React, { useContext, useState, useEffect } from "react";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";

import Home from "./Home";
import SideNav from "../Dashboard/SideNav";
import Company from "./Company";
import "../Dashboard/Dashboard.sass";
import AdminSideNav from "./AdminSideNav";
import Settings from "../Dashboard/Settings";
import LilNav from "../Dashboard/LilNav";
import AdminRecords from "./AdminRecords";
import Analytics from "../Dashboard/Analytics";

import { Context } from "../Utilities/Context";
import AdminSettings from "./AdminSettings";

const AdminDash = () => {
  const db = getFirestore();

  const {
    user,
    setuser,
    id,
    setid,
    errorMessage,
    successMessage,
    page,
    setpage,
  } = useContext(Context);

  const [useremail, setUseremail] = useState("");
  const [usercomapny, setUsercompany] = useState("");
  const [userrole, setUserrole] = useState("");


  useEffect(() => {
    // Signed in
    // Reference to the user's document in Firestore
    const userDocRef = collection(db, "companies");

    const query3 = query(userDocRef, where("userId", "==", id));

    getDocs(query3)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Retrieve the first document that matches the query
          const docSnapshot = querySnapshot.docs[0];
          const userData = docSnapshot.data();

          setUserrole("admin");
          setUseremail(userData.email);
          setUsercompany(userData.name);
          console.log(userData.name)
        } else {
          errorMessage("No user data found.");
        }
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  }, []);
console.log(userrole)
  const propsGroup = {
    mail: useremail,
    company: usercomapny,
    role: userrole,
  };
  return (
    <div className="Dashboard">
      <>
      {
        userrole == "admin" ? (
          <>
        <AdminSideNav />
        <div className="sub_dash">
          <LilNav {...propsGroup}/>
          {(() => {
            switch (page) {
              case "Dashboard":
                return <Home />;
              case "Analytics":
                return <Analytics {...propsGroup} />;
              case "Records":
                return <AdminRecords />;
              case "Company":
                return <Company />;
              case "Settings":
                return <AdminSettings />;
              default:
                return null;
            }
          })()}
        </div>
          </>
        ) : (<span>Loading</span>)
      }
      </>
    </div>
  );
};

export default AdminDash;
