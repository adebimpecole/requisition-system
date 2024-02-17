import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./Nav.sass";
import "../Authentication/Auth.sass";

import { generateCustomId, todaysDate } from "../config/functions";

import { Context } from "../Utilities/Context";
import { auth } from "../config/firebase";
import { newRequest } from "../config/functions";
import {
  addToFirestore,  
  fetchDataFromFirestore,
  updateArrayFirestore,
  uploadImage,
} from "../config/firebaseFunctions";

import { signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  getDoc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";

import { ToastContainer } from "react-toastify";
import Toastify from "toastify-js";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import emailjs from "@emailjs/browser";

import home from "../assets/home.svg";
import list from "../assets/list_alt.svg";
import set from "../assets/settings.svg";
import chart from "../assets/Group (2).svg";
import request from "../assets/Group (3).svg";
import people from "../assets/people.svg";
import link from "../assets/external-link.svg";
import newuser from "../assets/person_add_alt_1.svg";
import ilink from "../assets/insert_link.svg";
import iphoto from "../assets/insert_photo.svg";
import iattach from "../assets/attachment.svg";
import itrash from "../assets/trash.svg";
import iclose from "../assets/close.svg";

import home2 from "../assets/home copy.svg";
import list2 from "../assets/list_alt copy.svg";
import set2 from "../assets/settings copy.svg";
import chart2 from "../assets/Group (2) copy.svg";
import people2 from "../assets/people copy.svg";

const SideNav = ({ firstname, lastname, mail, company, role, dept }) => {
  const db = getFirestore();
  // getting the values stored in the usecontext hook
  const {
    user,
    setuser,
    id,
    setid,
    errorMessage,
    successMessage,
    setpage,
    page,
  } = useContext(Context);
  
  const imageRef = useRef(null);
  const titleRef = useRef("");
  const descRef = useRef("");
  const emailRef = useRef("");
  const the_companyRef = useRef("");
  const the_companyIDRef = useRef("");
  const countImgRef = useRef(0);

  const userDocRef = collection(db, "users");
  const compDocRef = collection(db, "companies");

  const query4 = query(userDocRef, where("userId", "==", id));

  useEffect(() => emailjs.init("SSs84it7yCrmBJnMt"), []);

  const onSubmit = async () => {
    // const the_role = document.querySelector('input[name="role"]:checked').value;
    if (emailRef.current == "") {
      errorMessage("Please enter the user email");
    } else {
      try {
        const serviceId = "service_t4divkd";
        const templateId = "template_o58zoow";

        await getDocs(query4).then((querySnapshot1) => {
          // Retrieve the first document that matches the query from the 'users' collection
          const docSnapshot1 = querySnapshot1.docs[0];
          const userData = docSnapshot1.data();
          the_companyRef.current = userData.company_name;

          const query5 = query(
            compDocRef,
            where("name", "==", the_companyRef.current)
          );
          getDocs(query5).then((querySnapshot1) => {
            // Retrieve the first document that matches the query from the 'users' collection
            const docSnapshot1 = querySnapshot1.docs[0];
            const userData = docSnapshot1.data();
            the_companyIDRef.current = userData.userId;
          });
        });
        await emailjs.send(serviceId, templateId, {
          sender: user,
          email: emailRef.current,
          link: `http://localhost:5173/signup?companyId=${the_companyIDRef.current}&role=requester`,
          role: "a Requester",
          company: the_companyRef.current,
        });
        Swal.fire({
          text: "Invite successfully sent!",
          customClass: {
            popup: "popup",
            htmlContainer: "container",
            confirmButton: "ok_button",
          },
        });
        the_companyRef.current = "";
        the_companyIDRef.current = "";
      } catch (error) {
        console.log(error);
      }
    }
  };


  // getting user input
  const catchInput = (e) => {
    titleRef.current = e;
  };

  const catchDesc = (e) => {
    descRef.current = e;
  };

  const catchEmail = (e) => {
    emailRef.current = e;
  };

  const Attachment = (the_div, the_input) => {
    var childElement = document.createElement("div");

    const file = the_input.files[0];
    console.log("File object:", file);

    var img = new Image(); //adding delete button
    img.src = `${iclose}`;
    img.onclick = function () {
      var parentElement = this.parentElement;
      parentElement.parentElement.removeChild(parentElement);
      countImgRef.current = countImgRef.current - 1;
    };

    var fileName = the_input.value.split("\\").pop(); // Extract just the file name
    childElement.innerHTML = `${fileName}`;

    imageRef.current = file;;
    console.log(the_input.files);

    countImgRef.current = countImgRef.current + 1;

    childElement.appendChild(img);
    the_div.appendChild(childElement);
  };

  // const handleFileChange = (event) => {
  //   console.log(event)
  //   const file = event.target.files[0];
  //   setImage(file);
  // };

  // handles request actions
  const DeleteReq = () => {
    Swal.close();
  };

  const SendReq = async (customId) => {
    if (titleRef.current == "" || descRef.current == "") {
      errorMessage("Cannot submit empty request");
    } else {
      let todays_date = todaysDate();
      let attachment = false;

      let image_url = "";

      if (countImgRef.current > 0) {
        attachment = true;
        console.log(imageRef.current)
        // upload image to firestore if an image was selected and get the url
        
        image_url = await uploadImage(imageRef.current, "request", id, customId);
      }
      try {
        let companyData = await fetchDataFromFirestore(
          "companies",
          "name",
          company
        );

        const newApprovers = (companyData.approvers).filter(item => item !== companyData.verificationAuthority);

        const requestData = {
          user_id: id,
          date: todays_date,
          title: titleRef.current,
          description: descRef.current,
          status: "pending",
          requset_id: customId,
          company: company,
          department: dept,
          is_attachment: attachment,
          approvalIndex: 0,
          approvers: newApprovers,
          verifier: companyData.verificationAuthority,
          messages: [],
          is_link: false,
          image_url: image_url,
        };

        await addToFirestore("requests", requestData);

        // notification
        let notificationId = generateCustomId("NOT_", 5);
        const messageToAdd = {
          message: "New Request for Approval",
          body: {
            reqId: customId,
            userId: id,
          },
          notificationId: notificationId,
          type: "request",
          status: "pending",
        };

        // send request notification to the first approver on the list
        updateArrayFirestore(
          "users",
          "email",
          companyData.approvers[0],
          "messages",
          messageToAdd
        );
        successMessage("Request submitted!");
      } catch (error) {
        console.error("Error querying Firestore:", error);
      }

      // newRequest(customId, id);

      Swal.close();

      titleRef.current = "";
      descRef.current = "";
      countImgRef.current = 0;
    }
  };

  const NewRequest = async () => {
    let companyId;

    const collection2Ref = collection(db, "companies");

    const q2 = query(collection2Ref, where("name", "==", company));

    const querySnapshot = await getDocs(q2);

    querySnapshot.forEach(async (doc) => {
      try {
        const companyDoc = await getDoc(doc.ref);

        if (companyDoc.exists()) {
          // Assuming emails are stored in a field called 'approvers' in the company document
          const emailsToCheck = companyDoc.data().approvers;

          // Assuming the users collection is called "users"
          const userCollectionRef = collection(db, "users");

          // Query users where the email is in the provided list
          const queryByEmails = query(
            userCollectionRef,
            where("email", "in", emailsToCheck)
          );

          const querySnapshot = await getDocs(queryByEmails);

          const foundEmails = querySnapshot.docs.map(
            (userDoc) => userDoc.data().email
          );

          // Check if all emails are found in the users collection
          const missingEmails = emailsToCheck.filter(
            (email) => !foundEmails.includes(email)
          );

          if (missingEmails.length > 0) {
            errorMessage("Approver Signup Required!");
          } else {
            let customId = generateCustomId("REQ_", 5);

            const the_html = ` 
            <div class='title_bar'> 
              New Request by ${firstname} ${lastname} 
              <img id='close' src= ${iclose} alt='alert_icon' style='cursor:pointer'/> 
            </div> 
            <input id="swal-input1" class="swal2-input" type="text" value="" autocomplete="off">
            <textarea id="swal-input2" class="swal2-input" value="" autocomplete="off"></textarea>
            <div id="attach_div" class="swal3-input"></div>
            <span class='last_div'>
              <span class='left_icons'>
                <button id='custom-button' class='button'>Send</button>
                <div id='attachment' class='fileinputs' >
                  <input type='file' class='file' id='file_field'/>
                  <div id='file_input'  class='fakefile'>
                    <img src= ${iattach} alt='alert_icon' style='cursor:pointer'/>
                  </div>
                </div>
                <div id='image_input' class='fileinputs' >
                  <input type='file' class='file' accept='image/*' id='our_image'/>
                  <div  class='fakefile'>
                    <img src= ${iphoto} alt='alert_icon' style='cursor:pointer'/>
                  </div>
                </div>
              </span>
              <img id='delete_request' src= ${itrash} style='cursor:pointer' alt='alert_icon'/>
            </span>`;

            const swal = Swal.fire({
              html: the_html,
              allowOutsideClick: false,
              showConfirmButton: false,
              customClass: {
                popup: "request_popup",
                htmlContainer: "container",
              },
            });
            // collect title
            const firstInput = document.getElementById("swal-input1");
            const inputListener = () => catchInput(firstInput.value);
            firstInput.addEventListener("input", inputListener);

            // collect description
            const secInput = document.getElementById("swal-input2");
            const input2Listener = () => catchDesc(secInput.value);
            secInput.addEventListener("input", input2Listener);

            // Import file
            const file_itself = document.getElementById("file_field");
            const fileDiv = document.getElementById("attach_div");
            file_itself.addEventListener("input", () =>
              Attachment(fileDiv, file_itself)
            );

            // Import image
            const image_itself = document.getElementById("our_image");
            image_itself.addEventListener("input", () =>
              Attachment(fileDiv, image_itself)
            );

            // Delete request
            const trashButton = document.getElementById("delete_request");
            trashButton.addEventListener("click", () => DeleteReq());

            // Close request
            const closeButton = document.getElementById("close");
            closeButton.addEventListener("click", () => DeleteReq());

            // submit request
            const customButton = document.getElementById("custom-button");
            customButton.addEventListener("click", () => SendReq(customId));

            // Import image
            const our_image_itself = document.getElementById("our_image");
            our_image_itself.addEventListener("change", handleFileChange);
          }
        } else {
          console.error(
            `Error: Company document with ID ${companyId} not found.`
          );
        }
      } catch (error) {
        console.error("Error checking emails:", error);
      }
    });
  };

  // invite user container
  const InviteUser = async () => {
    const swal = Swal.fire({
      html:
        "<div class='header_bar'>" +
        "<span class='close_container'>" +
        "<img id='close' src='" +
        iclose +
        "' alt='alert_icon' style='cursor:pointer'/>" +
        "</span>" +
        "<span class='big_heading'>" +
        "Invite User" +
        "</span>" +
        "<span class='lil_heading'>Enter member info</span>" +
        "</div>" +
        '<input id="email-input" class="email-input" type="email" value="" autocomplete="off">' +
        `<button id='invite-button' class='button'>Send Invite</button>`,
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: {
        popup: "invite_popup",
        htmlContainer: "invite_container",
      },
    });

    // collect email
    const emailInput = document.getElementById("email-input");
    const input3Listener = () => catchEmail(emailInput.value);
    emailInput.addEventListener("input", input3Listener);

    // Close request
    const closeButton = document.getElementById("close");
    closeButton.addEventListener("click", () => DeleteReq());

    // send invite
    const inviteButton = document.getElementById("invite-button");
    inviteButton.addEventListener("click", () => onSubmit());
  };

  // Signing out
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.href = "*";
        localStorage.clear();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="SideNav">
      <ul>
        <div onClick={handleLogout} className="sidenav_logo">
          Requisitor
        </div>
        <div className="nav_section">
          <div className="list_segment">
            <li
              onClick={() => setpage("Home")}
              className={`${page === "Home" ? "opened_tab" : ""}`}
            >
              {page === "Home" ? (
                <img src={home2} alt="nav_icon" className="nav_icon" />
              ) : (
                <img src={home} alt="nav_icon" className="nav_icon" />
              )}
              <span>Home</span>
            </li>
            {role == "requester" ? (
              <span></span>
            ) : (
              <>
                <li
                  onClick={() => setpage("Analytics")}
                  className={`${page === "Analytics" ? "opened_tab" : ""}`}
                >
                  {page === "Analytics" ? (
                    <img src={home2} alt="nav_icon" className="nav_icon" />
                  ) : (
                    <img src={chart} alt="nav_icon" className="nav_icon" />
                  )}
                  <span>Analytics</span>
                </li>
                <li
                  onClick={() => setpage("Records")}
                  className={`${page === "Records" ? "opened_tab" : ""}`}
                >
                  {page === "Records" ? (
                    <img src={list2} alt="nav_icon" className="nav_icon" />
                  ) : (
                    <img src={list} alt="nav_icon" className="nav_icon" />
                  )}
                  <span>Records</span>
                </li>
              </>
            )}
            <li
              onClick={() => setpage("Teams")}
              className={`${page === "Teams" ? "opened_tab" : ""}`}
            >
              {page === "Teams" ? (
                <img src={people2} alt="nav_icon" className="nav_icon" />
              ) : (
                <img src={people} alt="nav_icon" className="nav_icon" />
              )}
              <span>Team</span>
            </li>
            <li
              onClick={() => setpage("Requests")}
              className={`${page === "Requests" ? "opened_tab" : ""}`}
            >
              {page === "Requests" ? (
                <img src={list2} alt="nav_icon" className="nav_icon" />
              ) : (
                <img src={list} alt="nav_icon" className="nav_icon" />
              )}
              <span>Requests</span>
            </li>
          </div>
          <div className="list_segment">
            <span className="section_title">Actions</span>
            <li className="" id="first_one" onClick={NewRequest}>
              <img src={request} alt="nav_icon" className="nav_icon" />
              <span>New Request</span>
            </li>
            <li onClick={InviteUser}>
              <img src={newuser} alt="nav_icon" className="nav_icon" />
              <span>Invite User</span>
            </li>
          </div>
        </div>
      </ul>
      <ul>
        <li
          onClick={() => setpage("Settings")}
          className={`${page === "Settings" ? "opened_tab" : ""}`}
        >
          {page === "Settings" ? (
            <img src={set2} alt="nav_icon" className="nav_icon" />
          ) : (
            <img src={set} alt="nav_icon" className="nav_icon" />
          )}
          <span>Settings</span>
        </li>
        <li onClick={handleLogout}>
          <img src={link} alt="nav_icon" className="nav_icon" />
          <span>Log Out</span>
        </li>
      </ul>
      <ToastContainer />
    </div>
  );
};

export default SideNav;
