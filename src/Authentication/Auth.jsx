import React, {useState} from 'react'
import { Link } from "react-router-dom";
import "./Auth.sass"
import Nav from './Nav';
import user_img from "../assets/person.svg"
import company_img from "../assets/business.svg"

const Auth = () => {
    
    return (
        <div className='main_Auth'>
            <div className='auth_background'>
                <div className='nav'>
                    <Nav />
                </div>
            </div>
            <div className='auth_content'>
                <div className='sub_auth'>
                    <h2 className='header_question'>How are you planning to use Requisitor?</h2>
                    <div className='question_text'>Select the option that best suits your needs</div>
                    <div className='select_user'>
                        <Link to='/signup2' className='pick_user'>
                            <img className='user_icon' alt='user_icon' src={company_img} />
                            <div className='option_text'>
                                <div className='lil_head'>
                                    Business
                                </div>
                                <div className='box_text'>
                                    Set up an account for your company, this account grants
                                    access to allfeatures and acts as a superrvisor account
                                </div>
                            </div>
                        </Link>
                        <div className='or_text'>or</div>
                        <Link to='/signupb' className='pick_user'>
                            <img className='user_icon' alt='user_icon' src={user_img} />
                            <div className='option_text'>
                                <div className='lil_head'>
                                    Employee
                                </div>
                                <div className='box_text'>
                                    Set up an employee account, this account grants the user
                                    access to their respective company domain.
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth

