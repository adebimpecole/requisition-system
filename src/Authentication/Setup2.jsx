import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

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
  setDoc,
} from "firebase/firestore";

import "./Auth.sass";
import Nav from "./Nav";
import Example from "./dnd/example";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Context } from "../Utilities/Context";

const Setup2 = () => {
  const navigate = useNavigate();
  const db = getFirestore();

  let { user, setuser, id, setid, errorMessage } = useContext(Context);

  const [approvers, setApprovers] = useState([]);

  const [selectedApprover, setSelectedApprover] = useState("");
  const [selectedApprover2, setSelectedApprover2] = useState("");
  const [selectedApprover3, setSelectedApprover3] = useState("");
  const [selectedApprover4, setSelectedApprover4] = useState("");

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  // get approvers
  useEffect(() => {
    const userCollectionRef = collection(db, "companies");
    const query4 = query(userCollectionRef, where("userId", "==", id));

    getDocs(query4)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = [];
          querySnapshot.forEach((doc) => {
            userData.push(doc.data());
          });
          setApprovers(userData[0].approvers);
        } else {
        }
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  }, [id]);

  const handleApproverChange = (event, type) => {
    if (type == "verify") {
      setSelectedApprover(event.target.value);
    }
    if (type == "fund") {
      setSelectedApprover2(event.target.value);
    }
    if (type == "lead") {
      setSelectedApprover3(event.target.value);
    }
    if (type == "vet") {
      setSelectedApprover4(event.target.value);
    }
  };
  const MoveOn = async () => {
    if (
      selectedApprover == "" ||
      selectedApprover2 == "" ||
      selectedApprover3 == "" ||
      selectedApprover4 == ""
    ) {
      errorMessage("Please fill in required fields");
      console.log("null");
    } else {
      const userCollectionRef = collection(db, "companies");
      const query4 = query(userCollectionRef, where("userId", "==", id));
      try {
        const querySnapshot = await getDocs(query4);

        querySnapshot.forEach(async (doc) => {
          try {
            const docRef = doc.ref;

            await setDoc(
              docRef,
              { fundingAuthority: selectedApprover2 },
              { merge: true }
            );
            await setDoc(
              docRef,
              { verificationAuthority: selectedApprover },
              { merge: true }
            );
            await setDoc(
              docRef,
              { vettingAuthority: selectedApprover4 },
              { merge: true }
            );
            await setDoc(
              docRef,
              { leadAuthority: selectedApprover3 },
              { merge: true }
            );
            await setDoc(docRef, { messages: [] }, { merge: true });
            await setDoc(
              docRef,
              {
                approvers: [
                  selectedApprover3,
                  selectedApprover4,
                  selectedApprover3,
                  selectedApprover2,
                  selectedApprover,
                ],
              },
              { merge: true }
            );
          } catch (error) {
            console.error(
              "Error updating document in 'companies' collection:",
              error
            );
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      navigate("/admindash");
    }
  };
  return (
    <div className="auth main_auth">
      <div className="nav main_nav">
        <Nav />
      </div>
      <div className="auth_content full_section">
        <div className="auth_section ">
          <h2 className="page_header auths_header">
            Set Up Your Company Approvers
          </h2>
          <div className="add_section">
            <div className="add_title">Select Lead Approver</div>
            <div className="add_note">
              Select the approver responsible for ensuring that all requests and
              approvals align with the organization's objectives and policies.
            </div>
            <div className="added my_added">
              <div className="added_approvers"> Approvers</div>
              <div className="the_approvers">
                {approvers.length > 0 ? (
                  <>
                    {approvers.map((approver, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name="approver"
                          value={approver}
                          checked={selectedApprover3 === approver}
                          onChange={(e) =>
                            handleApproverChange(e, "lead") === approver
                          }
                        />
                        <span className="value">{approver}</span>
                      </label>
                    ))}
                  </>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>
          </div>
          <div className="add_section">
            <div className="add_title">
              Select Approvers with Vetting Authority
            </div>
            <div className="add_note">
              Select the approver responsible for vetting requests and ensuring
              that the request aligns with the company needs.
            </div>
            <div className="added my_added">
              <div className="added_approvers"> Approvers</div>
              <div className="the_approvers">
                {approvers.length > 0 ? (
                  <>
                    {approvers.map((approver, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name="approver"
                          value={approver}
                          checked={selectedApprover4 === approver}
                          onChange={(e) =>
                            handleApproverChange(e, "vet") === approver
                          }
                        />
                        <span className="value">{approver}</span>
                      </label>
                    ))}
                  </>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>
          </div>
          <div className="add_section">
            <div className="add_title">
              Select Approvers with Funding Authority
            </div>
            <div className="add_note">
              Select the approver(s) responsible for approving requests related
              to financial allocations.
            </div>
            <div className="added my_added">
              <div className="added_approvers"> Approvers</div>
              <div className="the_approvers">
                {approvers.length > 0 ? (
                  <>
                    {approvers.map((approver, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name="approver"
                          value={approver}
                          checked={selectedApprover2 === approver}
                          onChange={(e) =>
                            handleApproverChange(e, "fund") === approver
                          }
                        />
                        <span className="value">{approver}</span>
                      </label>
                    ))}
                  </>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>
          </div>
          <div className="add_section">
            <div className="add_title">
              Select Approvers with Verification Authority
            </div>
            <div className="add_note">
              Select the approver responsible for verifying that the executed
              request aligns with the allocated funds. This approver ensures
              that the funds were used in accordance with the approved
              disbursement.
            </div>
            <div className="added my_added">
              <div className="added_approvers"> Approvers</div>
              <div className="the_approvers">
                {approvers.length > 0 ? (
                  <>
                    {approvers.map((approver, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name="approver"
                          value={approver}
                          checked={selectedApprover === approver}
                          onChange={(e) =>
                            handleApproverChange(e, "verify") === approver
                          }
                        />
                        <span className="value">{approver}</span>
                      </label>
                    ))}
                  </>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>
          </div>

          {/* <div className="add_section">
            <div className="add_title">
              Organize Approvers in the Approval Workflow
            </div>
            <div className="add_note">
              Kindly rearrange the approvers in the appropriate workflow or
              approval process sequence.
            </div>
            <div className="added my_added">
              <div className="added_approvers"> Approvers</div>
              <DndProvider backend={HTML5Backend}>
                <Example />
              </DndProvider>
            </div>
          </div> */}
          <div className="button_section">
            <div className="save_button" onClick={MoveOn}>
              Next{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup2;
