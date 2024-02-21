import { fetchDataFromFirestore } from "./firebaseFunctions";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import "../Dashboard/Table.sass";

import iclose from "../assets/close.svg";

// function to close modal
export const CloseReq = () => {
  Swal.close();
};

// displays request information for view only
export const openRequest = async (e) => {
  const requestInfo = await fetchDataFromFirestore(
    "requests",
    "requset_id",
    e.requset_id
  );

  const requesterInfo = await fetchDataFromFirestore(
    "users",
    "userId",
    requestInfo.user_id
  );

  // Retrieves all users that have viewed the request
  const emails = requestInfo.messages.map((item) => item.email);

  // Function to fetch names based on emails from Firestore
  const fetchNames = async (emails) => {
    const namePromises = emails.map(async (email) => {
      const userDoc = await fetchDataFromFirestore("users", "email", email);
      return userDoc.first_name + " " + userDoc.last_name;
    });

    const names = await Promise.all(namePromises);
    return names.filter((name) => name !== null);
  };

  const names = await fetchNames(emails);

  // Now, 'displayNames' is a string containing the names separated by commas
  const displayNames = names.join(", ");

  // check if the request has an image attached
  let displayImage = requestInfo.is_attachment ? "flex" : "none";

  const the_html = `
        <div class='the_title'>
            <span>${e.title}</span>
            <img id='close' src='${iclose}' alt='alert_icon' style='cursor:pointer'/>
        </div>
        <div class="to_who"> ID - ${e.requset_id}</div>
        <div class="the_description" >${e.description}</div>
        <div class='image_section' style='display : ${displayImage};'>
            <div class='section_text'>Attachments:</div>
            <div id='image_div'></div>
            <a href=${requestInfo.image_url} target="_blank">attached image</a>
        </div>
        <div class="other_details">
            <span>Created on the ${e.date}</span>
            <span style='text-transform: capitalize'>Status - ${e.status}</span>
            <span>Created by <span style='text-transform: capitalize; font-weight: 600;'>${requesterInfo.first_name} ${requesterInfo.last_name}</span></span>
            <span>Seen by <span style='text-transform: capitalize; font-weight: 600;'>${displayNames}</span></span>
        </div>
    `;
  const swal = Swal.fire({
    html: the_html,
    allowOutsideClick: false,
    showConfirmButton: false,
    customClass: {
      popup: "popup",
      htmlContainer: "container",
    },
  });
  // Close request
  const closeButton = document.getElementById("close");
  closeButton.addEventListener("click", () => CloseReq());
};
