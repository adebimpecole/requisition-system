import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { auth, updateFCMToken, sendTokenToBackend } from "../config/firebase";

import "./Auth.sass";
import Nav from "./Nav";
import { Context } from "../Utilities/Context";

import { ToastContainer } from "react-toastify";

const Login2 = () => {
  let {
    user,
    setuser,
    id,
    setid,
    errorMessage,
    setpage,
    fcmToken,
    setfcmToken,
  } = useContext(Context);

  const navigate = useNavigate();
  const db = getFirestore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      errorMessage("Please fill in required fields");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;

          // Reference to the user's document in Firestore
          const userDocRef = collection(db, "users");
          const compDocRef = collection(db, "companies");

          const query1 = query(userDocRef, where("userId", "==", user.uid));
          const query2 = query(compDocRef, where("userId", "==", user.uid));

          getDocs(query1)
            .then((querySnapshot1) => {
              if (!querySnapshot1.empty) {
                // Retrieve the first document that matches the query from the 'users' collection
                const docSnapshot1 = querySnapshot1.docs[0];
                const userData = docSnapshot1.data();

                setuser(userData.first_name);
                setid(userData.userId);
                setfcmToken(userData.token);

                setpage("Home");
                navigate("/dashb");

                let tokenResult = updateFCMToken(userData.token);

                tokenResult
                  .then((result) => {
                    
                    if (result == null) {
                    } else {
                      // updates fcm token onchange
                      setfcmToken(result);
                      const collectedData = {
                        token: result,
                      };

                      const collectionRef = collection(db, "users");
                      const q = query(collectionRef, where("userId", "==", id));

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
                                console.error(
                                  "Error updating document:",
                                  error
                                );
                              });
                          });
                        })
                        .catch((error) => {
                          console.error("Error querying Firestore:", error);
                        });
                    }
                  })
                  .catch((error) => console.error("Error:", error));

                sendTokenToBackend(id, fcmToken);
              } else {
                // If no data is found in the 'users' collection, check the 'companies' collection
                getDocs(query2)
                  .then((querySnapshot2) => {
                    if (!querySnapshot2.empty) {
                      // Retrieve the first document that matches the query from the 'companies' collection
                      const docSnapshot2 = querySnapshot2.docs[0];
                      const companyData = docSnapshot2.data();
                      setuser(companyData.name);
                      setid(companyData.userId);
                      setpage("Dashboard");
                      navigate("/admindash");
                    } else {
                      errorMessage("No user found.");
                    }
                  })
                  .catch((error) => {
                    console.error("Error getting company data:", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Error getting user data:", error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;

          if (errorCode === "auth/invalid-login-credentials") {
            errorMessage("Invalid Email or Password");
          }
          if (errorCode === "auth/network-request-failed") {
            errorMessage("Network error");
          }
        });
    }
  };

  return (
    <div className="auth">
      <div className="auth_background">
        <div className="nav">
          <Nav />
        </div>
      </div>
      <div className="auth_content">
        <div className="auth_section">
          <h2 className="page_header">Log In</h2>
          <form>
            <label>
              Email *
              <input
                id="email-address"
                name="email"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password *
              <input
                id="password"
                name="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <div className="form_option">Reset password</div>
            <label>
              <input type="submit" value="Submit" onClick={onLogin} />
            </label>
          </form>

          <p className="auth_option">
            No account yet? <NavLink to="/signup2">Sign up</NavLink>
          </p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login2;
