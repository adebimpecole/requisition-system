import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

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
import { Context } from "../Utilities/Context";

const Setup5 = () => {
  let { user, setuser, id, setid, errorMessage } = useContext(Context);

  const navigate = useNavigate();
  const db = getFirestore();

  const [approvers, setApprovers] = useState([]);
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

  const handleApproverChange = (value) => {
    // Check if the checkbox is already selected
    if (selectedCheckboxes.includes(value)) {
      // If selected, remove it from the array
      setSelectedCheckboxes(selectedCheckboxes.filter(item => item !== value));
    } else {
      // If not selected, add it to the array
      setSelectedCheckboxes([...selectedCheckboxes, value]);
    }
  };

  const MoveOn = async () => {
    try {
      const userCollectionRef = collection(db, "companies");
      const query4 = query(userCollectionRef, where("userId", "==", id));

      const querySnapshot = await getDocs(query4);

      querySnapshot.forEach(async (doc) => {
        try {
          const docRef = doc.ref;

          await setDoc(
            docRef,
            { closingAuthority: selectedCheckboxes },
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
          <h2 className="page_header auths_header">
            Set Up Your Company Approvers
          </h2>
          <div className="add_section">
            <div className="add_title">
              Select Approvers with Closing Authority
            </div>
            <div className="add_note">
              Choose the approver(s) assigned with the authority to close the
              request. This individual is responsible for finalizing and
              officially concluding the request process.
            </div>
            <div className="added my_added">
              <div className="added_approvers"> Approvers</div>
              <div className="the_approvers">
                {approvers.length > 0 ? (
                  <>
                    {approvers.map((approver, i) => (
                      <label key={i} className='the_label'>
                        <input
                          type="checkbox"
                          name="approver"
                          value={approver}
                          checked={selectedCheckboxes.includes(`${approver}`)}
                          onChange={() => handleApproverChange(`${approver}`)}
                        />
                        <span className="the_value">{approver}</span>
                      </label>
                    ))}
                  </>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>
          </div>

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

export default Setup5;
