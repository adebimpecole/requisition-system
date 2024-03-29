import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  auth,
  messaging,
  getFCMToken,
  updateFCMToken,
} from "../config/firebase"; // Ensure messaging and getFCMToken are exported correctly

import Nav from "./Nav";
import "./Auth.sass";
import { Context } from "../Utilities/Context";

import { ToastContainer } from "react-toastify";

const SignupB = () => {
  const navigate = useNavigate();
  const db = getFirestore();

  let { user, setuser, id, setid, errorMessage, setpage, setfcmToken } =
    useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dept, setDept] = useState("");

  const [departments, setDepartments] = useState();

  // Request permission and retrieve FCM token (assuming messaging is initialized correctly)
  useEffect(() => {
    // Check if messaging is available and permission can be requested
    if (messaging && messaging.onTokenRefresh) {
      try {
        // Request permission for notifications
        messaging
          .getToken()
          .then((currentToken) => {
            if (currentToken) {
              console.log("FCM token:", currentToken);
            } else {
              console.log(
                "No Instance ID token available. Request permission to generate one."
              );
              return messaging.requestPermission();
            }
          })
          .then(() => {
            console.log("Notification permission granted.");
            // Proceed with other actions after permission is granted
          })
          .catch((error) => {
            console.log("Unable to get permission to notify.", error);
          });
      } catch (error) {
        console.error("Error requesting permission:", error);
      }
    }
  }, []);

  // Function to check if the company code is valid

  const onSubmit2 = async (e) => {
    e.preventDefault();
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (
      firstName == "" ||
      lastName == "" ||
      companyCode == "" ||
      email == "" ||
      password == "" ||
      dept == ""
    ) {
      errorMessage("Please fill in required fields");
    } else if (!email.match(validRegex)) {
      errorMessage("Enter a valid email address!");
    } else {
      // Check if the company code is valid (this can be a separate function)
      let isCompanyCodeValid;
      let the_companyName;

      try {
        // Reference to your Firestore collection where user data is stored
        const userCollectionRef = collection(db, "companies");

        // Create a query to find documents where userId matches companyCode
        const query2 = query(
          userCollectionRef,
          where("userId", "==", companyCode)
        );
        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {
          // Retrieve the first document that matches the query
          const docSnapshot = querySnapshot.docs[0];
          const userData = docSnapshot.data();

          // Set the resolved company name
          the_companyName = userData.name;
          console.log(userData.name);
          isCompanyCodeValid = true;
        } else {
          errorMessage("No user data found for this company code.");
          return false;
        }
      } catch (error) {
        console.error("Error checking company code:", error);
        isCompanyCodeValid = false; // Handle errors as needed
      }
      if (isCompanyCodeValid) {
        try {
          // Check if companyName is not empty
          if (the_companyName) {
            // Create a new user with email and password
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
  
            const user = userCredential.user;
            const userId = user.uid;
            // Add the user's registration data to Firestore
            const usersCollectionRef = collection(db, "users");
            await addDoc(usersCollectionRef, {
              first_name: firstName.toLowerCase(), // Use the correct field names
              last_name: lastName.toLowerCase(),
              email: email,
              password: password,
              role: "requester",
              company_name: the_companyName, // This should be the resolved company name
              department: dept.toLowerCase(),
              userId: userId,
              messages: [],
            });
            let the_token = await getFCMToken(userId);

            // collects user fcm token
            const collectedData = {
              token: the_token,
            };

            const collectionRef = collection(db, "users");
            const q = query(collectionRef, where("userId", "==", userId));

            getDocs(q)
              .then((querySnapshot) => {
                querySnapshot.forEach((docSnap) => {
                  // Found a document that matches the criteria
                  const docRef = doc(db, "users", docSnap.id);

                  // Update the document
                  updateDoc(docRef, collectedData)
                    .then(() => {
                      console.log("Document updated successfully");
                    })
                    .catch((error) => {
                      console.error("Error updating document:", error);
                    });
                });
              })
              .catch((error) => {
                console.error("Error querying Firestore:", error);
              });

            const ws = new WebSocket(`ws://localhost:8080?userId=${userId}`);

            ws.onopen = () => {
              console.log("WebSocket connection opened");

              // Start sending messages or perform actions upon successful connection
              // Example: ws.send('Hello, WebSocket Server!');
            };

            ws.onmessage = (event) => {
              console.log("Received message:", event.data);
              // Handle incoming messages from the WebSocket server
            };

            ws.onclose = () => {
              console.log("WebSocket connection closed");
              // Handle WebSocket connection close event
            };

            ws.onerror = (error) => {
              console.error("WebSocket error:", error);
              // Handle WebSocket errors
            };

            setfcmToken(the_token);
            setuser(firstName);
            setid(userId);
            setpage("Home");
            navigate("/dashb");
          } else {
            console.log("Company name is missing.");
            // Handle the case where the company name is missing
          }
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
          // Handle registration errors
        }
      } else {
        errorMessage("Invalid company code");
        // Handle invalid company code error, e.g., show an error message to the user
      }
    }
  };

  useEffect(() => {
    let the_companyName;
    async function fetchData() {
      if (companyCode !== "") {
        try {
          // Reference to your Firestore collection where user data is stored
          const userCollectionRef = collection(db, "departments");

          // Create a query to find documents where userId matches companyCode
          const query2 = query(
            userCollectionRef,
            where("companyId", "==", companyCode)
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
          isCompanyCodeValid = false; // Handle errors as needed
        }
      } else {
      }
    }
    fetchData();
  }, [companyCode]);

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
              Company Code *
              <input
                type="text"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
              />
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
              <input type="submit" value="Submit" onClick={onSubmit2} />
            </label>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupB;
