import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
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

import "./Auth.sass";
import Nav from "./Nav";

import { Context } from "../Utilities/Context";

const Signup = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const db = getFirestore();

  let { user, setuser, id, setid, setpage, setrole } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userrole, setuserrole] = useState("");
  const [urlcompanyName, seturlCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dept, setDept] = useState("");
  const [departments, setDepartments] = useState();

  const companyId = new URLSearchParams(location.search).get("companyId");

  useEffect(() => {
    setuserrole(new URLSearchParams(location.search).get("role"));
    const companyIdFromUrl = companyId;

    // Reference to your Firestore collection where user data is stored
    const userCollectionRef = collection(db, "companies");

    // Create a query to find documents where companyId matches companyIdFromUrl
    const query2 = query(
      userCollectionRef,
      where("userId", "==", companyIdFromUrl)
    );

    getDocs(query2)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Retrieve the first document that matches the query
          const docSnapshot = querySnapshot.docs[0];
          const userData = docSnapshot.data();
          seturlCompanyName(userData.name);
        } else {
          console.log("No user data found for this companyId.");
        }
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });

    let the_companyName;
    async function fetchData() {
      if (companyIdFromUrl !== "") {
        try {
          // Reference to your Firestore collection where user data is stored
          const userCollectionRef = collection(db, "departments");

          // Create a query to find documents where userId matches companyCode
          const query2 = query(
            userCollectionRef,
            where("companyId", "==", companyIdFromUrl)
          );
          const querySnapshot = await getDocs(query2);

          if (!querySnapshot.empty) {
            // Retrieve the first document that matches the query
            const docSnapshot = querySnapshot.docs[0];
            const userData = docSnapshot.data();

            // Set the resolved company name
            the_companyName = userData;
            setDepartments(userData.department);
            console.log(userData);
          } else {
            errorMessage("No user data found for this company ID.");
            return false;
          }
        } catch (error) {
          console.error("Error checking company code:", error);
        }
      } else {
      }
    }
    fetchData();
  }, [companyId, db]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const the_user = userCredential.user;
      const userId = the_user.uid;

      // Add the users name to Firestore
      const usersCollectionRef = collection(db, "users");
      await addDoc(usersCollectionRef, {
        last_name: lastName.toLowerCase(),
        first_name: firstName.toLowerCase(), // Use the correct field names
        userId: userId,
        email: email,
        password: password,
        role: userrole,
        company_name: urlcompanyName,
        department: dept.toLowerCase(),
        messages: [],
      });

      // const fcmToken = await admin.messaging().getToken(userRecord.uid);

      // // Save the FCM token to the Firestore database
      // await db.collection("users").doc(userId).set({
      //   fcmToken: fcmToken,
      // });
      // console.log(fcmToken)

      setuser(firstName);
      setid(userId);
      setrole(userrole)
      setpage("Home");
      navigate("/dashb");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      // Handle registration errors
    }
  };

  return (
    <div className="signup auth">
      <div className="auth_background">
        <div className="nav">
          <Nav />
        </div>
      </div>
      <div className="auth_content">
        <div className="auth_section">
          <h2 className="page_header">Sign Up</h2>
          <form>
            <div className="required">* Required Fields</div>
            <div className="sub_form">
              <label>
                First Name *
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label>
                Last Name *
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
            <label>
              Company Name
              <input type="text" value={urlcompanyName} readOnly={true} />
            </label>
            <label>
              Email *
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password *
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              Department
              <select
                id="department"
                name="department"
                onChange={(e) => setDept(e.target.value)}
                value={dept}
              >
                {departments ? (
                  <>
                    <option value="loading">-Select Department-</option>
                    {departments.map((the_dept, index) => (
                      <option value={the_dept} key={index}>
                        {the_dept}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="loading">Loading ...</option>
                )}
              </select>
            </label>
            <label>
              <input type="submit" value="Submit" onClick={onSubmit} />
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
