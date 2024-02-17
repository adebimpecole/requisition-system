import React, { useContext, useEffect, useState, useRef } from "react";

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

import "./Nav.sass";
import { Context } from "../Utilities/Context";
import { generateCustomId } from "../config/functions";
import { openRequest, CloseReq } from "../config/Modals";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import bell from "../assets/notifications.svg";
import bell2 from "../assets/newalert.svg";
import wait from "../assets/wait.svg";
import iclose from "../assets/close.svg";
import profile from "../assets/profile.svg";
import reply from "../assets/reply.svg";
import chat from "../assets/chat.svg";
import trash from "../assets/trash.svg";
import iphoto from "../assets/insert_photo.svg";
import {
  fetchDataFromFirestore,
  updateArrayFirestore,
  updateFirestore,
  addToFirestore,
} from "../config/firebaseFunctions";

const LilNav = ({ firstname, lastname, mail, company, role, dept, url }) => {
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
  const [the_role, setthe_role] = useState();
  const [messages, setMessages] = useState([]);
  const [notificationPanel, setNotificationPanel] = useState(false);

  const [isApproved, setApproved] = useState(false);
  const [isRejected, setRejected] = useState(false);
  const [isNotification, setNotification] = useState(false);
  const [the_note, setThe_note] = useState([]);

  const notification = useRef([]);
  const the_response = useRef(null);
  const fundRef = useRef("");
  const purposeRef = useRef("");
  const replyRef = useRef("");
  const noteRef = useRef([]);
  const countImgRef = useRef(0);

  const [image, setImage] = useState(null);
  const [updateDataArray, setUpdateDataArray] = useState([]);

  useEffect(() => {
    // Reference to the user's document in Firestore
    const userDocRef = collection(db, "users");
    const compDocRef = collection(db, "companies");

    // const userData = await fetchDataFromFirestore("users", "userId", id)
    // const comapnyData = await fetchDataFromFirestore("companies", "userId", id)

    fetchDataFromFirestore("users", "userId", id);

    const query1 = query(userDocRef, where("userId", "==", id));
    const query2 = query(compDocRef, where("userId", "==", id));

    getDocs(query1).then((querySnapshot1) => {
      if (!querySnapshot1.empty) {
        // Retrieve the first document that matches the query from the 'users' collection
        const docSnapshot1 = querySnapshot1.docs[0];
        const userData = docSnapshot1.data();
        setthe_role(userData.role);
      } else {
        // If no data is found in the 'users' collection, check the 'companies' collection
        getDocs(query2)
          .then((querySnapshot2) => {
            if (!querySnapshot2.empty) {
              // Retrieve the first document that matches the query from the 'companies' collection
              const docSnapshot2 = querySnapshot2.docs[0];
              const companyData = docSnapshot2.data();
              setthe_role(companyData.role);
            } else {
              errorMessage("No user found.");
            }
          })
          .catch((error) => {
            console.error("Error getting company data:", error);
          });
      }
    });
  }, []);

  const fetchDataForUserId = async (userId) => {
    try {
      const userData = await fetchDataFromFirestore("users", "userId", userId);

      let fieldValue = userData.messages;

      // Deep comparison function for arrays of objects
      const isDifferent = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return true;
      };

      // Check if the fetched data is different from the current state
      if (isDifferent(fieldValue, notification.current)) {
        const updatedFieldValues = await Promise.all(
          fieldValue.map(async (item) => {
            if (item.type === "request") {
              // Extract userId from the body
              const { reqId } = item.body;

              const requestData = await fetchDataFromFirestore(
                "requests",
                "requset_id",
                reqId
              );
              const requesterData = await fetchDataFromFirestore(
                "users",
                "userId",
                requestData.user_id
              );

              // Create a new object with updated properties
              const newObject = {
                ...item,
                userName:
                  requesterData.first_name + " " + requesterData.last_name,
              };
              return newObject;
            }
            // Return the original item if it doesn't need modification
            return item;
          })
        );
        notification.current = updatedFieldValues;
        console.log(updatedFieldValues);
        setMessages(updatedFieldValues);
      }
      return fieldValue;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDataForUserId(id);
    }, 1000);

    // Clear the interval when the component unmounts or when 'id' changes
    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {}, [notification.current]);

  useEffect(() => {
    if (messages.length <= 0) {
      setNotification(false);
    } else {
      setNotification(true);
    }
  }, [messages]);

  const catchFund = (e) => {
    fundRef.current = e;
  };

  const catchPurpose = (e) => {
    purposeRef.current = e;
  };

  const toggleApprove = (e) => {
    setApproved(true);
    setRejected(false);
    the_response.current = "approve";

    // Change the background color and text color of the "Approve" button
    const approveButton = document.getElementById("approve");
    approveButton.style.backgroundColor = "#5fcf7d2e";
    approveButton.style.color = "#5FCF7D";

    // Reset the styles of the "Reject" button
    const rejectButton = document.getElementById("reject");
    rejectButton.style.backgroundColor = "#3435362f";
    rejectButton.style.color = "grey";

    console.log(e);
    if (e == "block") {
      const showFund = document.getElementById("fund-button");
      showFund.style.display = "block";
    } else {
      const showFund = document.getElementById("fund-button");
      showFund.style.display = "none";
    }
  };

  const toggleRejected = (e) => {
    setRejected(true);
    setApproved(false);
    the_response.current = "reject";

    // Change the background color and text color of the "Reject" button
    const rejectButton = document.getElementById("reject");
    rejectButton.style.backgroundColor = "#f07f6338";
    rejectButton.style.color = "#F07F63";

    // Reset the styles of the "Approve" button
    const approveButton = document.getElementById("approve");
    approveButton.style.backgroundColor = "#3435362f";
    approveButton.style.color = "grey";

    if (e == "block") {
      const showFund = document.getElementById("fund-button");
      showFund.style.display = "block";
    } else {
      const showFund = document.getElementById("fund-button");
      showFund.style.display = "none";
    }
  };

  const displayReply = (e) => {
    const replyRequest = document.getElementById("reply_request");
    if (e == "open") {
      replyRequest.style.display = "flex";
    } else if (e == "close") {
      replyRequest.style.display = "none";
    }
  };

  const displayResponse = (e) => {
    const Response = document.getElementById("notes_section");
    if (e == "open") {
      Response.style.display = "flex";
    } else if (e == "close") {
      Response.style.display = "none";
    }
  };

  const displayNotes = (e) => {
    noteRef.current = e;
  };

  const catchReply = (e) => {
    replyRef.current = e;
  };

  const SendRequest = async (e, N_Id, u_ID, c_ID) => {
    let requestData = await fetchDataFromFirestore("requests", "requset_id", e);
    try {
      const currentValue = requestData.approvalIndex;

      const messageToAdd = {
        note: replyRef.current,
        email: mail,
        response: the_response.current,
        url: image ? image : "",
      };

      // update the approval index and adds approver response
      updateArrayFirestore(
        "requests",
        "requset_id",
        e,
        "approvedBy",
        messageToAdd
      );

      // store the approval index in an object to update it in firestore
      const updatedIndex = { approvalIndex: currentValue + 1 };

      await updateFirestore("requests", "requset_id", e, updatedIndex);

      // checks if request is funded
      if (fundRef.current == "") {
      } else {
        // store the fund in an object to update it in firestore
        const updatedFund = { fund: fundRef.current };

        await updateFirestore("requests", "requset_id", e, updatedFund);

        // get the user department to send with the expense
        let usersData = await fetchDataFromFirestore("users", "userId", u_ID);

        const dept = usersData.department;

        let expenseId = generateCustomId("EXP", 5);

        let expenseData = {
          requestId: e,
          amount: fundRef.current,
          purpose: purposeRef.current,
          expenseId: expenseId,
          companyId: c_ID,
          department: dept,
        };

        // add expenses to firestore
        await addToFirestore("expenses", expenseData);

        // get the used and current balance values
        let budgetData = await fetchDataFromFirestore(
          "budgets",
          "companyId",
          c_ID
        );

        // new used and balance
        const currentBalance =
          Number(budgetData.used) + Number(fundRef.current);
        const currentUsed =
          Number(budgetData.balance) - Number(fundRef.current);

        // update used and balance
        await updateFirestore("budgets", "companyId", c_ID, {
          balance: currentBalance,
        });
        await updateFirestore("budgets", "companyId", c_ID, {
          used: currentUsed,
        });
      }

      // Check if the current user is the last approver
      const isLastApprover =
        requestData.approvers[requestData.approvers.length - 1] === mail;

      let notificationId = generateCustomId("NOT_", 5);

      //creates notification object for requester
      const messageToAdd2 = {
        message: "Request Update!",
        body: {
          reqId: e,
        },
        notificationId: notificationId,
        type: "update",
        status: "funded",
      };

      //creates notification object for approver
      const messageToAdd3 = {
        message: "New Request for Approval",
        body: {
          reqId: e,
        },
        notificationId: notificationId,
        type: "request",
        status: "pending",
      };

      if (isLastApprover) {
        // sends notification back to the requester
        await updateArrayFirestore(
          "users",
          "userId",
          requestData.user_id,
          "messages",
          messageToAdd2
        );
      } else {
        // sends notification of the next approver on the list
        await updateArrayFirestore(
          "users",
          "email",
          requestData.approvers[currentValue + 1],
          "messages",
          messageToAdd3
        );
      }

      // deletes notification from current users message array
      await updateArrayFirestore("users", "email", id, "userId", messageToAdd3);

      let usersData2 = await fetchDataFromFirestore("users", "userId", id);

      // Find the index of the element in the array with the specified ID
      const indexToRemove = usersData2.messages.findIndex(
        (element) => element.notificationId === N_Id
      );

      if (indexToRemove !== -1) {
        // Remove the element at the identified index
        const newArray = [...usersData2.messages];
        newArray.splice(indexToRemove, 1);

        // message object
        const messageObject = {
          messages: newArray,
        };

        // Update the document with the modified array
        await updateFirestore("users", "userId", id, messageObject);
      }

      Swal.close();
      successMessage("Request Approved and Sent!");
    } catch (error) {
      console.error(
        "Error fetching document from 'requests' collection:",
        error
      );
    }
  };

  const FundRequest = async (e, data) => {
    console.log(e);
    if (e.body.reqId) {
      try {
        // get required data
        const companyData = await fetchDataFromFirestore(
          "companies",
          "name",
          data.company_name
        );
        const budgetData = await fetchDataFromFirestore(
          "budgets",
          "companyId",
          companyData.userId
        );
        const requestData = await fetchDataFromFirestore(
          "requests",
          "requset_id",
          e.body.reqId
        );
        const userData = await fetchDataFromFirestore(
          "users",
          "userId",
          requestData.user_id
        );

        const fund_html = `
            <div class='first_title'>
              <img id='close' src=${iclose} alt='alert_icon' style='cursor:pointer'/>
            </div>
            <div class='request_dets'>
              <div class='the_title'>
                <span> Fund Request </span>
              </div>
              <div class="the_description" >
                <div class='fund_head'>Account details</div>
                <div class='fund_account'>
                  <div class='fund_month'>$${budgetData.balance}</div>
                  <div class='fund_year'><span>Yearly budget :</span> $${budgetData.yearlyBudget}</div>
                </div>
                <div class='fund_head'>Request details</div>
                <div class="description" >
                  <div class='sub_dets'>
                    <span>Department</span>
                    <div> ${userData.department} </div>
                  </div>
                  <div class='sub_dets'>
                    <span>Request ID</span>
                    <div>${e.body.reqId}</div>
                  </div>
                  <div class='sub_dets'>
                    <span>Requester</span>
                    <div>${e.userName}</div>
                  </div>
                  <div class='sub_dets'>
                    <span>Purpose</span>
                    <select value='' id='purpose' >
                      <option value='travel'>Travel</option>
                      <option value='material'>Materials</option>
                      <option value='supplies'>Supplies</option>
                      <option value='others'>Others</option>
                    </select>
                  </div>
                </div>
                <div class='fund_head'>Funding details</div>
                <label>
                  <span>Enter amount for funding</span>
                  <input id="fund-input" class="email-input" type="text" value="" autocomplete="off">
                </label>
              </div>
            </div>
            <div class='buttons'>
              <button id='send3-button' class='button'>Send</button>
            </div>
            `;

        const swal = Swal.fire({
          html: fund_html,
          showConfirmButton: false,
          customClass: {
            popup: "fund",
            htmlContainer: "container",
          },
        });

        // Close request
        const closeButton = document.getElementById("close");
        closeButton.addEventListener("click", () => CloseReq());

        // collect funds
        const fundsInput = document.getElementById("fund-input");
        const input3Listener = () => catchFund(fundsInput.value);
        fundsInput.addEventListener("input", input3Listener);

        // collect purpose
        const purposeInput = document.getElementById("purpose");
        const input4Listener = () => catchPurpose(purposeInput.value);
        purposeInput.addEventListener("input", input4Listener);

        // submit request response
        const sendRequest3 = document.getElementById("send3-button");
        sendRequest3.addEventListener("click", () =>
          SendRequest(
            e.body.reqId,
            e.notificationId,
            requestData.user_id,
            companyData.userId
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
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

    // setImage(file);
    console.log(the_input.files);

    countImgRef.current = countImgRef.current + 1;

    childElement.appendChild(img);
    the_div.appendChild(childElement);
  };

  const openNotification = async (e) => {
    if (e.body.reqId) {
      try {
        // retrieve request data
        let requestData = await fetchDataFromFirestore(
          "requests",
          "requset_id",
          e.body.reqId
        );

        let notes;

        console.log(requestData);
        // displays other approvers response
        if (requestData.messages.length > 0) {
          displayNotes(requestData.messages);
          notes = "block";
        } else {
          notes = "none";
        }

        // retrieve request data
        let usersData = await fetchDataFromFirestore(
          "users",
          "userId",
          requestData.user_id
        );

        // retrieve company data
        let companyData = await fetchDataFromFirestore(
          "companies",
          "name",
          requestData.company
        );

        // check if the current approver has funding authority
        let funding = companyData.fundingAuthority === mail ? "block" : "none";

        // check if the reques thas an image attached
        let displayImage = requestData.is_attachment ? "block" : "block";

        let the_first_name = usersData.first_name;
        let the_last_name = usersData.last_name;

        // Split the input date into day, month, and year parts
        const [day, month, year] = requestData.date.split("/");
        const dateObject = new Date(year, month - 1, day);
        const longDateFormat = dateObject.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // approvers response
        const updatedNotes = noteRef.current.map(
          (item) => `
              <div class='each_note'>
                <div class='note_prtone'>
                  <div class='note_stuff'>
                    <div class='image_letter'>${item.email.charAt(0)}</div>
                    <div class='note_p1'>
                      <div class='note_name'>${console.log(
                        fetchDataFromFirestore("users", "email", item.email)
                      )}</div>
                      <div class='note_email'>${item.email}</div>
                    </div>
                  </div>
                  <div class='note_response' > <span style= 'color: ${
                    item.response == "approve" ? "#5FCF7D" : "red"
                  }'>${
            item.response == "approve" ? "approved" : "rejected"
          }</span></div>
                </div>
                <div class='note_p2'>
                  <div class='note_note'>${item.note}</div>
                </div>
              </div>
            `
        );

        const the_html = `
            <div class='first_title'>
              <span>Request Details</span>
              <img id='close' src='${iclose}' alt='alert_icon' style='cursor:pointer'/>
            </div>
            <div class='request_dets'>
              <div class='the_title'>
                <div class="to_who">
                  <span>from - ${the_first_name} ${the_last_name}</span>
                  <span>${longDateFormat}</span>
                </div>
                <span class='title_header'>${requestData.title} <img class='chat_icon' src=${chat} alt='chat bubble' id='chat'/></span>
              </div>
              <div class='the_description'>
                <div class='description'>${requestData.description}</div>
                <div class='image_section' style='display : ${displayImage};'>
                  <div class='section_text'>Attachments:</div>
                  <div id='image_div'></div>
                  <a href=${requestData.image_url} target="_blank">attached image</a>
                </div>
                <div id='notes_section'>
                  <div class='close_part'>
                    <img id='close_note' src='${iclose}' alt='alert_icon' style='cursor:pointer'/>
                  </div>
                  <div class='note_header'>Responses</div>
                  <div id='notes_div'>
                    ${updatedNotes}
                  </div>
                </div>
                <div class='reply_section' id='reply_request'>
                  <div class='reply_head'>
                    <div class='left_head'>
                      <img alt='reply icon' src='${reply}' class='reply_icon'/>
                      <div class='reply_name'>${firstname} ${lastname}</div>
                      <div class='reply_dept'>(${dept} Department)</div>
                    </div>
                    <img id='reply_close' src= ${iclose} alt='alert_icon' style='cursor:pointer'/> 
                  </div>
                  <textarea id='reply' class='swal2-input' value='' autocomplete='off'></textarea>
                  <div class='reply_attachments' id='reply_attachments'></div>
                  <div class='reply_buttons'>
                    <div class='left_buttons'>
                      <button id='send2-button' class='button'>Send</button>
                    </div>
                    <img id='trash' src='${trash}' class='trash_icon' alt='alert_icon' style='cursor:pointer'/>
                  </div>
                </div>
              </div>
              <div class='all_buttons'>
                <div class='response'>
                  <div class='tag' id='approve'>
                    <span class='dot'>.</span>
                    Approve
                  </div>
                  <div class='tag' id='reject'>
                    <span class='dot'>.</span>
                    Reject
                  </div>
                </div>
                <div class='buttons'>
                  <button id='fund-button' class='button'>Fund</button>
                  <button id='reply-button' class='button'>Reply</button>
                  <button id='send-button' class='button'>Send</button>
                </div>
              </div>
            </div>
          `;

        const swal = Swal.fire({
          html: the_html,
          showConfirmButton: false,
          customClass: {
            popup: "notify",
            htmlContainer: "container",
          },
        });

        // Close request
        const closeButton = document.getElementById("close");
        closeButton.addEventListener("click", () => CloseReq());

        // records approve response
        const approveRequest = document.getElementById("approve");
        approveRequest.addEventListener("click", () => toggleApprove(funding));

        // records approve response
        const rejectRequest = document.getElementById("reject");
        rejectRequest.addEventListener("click", () => toggleRejected(funding));

        // closes reply section
        const replySection = document.getElementById("trash");
        replySection.addEventListener("click", () => displayReply("close"));

        const closeSection = document.getElementById("reply_close");
        closeSection.addEventListener("click", () => displayReply("close"));

        // opens approve section
        const openReply = document.getElementById("reply-button");
        openReply.addEventListener("click", () => displayReply("open"));

        // opens approve section
        const closeResponse = document.getElementById("close_note");
        closeResponse.addEventListener("click", () => displayResponse("close"));

        // opens approve section
        const openResponse = document.getElementById("chat");
        openResponse.addEventListener("click", () => displayResponse("open"));

        // sends approvers response
        const sendRequest = document.getElementById("send-button");
        sendRequest.addEventListener("click", () =>
          SendRequest(e.body.reqId, e.notificationId)
        );

        // sends approvers response with reply
        const sendRequest2 = document.getElementById("send2-button");
        sendRequest2.addEventListener("click", () =>
          SendRequest(e.body.reqId, e.notificationId)
        );

        // opens fund swal modal
        const fundRequest = document.getElementById("fund-button");
        fundRequest.addEventListener("click", () => FundRequest(e, usersData));

        // stores approvers response
        const requestReply = document.getElementById("reply");
        const input3Listener = () => catchReply(requestReply.value);
        requestReply.addEventListener("input", input3Listener);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
  };

  const selectNotification = async (e) => {
    console.log(e);
    if (e.type == "request") {
      await openNotification(e);
    }
    if (e.type == "update") {
      // retrieve request data
      let requestData = await fetchDataFromFirestore(
        "requests",
        "requset_id",
        e.body.reqId
      );
      if (requestData.status == "pending") {
        const the_html = `
            <div class='first_title'>
              <span>Request Update!</span>
              <img id='close' src='${iclose}' alt='alert_icon' style='cursor:pointer'/>
            </div>
            <div class='request_dets'>
              <div class='the_message'>
                Your financial request with title <span>${requestData.title}</span> has been 
                successfully funded. Click <span id='modal_link'>here</span> to
                review the request details and click the button below to atach proof of 
                execution. 
              </div>
              
              <div class='all_buttons'>
                <div class='buttons'>
                  <button id='send-button' class='button'>Attach proof of Execution</button>
                  <button id='reply-button' class='button'>Send</button>
                </div>
              </div>
            </div>
          `;

        const swal = Swal.fire({
          html: the_html,
          showConfirmButton: false,
          customClass: {
            popup: "update",
            htmlContainer: "container",
          },
        });
      }
      if (requestData.status == "pending") {
        const the_html = `
            <div class='first_title'>
              <span>Request Update!</span>
              <img id='close' src='${iclose}' alt='alert_icon' style='cursor:pointer'/>
            </div>
            <div class='request_dets'>
              <div class='the_message'>
                Your financial request with title <span>${requestData.title}</span>  has been 
                rejected. Click the button below to review the request details 
                along with the provided reason for rejection.
              </div>
              <div class='all_buttons'>
                <div class='buttons'>
                  <button id='send-button' class='button' style='opacity: 0'>Attach proof of Execution</button>
                  <button id='request_link' class='button' style='color: white'>View Request details</button>
                </div>
              </div>
            </div>
          `;

        const swal = Swal.fire({
          html: the_html,
          showConfirmButton: false,
          customClass: {
            popup: "update",
            htmlContainer: "container",
          },
        });
      }
      if (requestData.status == "pending") {
        const the_html = `
            <div class='first_title'>
              <span>Request Update!</span>
              <img id='close' src='${iclose}' alt='alert_icon' style='cursor:pointer'/>
            </div>
            <div class='request_dets'>
              <div class='the_message'>
                Your financial request with title <span>${requestData.title}</span>  has been 
                closed. If you have any questions or need additional information 
                regarding this closure click the button below.
              </div>
              <div class='all_buttons'>
                <div class='buttons'>
                  <button id='send-button' class='button' style='opacity: 0'>Attach proof of Execution</button>
                  <button id='request_link' class='button' style='color: white'>View Request details</button>
                </div>
              </div>
            </div>
          `;

        const swal = Swal.fire({
          html: the_html,
          showConfirmButton: false,
          customClass: {
            popup: "update",
            htmlContainer: "container",
          },
        });
      }

      // Close modal
      const closeButton = document.getElementById("close");
      closeButton.addEventListener("click", () => CloseReq());

      const requestModal = document.getElementById("modal_link");
      requestModal.addEventListener("click", () => openRequest(requestData));

      const requestLink = document.getElementById("request_link");
      requestLink.addEventListener("click", () => openRequest(requestData));
    }
  };

  const displayRequestTitle = async (item) => {
    const requestInfo = await fetchDataFromFirestore(
      "requests",
      "requset_id", // Pass reqId as an argument or get it from your component state
      item.body.reqId
    );
    console.log(requestInfo);
    return requestInfo.title;
  };

  useEffect(() => {
    const fetchData = async (notifications) => {
      const promises = notifications
        .filter((item) => item.type === "update")
        .map(async (item) => {
          const title = await displayRequestTitle(item);
          return { item, title };
        });

      const data = await Promise.all(promises);
      setUpdateDataArray(data);
    };

    fetchData(messages);
  }, [messages]);

  return (
    <div className="LilNav">
      <div className="nav_title">{page}</div>
      <ul>
        <li>
          {the_role === "Admin" ? (
            <span></span>
          ) : url ? (
            <img src={url} alt="My image" className="profile_picture" />
          ) : (
            <img src={profile} alt="profile_icon" className="profile_icon" />
          )}
          <span className="dash_name">
            {firstname} {lastname}
          </span>
        </li>
        <li>
          {messages.some((obj) => obj.status == "pending") ? (
            <>
              {}
              <img
                src={bell2}
                alt="bell"
                className="lilnav_icon"
                onClick={() => {
                  setNotificationPanel((prevState) => !prevState);
                }}
              />
            </>
          ) : (
            <img
              src={bell}
              alt="bell"
              className="lilnav_icon"
              onClick={() => {
                setNotificationPanel((prevState) => !prevState);
              }}
            />
          )}
        </li>
      </ul>
      {notificationPanel && (
        <div className="notification_container">
          <div className="the_notifications">
            <div className="container_title">Notifications</div>
            <div className="notifications">
              {messages.length > 0 ? (
                <>
                  {messages.map((item, index) => (
                    <div
                      className="notification"
                      key={"ky" + index}
                      onClick={() => selectNotification(item)}
                    >
                      {(() => {
                        switch (item.type) {
                          case "request":
                            return (
                              <>
                                <img
                                  src={wait}
                                  alt="notification_icon"
                                  className="wait_icon"
                                />
                                <div className="notification_details">
                                  <div className="message">
                                    You have a new request from{" "}
                                    <span
                                      style={{
                                        textTransform: "capitalize",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {item.userName}
                                    </span>
                                  </div>
                                  <div className="message_timeframe">
                                    1:30 pm on 23-10-2024
                                  </div>
                                </div>
                              </>
                            );
                          case "update":
                            const updateData = updateDataArray.find(
                              (data) => data && data.item === item
                            );
                            return (
                              <>
                                <img
                                  src={wait}
                                  alt="notification_icon"
                                  className="wait_icon"
                                />
                                <div className="notification_details">
                                  <div
                                    className="message"
                                    style={{
                                      fontWeight: 600,
                                    }}
                                  >
                                    Request Update!
                                  </div>
                                  {updateData && (
                                    <div className="notification_text">
                                      Your request with the title
                                      <span style={{ fontWeight: 600 }}>
                                        {" "}
                                        {updateData.title}
                                      </span>{" "}
                                      has a new update.
                                    </div>
                                  )}
                                  <div className="message_timeframe">
                                    1:30 pm on 23-10-2024
                                  </div>
                                </div>
                              </>
                            );
                          case "notificationType3":
                            return (
                              <>
                                {/* Display elements for "notificationType3" */}
                              </>
                            );
                          default:
                            return null; // Handle other types or add a default case
                        }
                      })()}
                    </div>
                  ))}
                </>
              ) : (
                <em className="none">No messages at the moment</em>
              )}
            </div>
            <div
              className="delete_section"
              style={{ display: `${isNotification ? "block" : "none"}` }}
            >
              Delete all
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LilNav;
