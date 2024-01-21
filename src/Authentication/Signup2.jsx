import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import { Context } from "../Utilities/Context";
import Nav from "./Nav";
import "./Auth.sass";

import { ToastContainer } from "react-toastify";

const Signup2 = () => {
  let { user, setuser, id, setid, errorMessage, setpage } = useContext(Context);

  const navigate = useNavigate();

  const db = getFirestore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_pass, setConfirm_pass] = useState("");
  const [companyName, setCompanyName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      errorMessage("Please fill in required fields");
    } else {
      if (password == confirm_pass) {
        try {
          // Create a new user with email and password
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const the_user = userCredential.user;
          const userId = the_user.uid;

          // Add the company name to Firestore
          const companiesCollectionRef = collection(db, "companies");
          await addDoc(companiesCollectionRef, {
            name: companyName.toLowerCase(),
            userId: userId,
            role: "admin",
            email: email,
            password: password,
          });


          setuser(companyName);
          setid(userId);

          setpage("Dashboard");
          navigate("/authenticate");
        } catch (error) {
          const errorCode = error.code;
          const error_message = error.message;
          console.error(errorCode, error_message);
          // Handle registration errors
        }
      } else {
        console.log("error!");
        errorMessage("Passwords do not match");
      }
    }
  };

  return (
    <div className="signup2 auth">
      <div className="auth_background">
        <div className="nav">
          <Nav />
        </div>
      </div>
      <div className="auth_content">
        <div className="auth_section">
          <h2 className="page_header">Company Sign Up</h2>
          <form>
            <label>
              Company Name *
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </label>
            <label>
              Email *
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password *
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirm Password *
              <input
                type="password"
                value={confirm_pass}
                onChange={(e) => setConfirm_pass(e.target.value)}
                required
              />
            </label>
            <div className="checkbox_wrapper">
              <input type="checkbox" id="terms" name="terms" />
              <label htmlFor="terms" className="checkbox_label">
                I agree to the{" "}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>
              </label>
            </div>
            <label>
              <input type="submit" value="Sign up" onClick={onSubmit} />
            </label>
          </form>
          <p className="auth_option">
            Already have an account? <NavLink to="/login">Sign in</NavLink>
          </p>
        </div>
      </div>
      <ToastContainer className="toast" />
    </div>
  );
};

export default Signup2;
