import Logo from './Logo';
import './Navbar.sass';

import {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='Navbar'>
      <div className='left_nav'>
        <Logo color="#4CA5F1"/>
      </div>
      <div className='right_nav'>
        <Link to='/login' className='nav_login'>Log In</Link>
        <Link to='/auth' className='nav_button'>Get Started</Link>
      </div>
    </div>
  );
};

export default Navbar;
