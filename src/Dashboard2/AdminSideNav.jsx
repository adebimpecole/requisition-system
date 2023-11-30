import React, { useState, useEffect, useContext, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import "../Dashboard/Nav.sass"
import { Context } from '../Utilities/Context';
import "../Authentication/Auth.sass"

import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc } from 'firebase/firestore';

import { ToastContainer } from 'react-toastify';
import Toastify from 'toastify-js'

import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

import emailjs from '@emailjs/browser';

import home from "../assets/home.svg"
import home2 from "../assets/home copy.svg"
import list from "../assets/list_alt.svg"
import list2 from "../assets/list_alt copy.svg"
import set from "../assets/settings.svg"
import set2 from "../assets/settings copy.svg"
import chart from "../assets/Group (2).svg"
import chart2 from "../assets/Group (2) copy.svg"
import link from "../assets/external-link.svg"
import newuser from "../assets/person_add_alt_1.svg"
import iclose from "../assets/close.svg"

const AdminSideNav = () => {
    const db = getFirestore();

    // getting the values dtored in the usecontext hook
    const { user, setuser, id, setid, errorMessage, successMessage, setpage, page } = useContext(Context);

    const emailRef = useRef('');
    const the_companyRef = useRef('');
    const the_companyIDRef = useRef('');

    const userDocRef = collection(db, 'users');
    const compDocRef = collection(db, 'companies');

    const query4 = query(userDocRef, where("userId", "==", id));

    useEffect(() => {
    }, [id])

    useEffect(() => emailjs.init('SSs84it7yCrmBJnMt'), []);

    const onSubmit = async () => {
        // const the_role = document.querySelector('input[name="role"]:checked').value;
        if (emailRef.current == '') {
            errorMessage("Please enter the user email")
        }
        else {
            try {
                const serviceId = 'service_t4divkd';
                const templateId = 'template_o58zoow';

                await getDocs(query4).then((querySnapshot1) => {
                    // Retrieve the first document that matches the query from the 'users' collection
                    const docSnapshot1 = querySnapshot1.docs[0];
                    const userData = docSnapshot1.data();
                    the_companyRef.current = userData.company_name;

                    const query5 = query(compDocRef, where("name", "==", the_companyRef.current));
                    getDocs(query5).then((querySnapshot1) => {
                        // Retrieve the first document that matches the query from the 'users' collection
                        const docSnapshot1 = querySnapshot1.docs[0];
                        const userData = docSnapshot1.data();
                        the_companyIDRef.current = userData.userId
                    })
                })
                await emailjs.send(serviceId, templateId, {
                    sender: user,
                    email: emailRef.current,
                    link: `http://localhost:5173/signup?companyId=${the_companyIDRef.current}&role=requester`,
                    role: "a Requester",
                    company: the_companyRef.current,
                });
                Swal.fire({
                    text: 'Invite successfully sent!',
                    customClass: {
                        popup: 'popup',
                        htmlContainer: 'container',
                        confirmButton: 'ok_button',
                    }
                })
                the_companyRef.current = '';
                the_companyIDRef.current = '';
            } catch (error) {
                console.log(error);
            }
        }
    };

    const catchEmail = (e) => {
        emailRef.current = e
    }

    // handles request actions
    const DeleteReq = () => {
        Swal.close()
    }


    const InviteUser = async () => {
        const swal = Swal.fire({
            html:
                "<div class='header_bar'>" +
                "<span class='close_container'>" +
                "<img id='close' src='" + iclose + "' alt='alert_icon' style='cursor:pointer'/>" +
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
                popup: 'invite_popup',
                htmlContainer: 'invite_container',
            },
        });

        // collect email
        const emailInput = document.getElementById('email-input');
        const input3Listener = () => catchEmail(emailInput.value);
        emailInput.addEventListener('input', input3Listener);

        // Close container
        const closeButton = document.getElementById('close');
        closeButton.addEventListener('click', () => DeleteReq());

        // send invite
        const inviteButton = document.getElementById('invite-button');
        inviteButton.addEventListener('click', () => onSubmit());
    }



    // Signing out
    const handleLogout = () => {
        console.log("clicked")
        signOut(auth).then(() => {
            // Sign-out successful.
            window.location.href = '*';
            console.log("Signed out successfully")
        }).catch((error) => {
            console.log(error)
        });
    }
    return (
        <div className='SideNav'>
            <ul>
                <div onClick={handleLogout}>Logo</div>
                <div className='list_segment'>
                    <li onClick={() => setpage("Dashboard")} className={`${page === "Dashboard" ? 'opened_tab' : ''}`}>
                        {page === "Dashboard" ? (
                            <img src={home2} alt='nav_icon' className='nav_icon' />
                        ) : (
                            <img src={home} alt='nav_icon' className='nav_icon' />
                        )}
                        <span>Home</span>
                    </li>
                    <li onClick={() => setpage("Company")} className={`${page === "Company" ? 'opened_tab' : ''}`}>
                        <img src={chart} alt='nav_icon' className='nav_icon' />
                        <span>Company</span>
                    </li>
                    <li onClick={() => setpage("Records")} className={`${page === "Records" ? 'opened_tab' : ''}`}>
                        {page === "Records" ? (
                            <img src={list2} alt='nav_icon' className='nav_icon' />
                        ) : (
                            <img src={list} alt='nav_icon' className='nav_icon' />
                        )}
                        <span>Records</span>
                    </li>
                    <li onClick={() => setpage("Analytics")} className={`${page === "Analytics" ? 'opened_tab' : ''}`}>
                        {page === "Analytics" ? (
                            <img src={chart2} alt='nav_icon' className='nav_icon' />
                        ) : (
                            <img src={chart} alt='nav_icon' className='nav_icon' />
                        )}
                        <span>Analytics</span>
                    </li>
                </div>
                <div className='list_segment'>
                    <li onClick={InviteUser} ><img src={newuser} alt='nav_icon' className='nav_icon' /><span>Invite User</span></li>
                </div>
            </ul>
            <ul>
                <li onClick={() => setpage("Settings")} className={`${page === "Settings" ? 'opened_tab' : ''}`}>
                    {page === "Settings" ? (
                        <img src={set2} alt='nav_icon' className='nav_icon' />
                    ) : (
                        <img src={set} alt='nav_icon' className='nav_icon' />
                    )}
                    <span>Settings</span>
                </li>
                <li onClick={handleLogout}><img src={link} alt='nav_icon' className='nav_icon' /><span>Log Out</span></li>
            </ul>
            <ToastContainer />
        </div>
    )
}
export default AdminSideNav
