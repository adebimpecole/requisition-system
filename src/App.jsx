import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import axios from "axios";

import './App.css'
import HomePage from './LandingPage/HomePage';
import { Context } from './Utilities/Context';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = lazy(() => import('./Authentication/Login2'));
const Signup = lazy(() => import('./Authentication/Signup'));
const Signup2 = lazy(() => import('./Authentication/Signup2'));
const SignupB = lazy(() => import('./Authentication/SignupB'));
const Auth = lazy(() => import('./Authentication/Auth'));
const Authentication = lazy(() => import('./Authentication/Authentication'));


const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const AdminDash = lazy(() => import('./Dashboard2/AdminDash'));

function App() {

  // alert messages
  const errorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_CENTER,
      className: "toast-message"
    });
  };
  const successMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER
    });
  };


  let [page, setpage] = useState(null)
  let [view, setView] = useState("Profile")
  let [user, setuser] = useState(null)
  let [id, setid] = useState(null)
  let providerValue = useMemo(() => ({ user, setuser, id, setid, errorMessage, successMessage, page, setpage, view, setView}), [user, setuser, id, setid, errorMessage, page, setpage, view, setView ])


  // Save user to localStorage as a JSON string
  useEffect(() => {
    if (user == null || user == 0 || user == undefined) {
    }
    else {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("id", JSON.stringify(id));
      localStorage.setItem("page", JSON.stringify(page));

    }

  }, [user]);

  // Retrieve user from localStorage and parse it to an object
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedId = localStorage.getItem("id");
    const storedPage = localStorage.getItem("page");

    if (storedUser) {
      setuser(JSON.parse(storedUser));
    }
    if (storedId) {
      setid(JSON.parse(storedId));
    }
    if (storedPage) {
      setpage(JSON.parse(storedPage));
    }
  }, []);

  return (
    <BrowserRouter>
      <>
        <Context.Provider value={providerValue}>
          <Routes>
            <Route exact path='*' element={<HomePage />} />
            <Route exact path='/login' element={
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            } />
            {/* URL Sign up */}
            <Route exact path='/signup' element={
              <Suspense fallback={<div>Loading...</div>}>
                <Signup />
              </Suspense>
            } />
            {/* Company Sign up */}
            <Route exact path='/signup2' element={
              <Suspense fallback={<div>Loading...</div>}>
                <Signup2 />
              </Suspense>
            } />
            {/* Normal Sign up */}
            <Route exact path='/signupb' element={
              <Suspense fallback={<div>Loading...</div>}>
                <SignupB />
              </Suspense>
            } />
            <Route exact path='/dashb' element={
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            } />
            <Route exact path='/admindash' element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminDash />
              </Suspense>
            } />
            <Route exact path='/auth' element={
              <Suspense fallback={<div>Loading...</div>}>
                <Auth />
              </Suspense>
            } />
            <Route exact path='/authenticate' element={
              <Suspense fallback={<div>Loading...</div>}>
                <Authentication/>
              </Suspense>
            } />
          </Routes>
        </Context.Provider>
      </>
    </BrowserRouter>
  );
}

export default App;
