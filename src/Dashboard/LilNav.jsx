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

import { cloudinary } from "../config/cloudinary";

import "./Nav.sass";
import { Context } from "../Utilities/Context";
import { generateCustomId } from "../config/functions";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import bell from "../assets/notifications.svg";
import bell2 from "../assets/newalert.svg";
import wait from "../assets/wait.svg";
import iclose from "../assets/close.svg";
import profile from "../assets/profile.svg";
import reply from "../assets/reply.svg";
import trash from "../assets/trash.svg";
import iphoto from "../assets/insert_photo.svg";
import {
  fetchDataFromFirestore,
  updateArrayFirestore,
  updateFirestore,
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

  useEffect(() => {
    // Reference to the user's document in Firestore
    const userDocRef = collection(db, "users");
    const compDocRef = collection(db, "companies");

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
      const userCollectionRef = collection(db, "users");
      const q = query(userCollectionRef, where("userId", "==", userId));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (docSnap) => {
        const userData = docSnap.data();
        let fieldValue = userData.messages;

        // Deep comparison function for arrays of objects
        const isDifferent = (arr1, arr2) => {
          if (arr1.length !== arr2.length) return true;
        };

        // Check if the fetched data is different from the current state
        if (isDifferent(fieldValue, notification.current)) {
          // fieldValue.map(async (item) => {
          //   if (item.type === 'request') {
          //     // Extract userId from the body
          //     const { userId } = item.body;

          //     console.log(userId)

          //     // Fetch user data based on userId
          //     try {
          //       const userCollectionRef = collection(db, 'users');
          //       const q = query(userCollectionRef, where('userId', '==', userId));
          //       const querySnapshot = await getDocs(q);

          //       if (!querySnapshot.empty) {
          //         const docSnapshot = querySnapshot.docs[0];
          //         const userData = docSnapshot.data();

          //         let new_object = {  userName: userData.first_name + userData.last_name}

          //         fieldValue = [
          //           ...item,
          //           new_object,
          //         ];
          //       }
          //     } catch (error) {
          //       console.error('Error fetching user data:', error);
          //     }
          //   }
          //   return item;
          // })
          const updatedFieldValues = await Promise.all(
            fieldValue.map(async (item) => {
              if (item.type === "request") {
                // Extract userId from the body
                const { userId } = item.body;

                try {
                  const userCollectionRef = collection(db, "users");
                  const q = query(
                    userCollectionRef,
                    where("userId", "==", userId)
                  );
                  const querySnapshot = await getDocs(q);

                  if (!querySnapshot.empty) {
                    const docSnapshot = querySnapshot.docs[0];
                    const userData = docSnapshot.data();

                    // Create a new object with updated properties
                    const newObject = {
                      ...item,
                      userName: userData.first_name + " " + userData.last_name,
                    };

                    return newObject;
                  }
                } catch (error) {
                  console.error("Error fetching user data:", error);
                }
              }
              // Return the original item if it doesn't need modification
              return item;
            })
          );
          notification.current = updatedFieldValues;
          setMessages(updatedFieldValues);
        }
        return fieldValue;
      });
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
    console.log(messages);

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

  const CloseReq = () => {
    Swal.close();
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

  const displayNotes = (e) => {
    console.log(e);

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

        await updateFirestore("requests", e, updatedIndex);

        // checks if request is funded
        if (fundRef.current == "") {
        } else {
          // store the fund in an object to update it in firestore
          const updatedFund = { fund: fundRef.current };

          await updateFirestore("requests", e, updatedFund);

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
          const currentBalance = budgetData.balance;
          const currentUsed = budgetData.used;

          // update used and balance
          // balance to be updated
          const balanceObject = {
            used: `${Number(currentUsed) + Number(fundRef.current)}`,
            balance: `${Number(currentBalance) - Number(fundRef.current)}`,
          }
          updateArrayFirestore("budgets", "companyId", c_ID, "approvedBy", balanceObject);
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
          type: "request",
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
          updateArrayFirestore(
            "users",
            "email",
            requestData.body.user_id,
            "messages",
            messageToAdd2
          );
        } else {
          // sends notification of the next approver on the list
          updateArrayFirestore(
            "users",
            "email",
            requestData.approvers[currentValue + 1],
            "messages",
            messageToAdd3
          );
        }

        // deletes notification from current users message array
        updateArrayFirestore(
          "users",
          "email",
          id,
          "userId",
          messageToAdd3
        );


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
          }

          // Update the document with the modified array
          await updateFirestore("users", id, messageObject);
        }
      

      Swal.close();
      successMessage("Request Approved and Sent!");
    } catch (error) {
      console.error(
        "Error fetching document from 'requests' collection:",
        error
      );
    }
    }

  const FundRequest = (e, data) => {
    console.log(e);
    if (e.body.reqId) {
      try {
        let budget = 0;
        let balance = 0;
        let companyID;

        // get budget
        const companyCollectionRef = collection(db, "companies");
        const query7 = query(
          companyCollectionRef,
          where("name", "==", data.company_name)
        );

        getDocs(query7)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docSnapshot1 = querySnapshot.docs[0];
              const userData = docSnapshot1.data();
              companyID = userData.userId;

              const budgetCollectionRef = collection(db, "budgets");
              const query6 = query(
                budgetCollectionRef,
                where("companyId", "==", companyID)
              );

              getDocs(query6)
                .then((querySnapshot) => {
                  if (!querySnapshot.empty) {
                    const docSnapshot1 = querySnapshot.docs[0];
                    const userData = docSnapshot1.data();
                    budget = userData.yearlyBudget;
                    balance = userData.balance;

                    // get the user that made the request
                    const userCollectionRef = collection(db, "users");
                    const query5 = query(
                      userCollectionRef,
                      where("userId", "==", e.body.userId)
                    );

                    getDocs(query5)
                      .then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                          const docSnapshot1 = querySnapshot.docs[0];
                          const userData = docSnapshot1.data();
                          let the_first_name = userData.first_name;
                          let the_last_name = userData.last_name;
                          let the_dept = userData.department;

                          const swal = Swal.fire({
                            html:
                              "<div class='first_title'>" +
                              "<img id='close' src='" +
                              iclose +
                              "' alt='alert_icon' style='cursor:pointer'/>" +
                              "</div>" +
                              "<div class='request_dets'>" +
                              "<div class='the_title'>" +
                              "<span> Fund Request </span>" +
                              "</div>" +
                              '<div class="the_description" >' +
                              "<div class='fund_head'>Account details</div>" +
                              "<div class='fund_account'>" +
                              "<div class='fund_month'>$" +
                              balance +
                              "</div>" +
                              "<div class='fund_year'><span>Yearly budget :</span> $" +
                              budget +
                              "</div>" +
                              "</div>" +
                              "<div class='fund_head'>Request details</div>" +
                              '<div class="description" >' +
                              "<div class='sub_dets'>" +
                              "<span>Department</span>" +
                              "<div>" +
                              the_dept +
                              "</div>" +
                              "</div>" +
                              "<div class='sub_dets'>" +
                              "<span>Request ID</span>" +
                              "<div>" +
                              e.body.reqId +
                              "</div>" +
                              "</div>" +
                              "<div class='sub_dets'>" +
                              "<span>Requester</span>" +
                              "<div>" +
                              the_first_name +
                              " " +
                              the_last_name +
                              "</div>" +
                              "</div>" +
                              "<div class='sub_dets'>" +
                              "<span>Purpose</span>" +
                              "<select value='' id='purpose' >" +
                              "<option value='travel'>Travel</option>" +
                              "<option value='material'>Materials</option>" +
                              "<option value='supplies'>Supplies</option>" +
                              "<option value='others'>Others</option>" +
                              "</select>" +
                              "</div>" +
                              "</div>" +
                              "<div class='fund_head'>Funding details</div>" +
                              "<label>" +
                              "<span>Enter amount for funding</span>" +
                              '<input id="fund-input" class="email-input" type="text" value="" autocomplete="off">' +
                              "</label>" +
                              "</div>" +
                              "</div>" +
                              "<div class='buttons'>" +
                              `<button id='send3-button' class='button'>Send</button>` +
                              "</div>",
                            showConfirmButton: false,
                            customClass: {
                              popup: "fund",
                              htmlContainer: "container",
                            },
                          });
                        } else {
                          console.log(
                            "No user data found for this company name."
                          );
                        }
                        // Close request
                        const closeButton = document.getElementById("close");
                        closeButton.addEventListener("click", () => CloseReq());

                        // collect funds
                        const fundsInput =
                          document.getElementById("fund-input");
                        const input3Listener = () =>
                          catchFund(fundsInput.value);
                        fundsInput.addEventListener("input", input3Listener);

                        // collect purpose
                        const purposeInput = document.getElementById("purpose");
                        const input4Listener = () =>
                          catchPurpose(purposeInput.value);
                        purposeInput.addEventListener("input", input4Listener);

                        const sendRequest3 =
                          document.getElementById("send3-button");
                        sendRequest3.addEventListener("click", () =>
                          SendRequest(
                            e.body.reqId,
                            e.notificationId,
                            e.body.userId,
                            companyID
                          )
                        );
                      })
                      .catch((error) => {
                        console.error("Error getting user data:", error);
                      });
                  } else {
                    console.log("No user data found for this company name.");
                  }
                })
                .catch((error) => {
                  console.error("Error getting user data:", error);
                });
            } else {
              console.log("No user data found for this company name.");
            }
          })
          .catch((error) => {
            console.error("Error getting user data:", error);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
    Swal.close();
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
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

        // displays other approvers response
        if (requestData.approvedBy.length > 0) {
          displayNotes(requestData.approvedBy);
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
                        <div class='image_letter'>${item.email.charAt(0)}</div>
                        <div>
                          <div class='note_email'>${item.email}</div>
                          <div class='note_note'>${item.note}</div>
                          <div class='note_response' > <span style= 'color: ${
                            item.response == "approve" ? "#5FCF7D" : "red"
                          }'>${item.response}</span></div>
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
              <span>${requestData.title}</span>
            </div>
            <div class='the_description'>
              <div class='description'>${requestData.description}</div>
              <div class='image_section' style='display : ${displayImage};'>
                <div class='section_text'>Attachments:</div>
                <div id='image_div'></div>
                <a href=${
                  requestData.image_url
                } target="_blank">attached image</a>
              </div>
              <div id='notes_section' style='display : ${notes};'>
                <div class='note_header'>Response:</div>
                <div id='notes_div'>
                  ${updatedNotes
                    .map(
                      (note, index) => `
                      <div key=${index} class='note'>
                      ${note}
                      </div>
                    `
                    )
                    .join("")}
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
                  <div id='image_input' class='fileinputs' >
                  <input type='file' class='file' accept='image/*' id='image_field'/>
                  <div  class='fakefile'>
                    <img src='
                    ${iphoto} 
                    ' alt='alert_icon' style='cursor:pointer' id='lil_image_icon'/>
                  </div>
                </div>
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

        // display imported image
        const image_itself = document.getElementById("image_field");
        const fileDiv = document.getElementById("reply_attachments");
        image_itself.addEventListener("input", () =>
          Attachment(fileDiv, image_itself)
        );

        // Import image
        const our_image_itself = document.getElementById("image_field");
        our_image_itself.addEventListener("change", handleFileChange);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
  };

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
                      onClick={() => openNotification(item)}
                    >
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
                          1:30pm on 23-10-2024
                        </div>
                      </div>
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
