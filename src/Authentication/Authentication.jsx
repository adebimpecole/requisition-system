import React, { useState, useContext } from "react";
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
} from "firebase/firestore";

import "./Auth.sass";
import Nav from "./Nav";
import { Context } from "../Utilities/Context";

import trash from "../assets/trash.svg";
import add from "../assets/add.svg";

const Authentication = () => {
  let { user, setuser, id, setid, errorMessage } = useContext(Context);

  const navigate = useNavigate();
  const db = getFirestore();

  const [department, setDepartment] = useState([]);
  const [deptValue, setDeptValue] = useState("");

  const [yearValue, setYearValue] = useState("");
  const [yearBudget, setYearBudget] = useState("");

  const [monthBudget, setMonthBudget] = useState("");
  const [monthValue, setMonthValue] = useState("");

  const handleAddDept = () => {
    setDepartment([...department, deptValue]);
    setDeptValue("");
  };

  const handleDeleteDept = (index) => {
    setDepartment(department.filter((_, i) => i !== index));
  };

  const SaveSection = async (e) => {
    e.preventDefault();

    if (department.length === 0 || yearBudget === "" || monthBudget === "") {
      console.log(true);
    } else {
      try {
        // Add the departments to Firestore
        const collectionRef = collection(db, "departments");
        // creates a new document for each department
        // department.forEach(async (item) => {
        //     await addDoc(collectionRef, {
        //         companyId: id,
        //         department: item,
        //     });
        // })

          await addDoc(collectionRef, {
            companyId: id,
            department: department,
          });

        // Add the users name to Firestore
        const budgetCollectionRef = collection(db, "budgets");
        await addDoc(budgetCollectionRef, {
          companyId: id,
          monthlyBudget: monthBudget,
          yearlyBudget: yearBudget,
        });
        navigate("/admindash");
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        // Handle registration errors
      }
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
          <h2 className="page_header auths_header">Set Up Your Company Info</h2>
          <div className="add_section">
            <div class="add_title">Add Departments</div>
            <div class="add_note">
              Kindly input the various departments that exist in your company
              and save your entries
            </div>
            <div class="add_frame">
              <label>
                <input
                  type="text"
                  placeholder="Enter department name"
                  value={deptValue}
                  onChange={(e) => setDeptValue(e.target.value)}
                />
                <div class="add_button" onClick={handleAddDept}>
                  {" "}
                  <img src={add} alt="add_icon" />
                  Add Department
                </div>
              </label>
            </div>
            <div className="added">
              <div className="added_title"> Departments</div>
              {department.map((item, index) => (
                <div className="added_tab" key={index}>
                  <div className="added_name">{item}</div>
                  <img
                    src={trash}
                    alt="trash_icon"
                    onClick={() => handleDeleteDept(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="add_section">
            <div className="add_title">Add Budget</div>
            <div className="add_note">
              Dedicate and approve your company's budget for whatever time
              period is required.
            </div>
            <div class="add_frame">
              <label className="budget_label">
                Yearly Budget
                <input
                  type="text"
                  placeholder="$ xxxxxxxx"
                  value={yearBudget}
                  onChange={(e) => setYearBudget(e.target.value)}
                />
              </label>
            </div>
            <div class="add_frame">
              <label className="budget_label">
                Monthly Budget
                <input
                  type="text"
                  placeholder="$ xxxxxxxx"
                  value={monthBudget}
                  onChange={(e) => setMonthBudget(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="button_section">
            <div className="save_button" onClick={SaveSection}>
              Save{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
