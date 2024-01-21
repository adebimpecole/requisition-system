import React, { useContext, useEffect, useMemo, useState, useRef } from "react";

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

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Sector,
  Cell,
} from "recharts";

import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";

import good from "../assets/wgood.svg";
import down from "../assets/trending_down.svg";
import pay from "../assets/Payment.svg";

import "../Dashboard2/Home.sass";
import "../Dashboard/Analytics.sass";

import { Context } from "../Utilities/Context";

const Analytics = ({ firstname, lastname, mail, company, dept }) => {
  const db = getFirestore();

  const { user, setuser, id, setid, errorMessage, role } = useContext(Context);

  const [budget, setBudget] = useState(0);
  const [used, setUsed] = useState(0);
  const [balance, setBalance] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [expensesByDepartment, setExpensesByDepartment] = useState([]);

  const [bar0, setBar0] = useState(0);
  const [bar1, setBar1] = useState(0);
  const [bar2, setBar2] = useState(0);
  const [bar3, setBar3] = useState(0);

  const fetchExpensesByPurpose = async (id) => {
    try {
      const expensesCollectionRef = collection(db, "expenses");

      // Query to get all expenses
      const allExpensesQuery = query(
        expensesCollectionRef,
        where("companyId", "==", id)
      );

      const allExpensesSnapshot = await getDocs(allExpensesQuery);

      if (!allExpensesSnapshot.empty) {
        // Group expenses by purpose and calculate count for each purpose
        allExpensesSnapshot.forEach((expenseDoc) => {
          const expenseData = expenseDoc.data();
          const purpose = expenseData.purpose;

          if (purpose == "travel") {
            setBar0(bar0 + 1);
          }
          if (purpose == "material") {
            setBar1(bar1 + 1);
          }
          if (purpose == "supplies") {
            setBar2(bar2 + 1);
          }
          if (purpose == "others") {
            setBar3(bar3 + 1);
          }
        });
      } else {
        // No expenses found
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchExpensesByDepartment = async (id) => {
    try {
      const expensesCollectionRef = collection(db, "expenses");

      // Query to get all expenses
      // Query to get all expenses
      const allExpensesQuery = query(
        expensesCollectionRef,
        where("companyId", "==", id)
      );
      const allExpensesSnapshot = await getDocs(allExpensesQuery);

      if (!allExpensesSnapshot.empty) {
        // Group expenses by department and calculate count for each department
        const groupedExpensesByDepartment = {};
        allExpensesSnapshot.forEach((expenseDoc) => {
          const expenseData = expenseDoc.data();
          const department = expenseData.department;

          if (groupedExpensesByDepartment[department]) {
            groupedExpensesByDepartment[department]++;
          } else {
            groupedExpensesByDepartment[department] = 1;
          }
        });

        setExpensesByDepartment(groupedExpensesByDepartment);
      } else {
        // No expenses found
        setExpensesByDepartment({});
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the companies' and budgets document in Firestore
        const companyDocRef = collection(db, "companies");
        const budgetDocRef = collection(db, "budgets");

        // Query to find documents where name matches the company
        const companyQuery = query(companyDocRef, where("name", "==", company));
        const companyQuerySnapshot = await getDocs(companyQuery);

        if (!companyQuerySnapshot.empty) {
          // Retrieve the first document that matches the query
          const companyDocSnapshot = companyQuerySnapshot.docs[0];
          const companyUserData = companyDocSnapshot.data();
          const theCompanyId = companyUserData.userId;

          // Query to find documents where companyId matches the_companyId
          const budgetQuery = query(
            budgetDocRef,
            where("companyId", "==", theCompanyId)
          );
          const budgetQuerySnapshot = await getDocs(budgetQuery);

          if (!budgetQuerySnapshot.empty) {
            // Retrieve the first document that matches the query
            const budgetDocSnapshot = budgetQuerySnapshot.docs[0];
            const budgetUserData = budgetDocSnapshot.data();

            setBudget(budgetUserData.yearlyBudget);
            setUsed(budgetUserData.used);
            setBalance(budgetUserData.balance);

            fetchExpensesByPurpose(theCompanyId);
            fetchExpensesByDepartment(theCompanyId);

            // Query to find documents where companyId matches the_companyId
            const deptCollectionRef = collection(db, "departments");
            const departmentQuery = query(
              deptCollectionRef,
              where("companyId", "==", theCompanyId)
            );
            const departmentQuerySnapshot = await getDocs(departmentQuery);

            if (!departmentQuerySnapshot.empty) {
              // Retrieve the first document that matches the query
              const departmentDocSnapshot = departmentQuerySnapshot.docs[0];
              const departmentUserData = departmentDocSnapshot.data();

              setDepartments(departmentUserData.department);
            } else {
              errorMessage("No department data found for this company ID.");
            }
          } else {
            errorMessage("No budget data found.");
          }
        } else {
          errorMessage("No user data found for this company name.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [company]);

  const data = [
    {
      name: "Jan",
      uv: 0,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Feb",
      uv: 0,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Mar",
      uv: 0,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Apr",
      uv: 0,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "May",
      uv: 0,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Jun",
      uv: 0,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Jul",
      uv: 0,
      pv: 2300,
      amt: 2100,
    },
    {
      name: "Aug",
      uv: 0,
      pv: 4300,
      amt: 2000,
    },
    {
      name: "Sep",
      uv: 0,
      pv: 3300,
      amt: 2900,
    },
    {
      name: "Oct",
      uv: 0,
      pv: 2000,
      amt: 1100,
    },
    {
      name: "Nov",
      uv: 0,
      pv: 4300,
      amt: 2100,
    },
    {
      name: "Dec",
      uv: 0,
      pv: 3300,
      amt: 2100,
    },
  ];

  const data2 = [
    { name: "Travel", value: bar0 },
    { name: "Material", value: bar1 },
    { name: "Supplies", value: bar2 },
    { name: "Others", value: bar3 },
  ];
  const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F"];

  // Sort departments based on their count in descending order
  const sortedDepartments = departments.sort(
    (a, b) => (expensesByDepartment[b] || 0) - (expensesByDepartment[a] || 0)
  );

  return (
    <div className="Home">
      <div className="home_tab">
        <div className="home_intro">
          {role == "admin" ? (
            <>
              <div className="welcome">{company}</div>
            </>
          ) : (
            <>
              <div className="welcome">
                {firstname} {lastname}
              </div>
              <div className="welcome_text">{dept} Department</div>
            </>
          )}
        </div>
        <div className="home_info aly_info">
          <div className="info_card">
            <img src={good} alt="home_icon" />
            <div className="card_mini">
              <div className="card_label">Allocated Budget</div>
              <div className="card_number">{budget}</div>
            </div>
          </div>
          <div className="info_card">
            <img src={down} alt="home_icon" />
            <div className="card_mini">
              <div className="card_label">Total Spendings</div>
              <div className="card_number">{used}</div>
            </div>
          </div>
          <div className="info_card">
            <img src={pay} alt="home_icon" />
            <div className="card_mini">
              <div className="card_label">Available Balance</div>
              <div className="card_number">{balance}</div>
            </div>
          </div>
        </div>
      </div>
      <AreaChart
        width={950}
        height={300}
        data={data}
        margin={{
          top: 15,
          right: 30,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#95e6bf" fill="#95e6bf" />
      </AreaChart>
      <div className="other_visuals">
        <div className="pie_containerr">
          <div className="chart_head"> Spending chart</div>
          <div className="pie_section">
            <PieChart width={800} height={400}>
              <Pie
                data={data2}
                cx={180}
                cy={180}
                innerRadius={150}
                outerRadius={180}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
              >
                {data2.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            <div className="pie_dets">
              <span>
                <span>. </span> Travel
              </span>
              <span>
                <span>. </span> Materials
              </span>
              <span>
                <span>. </span> Supplies
              </span>
              <span>
                <span>. </span> Other
              </span>
            </div>
          </div>
        </div>
        <div className="progress_container">
          <div className="chart_head"> Top Requesters</div>
          {sortedDepartments.length > 0 ? (
            sortedDepartments.map((department, index) => (
              <div key={index}>
                <span className="progress_head">{department}</span>
                <ProgressBar now={expensesByDepartment[department] || 0} />
              </div>
            ))
          ) : (
            <p>Loading departments...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
