import React, { lazy, Suspense, useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import axios from "axios";
import { updateFCMToken, sendTokenToBackend } from "./config/firebase";

import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import "./App.css";
import HomePage from "./LandingPage/HomePage";
import { Context } from "./Utilities/Context";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { fetchData } from "./config/functions";
import useWebSocket from "./config/useWebSocket";

const Login = lazy(() => import("./Authentication/Login2"));
const Signup = lazy(() => import("./Authentication/Signup"));
const Signup2 = lazy(() => import("./Authentication/Signup2"));
const SignupB = lazy(() => import("./Authentication/SignupB"));
const Auth = lazy(() => import("./Authentication/Auth"));
const Authentication = lazy(() => import("./Authentication/Authentication"));
const Setup = lazy(() => import("./Authentication/Setup"));
const Setup2 = lazy(() => import("./Authentication/Setup2"));
const Setup5 = lazy(() => import("./Authentication/Setup5"));

const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
const AdminDash = lazy(() => import("./Dashboard2/AdminDash"));

import {Cloudinary} from "@cloudinary/url-gen";


function App() {
  const db = getFirestore();

  const cld = new Cloudinary({cloud: {cloudName: 'dddotdmjo'}});

  // alert messages
  const errorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_CENTER,
      className: "toast-message",
    });
  };
  const successMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  let [page, setpage] = useState(null);
  let [view, setView] = useState("Profile");
  let [user, setuser] = useState(null);
  let [role, setrole] = useState(null);

  let [id, setid] = useState(null);

  let [fcmToken, setfcmToken] = useState(null);

  let providerValue = useMemo(
    () => ({
      user,
      setuser,
      id,
      setid,
      errorMessage,
      successMessage,
      page,
      setpage,
      view,
      setView,
      fcmToken,
      setfcmToken,
      role,
      setrole,
    }),
    [
      user,
      setuser,
      id,
      setid,
      errorMessage,
      page,
      setpage,
      view,
      setView,
      fcmToken,
      setfcmToken,
      role,
      setrole,
    ]
  );

  // Save user to localStorage as a JSON string
  useEffect(() => {
    if (user == null || user == 0 || user == undefined) {
    } else {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("id", JSON.stringify(id));
      localStorage.setItem("page", JSON.stringify(page));
      localStorage.setItem("token", JSON.stringify(fcmToken));
      localStorage.setItem("role", JSON.stringify(role));
    }
  }, [user]);

  // Retrieve user from localStorage and parse it to an object
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedId = localStorage.getItem("id");
    const storedPage = localStorage.getItem("page");
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedUser) {
      setuser(JSON.parse(storedUser));
    }
    if (storedId) {
      setid(JSON.parse(storedId));
    }
    if (storedPage) {
      setpage(JSON.parse(storedPage));
    }
    if (storedToken) {
      setfcmToken(JSON.parse(storedToken));
      if (storedToken === undefined) {
        setfcmToken(null);
      }
    }
    if (storedRole) {
      setrole(JSON.parse(storedRole));
    }
    // fetchData(id);
  }, []);

  useEffect(() => {
    if (id != null) {
      console.log(id);
      const socket = new WebSocket(`ws://localhost:8080/${id}`);

      socket.onopen = () => {
        console.log("WebSocket connection established");
        // Perform actions upon successful connection
        // Example: socket.send('Hello, WebSocket Server!');
      };

      socket.onmessage = (event) => {
        console.log("Received message:", event.data);
        // Handle incoming messages from the WebSocket server
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
        // Handle WebSocket connection close event
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Handle WebSocket errors
      };
    }
  }, [id]);

  return (
    <BrowserRouter>
      <>
        <Context.Provider value={providerValue}>
          <Routes>
            <Route exact path="*" element={<HomePage />} />
            <Route
              exact
              path="/login"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Login />
                </Suspense>
              }
            />
            {/* URL Sign up */}
            <Route
              exact
              path="/signup"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Signup />
                </Suspense>
              }
            />
            {/* Company Sign up */}
            <Route
              exact
              path="/signup2"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Signup2 />
                </Suspense>
              }
            />
            {/* Normal Sign up */}
            <Route
              exact
              path="/signupb"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SignupB />
                </Suspense>
              }
            />
            <Route
              exact
              path="/dashb"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              exact
              path="/admindash"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <AdminDash />
                </Suspense>
              }
            />
            <Route
              exact
              path="/auth"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Auth />
                </Suspense>
              }
            />
            <Route
              exact
              path="/authenticate"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Authentication />
                </Suspense>
              }
            />
            <Route
              exact
              path="/setup"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Setup />
                </Suspense>
              }
            />
            <Route
              exact
              path="/setup2"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Setup2 />
                </Suspense>
              }
            />
            <Route
              exact
              path="/setup5"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Setup5 />
                </Suspense>
              }
            />
          </Routes>
        </Context.Provider>
      </>
    </BrowserRouter>
  );
}

export default App;
