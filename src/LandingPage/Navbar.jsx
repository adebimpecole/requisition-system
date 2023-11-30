import './Navbar.sass';

import {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='Navbar'>
      <div className='left_nav'>
        Logo
      </div>
      <div className='middle_nav'>
        <ul>
          <li>Features</li>
          <li>How it Works</li>
        </ul>
      </div>
      <div className='right_nav'>
        <Link to='/login' className='nav_login'>Log In</Link>
        <Link to='/auth' className='nav_button'>Sign Up</Link>
      </div>
    </div>
  );
};

export default Navbar;
