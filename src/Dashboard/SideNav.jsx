import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./Nav.sass";
import { Context } from "../Utilities/Context";
import "../Authentication/Auth.sass";

import { signOut } from "firebase/auth";
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
import 'firebase/functions';
import {firebase} from 'firebase/app';



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

  const titleRef = useRef("");
  const descRef = useRef("");
  const emailRef = useRef("");
  const the_companyRef = useRef("");
  const the_companyIDRef = useRef("");
  const countImgRef = useRef(0);

  const userDocRef = collection(db, "users");
  const compDocRef = collection(db, "companies");

  const query4 = query(userDocRef, where("userId", "==", id));

  useEffect(() => {}, [id]);

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
  const [email, setEmail] = useState("");

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

    var img = new Image(); //adding delete button
    img.src = `${iclose}`;
    img.onclick = function () {
      var parentElement = this.parentElement;
      parentElement.parentElement.removeChild(parentElement);
      countImgRef.current = countImgRef.current - 1;
    };

    var fileName = the_input.value.split("\\").pop(); // Extract just the file name
    childElement.innerHTML = `${fileName}`;

    countImgRef.current = countImgRef.current + 1;

    childElement.appendChild(img);
    the_div.appendChild(childElement);
  };

  // function that generates custom id for requests
  function generateCustomId(prefix, length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let customId = prefix;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      customId += characters.charAt(randomIndex);
    }

    return customId;
  }

  // handles request actions
  const DeleteReq = () => {
    Swal.close();
  };

  const SendReq = async () => {
    const customId = generateCustomId("REQ_", 5);

    if (titleRef.current == "" || descRef.current == "") {
      errorMessage("Cannot submit empty request");
    } else {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const date = today.getDate();
      const the_date = `${month}/${date}/${year}`;

      let attachment = false;
      if (countImgRef.current > 0) {
        attachment = true;
      }
      console.log(countImgRef.current);

      const functions = firebase.functions();
      const triggerFunction = functions.httpsCallable('triggerApprovalRequest');
      await triggerFunction({
        user_id: id,
        date: the_date,
        title: titleRef.current,
        description: descRef.current,
        status: "pending",
        requset_id: customId,
        company: company,
        department: dept,
        is_attachment: attachment,
      })
        .then((result) => {
          console.log("Success:", result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      Swal.close();
      successMessage("Request submitted!");

      titleRef.current = "";
      descRef.current = "";
      countImgRef.current = 0;
    }
  };

  const NewRequest = async () => {
    const swal = Swal.fire({
      html:
        "<div class='title_bar'>" +
        "New Request: #1234 - Cole Mary" +
        "<img id='close' src='" +
        iclose +
        "' alt='alert_icon' style='cursor:pointer'/>" +
        "</div>" +
        '<input id="swal-input1" class="swal2-input" type="text" value="" autocomplete="off">' +
        '<textarea id="swal-input2" class="swal2-input" value="" autocomplete="off"></textarea>' +
        '<div id="attach_div" class="swal3-input"></div>' +
        "<span class='last_div'>" +
        "<span class='left_icons'>" +
        `<button id='custom-button' class='button'>Send</button>` +
        "<div id='attachment' class='fileinputs' >" +
        "<input type='file' class='file' id='file_field'/>" +
        "<div  class='fakefile'>" +
        "<img src='" +
        iattach +
        "' alt='alert_icon' style='cursor:pointer'/>" +
        "</div>" +
        "</div>" +
        "<img src='" +
        ilink +
        "' alt='alert_icon' style='cursor:pointer'/>" +
        "<div id='image_input' class='fileinputs' >" +
        "<input type='file' class='file' accept='image/*' id='image_field'/>" +
        "<div  class='fakefile'>" +
        "<img src='" +
        iphoto +
        "' alt='alert_icon' style='cursor:pointer'/>" +
        "</div>" +
        "</div>" +
        "</span>" +
        "<img id='delete_request' src='" +
        itrash +
        "' style='cursor:pointer' alt='alert_icon'/>" +
        "</span>",
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: {
        popup: "popup",
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
    const image_itself = document.getElementById("image_field");
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
    customButton.addEventListener("click", () => SendReq());
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
    console.log("clicked");
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.href = "*";
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="SideNav">
      <ul>
        <div onClick={handleLogout}>Logo</div>
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
          <li onClick={() => setpage("Home")}>
            <img src={chart} alt="nav_icon" className="nav_icon" />
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
          <li className="new" onClick={NewRequest}>
            <img src={request} alt="nav_icon" className="nav_icon" />
            <span>New Request</span>
          </li>
          <li onClick={InviteUser}>
            <img src={newuser} alt="nav_icon" className="nav_icon" />
            <span>Invite User</span>
          </li>
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
