import React from 'react'

const Setup = () => {
  return (
    <div className='auth'>
      <div className='auth_background'>
        <div className='nav'>
          <Nav />
        </div>
      </div>
      <div className='auth_content'>
        <div className='auth_section'>
          <h2 className='page_header'>Set Up Your Company Info</h2>
          <form>
            <div className="required"></div>
            <label>
              <span className='setup_header'>Add Department</span>
              <span className='setup_info'>
                Kindly input the various departments that exist in your company
                and save your enteries
              </span>
              <input id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address *"
                />
            </label>
            <label>
              <span className='setup_header'>Add Budget</span>
              <span className='setup_info'>
                Dedicate and approve your company's budget for whatever time
                period is required.
              </span>
              <input id="password"
                name="password"
                type="password"
                required
                placeholder="Password *"
                 />
            </label>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Setup
