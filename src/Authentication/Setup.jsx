import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

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
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import "./Auth.sass";
import Nav from "./Nav";
import { Context } from "../Utilities/Context";

import emailjs from "@emailjs/browser";

import add from "../assets/add.svg";


const Setup = () => {
  let { user, setuser, id, setid, errorMessage } = useContext(Context);

  const navigate = useNavigate();
  const db = getFirestore();

  const [myApprovers, setMyApprovers] = useState([]);
  const [Mail, setMail] = useState("");
  const emailRef = useRef("");

  const compDocRef = collection(db, "companies");
  const query4 = query(compDocRef, where("userId", "==", id));

  useEffect(() => emailjs.init("SSs84it7yCrmBJnMt"), []);

  useEffect(() => {
    emailRef.current = Mail;
  }, [Mail]);

  const onInvite = async () => {
    if (emailRef.current == "") {
      errorMessage("Please enter the user email");
    } else {
      setMyApprovers((prevData) => [...prevData, emailRef.current]);
      try {
        const serviceId = "service_t4divkd";
        const templateId = "template_o58zoow";

        const querySnapshot1 = await getDocs(query4);

        querySnapshot1.forEach(async (doc) => {
          try {
            const docRef = doc.ref;

            await updateDoc(docRef, {
              approvers: arrayUnion(emailRef.current),
            });
          } catch (error) {
            console.error(
              "Error adding document to 'requests' collection:",
              error
            );
          }
        });
        await emailjs.send(serviceId, templateId, {
          sender: user,
          email: emailRef.current,
          link: `https://marysrequisitionapp.netlify.app/signup?companyId=${id}&role=approver`,
          role: "an Approver",
          company: user,
        });
        emailRef.current = "";
      } catch (error) {
        console.log(error);
      }
    }
    setMail("")
  };

  const moveOn = () => {
    navigate("/setup2");
  }

  return (
    <div className="auth">
      <div className="auth_background">
        <div className="nav">
          <Nav />
        </div>
      </div>
      <div className="auth_content">
        <div className="auth_section">
          <h2 className="page_header auths_header">
            Set Up Your Company Approvers
          </h2>
          <div className="add_section">
            <div className="add_title">Add Approvers</div>
            <div className="add_note">
              Kindly input the emaill of the approvers and press enter to invite
              them to your team
            </div>
            <div className="add_frame">
              <label>
                <input
                  type="text"
                  placeholder="Enter approver email"
                  value={Mail}
                  onChange={(e) => setMail(e.target.value)}
                />
                <div className="add_button" onClick={onInvite}>
                  {" "}
                  <img src={add} alt="add_icon" />
                  Send invite
                </div>
              </label>
            </div>
            <div className="added">
              <div className="added_approvers"> Invited Approvers</div>
              {myApprovers ? (
                <>
                  {myApprovers.map((item, index) => (
                    <div className="added_email" key={index}>
                      <div className="added_name">{item}</div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="added_tab">No invited Approvers</div>
              )}
            </div>
          </div>

          <div className="button_section">
            <div className="save_button" onClick={moveOn}>Next </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
