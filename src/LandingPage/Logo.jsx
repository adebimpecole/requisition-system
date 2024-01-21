import React from 'react'
import './Navbar.sass';

const Logo = (props) => {
  return (
    <div className='mainLogo'>
      <span style={{color: props.color}}>Requisitor</span>
    </div>
  )
}

export default Logo
