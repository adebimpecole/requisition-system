import './HomePage.sass';
import Navbar from './Navbar';

import {Link} from 'react-router-dom';

import home from '../assets/home_img.png';


const HomePage = () => {
  return (
    <div className='HomePage'>
      <Navbar />
      <div className='home_content'>
        <div className='home_text'>
          <h1 className='home_header'>Lorem ipsum dolor sit amet</h1>
          <div className='home_sub_text'>Ut pulvinar faucibus felis, ac sodales ipsum finibus ut. Sed pretium eros eu semper interdum. 
          Phasellus eget nisl ac magna venenatis dictum in at justo. Pellentesque 
          habitant morbi tristique senectus et netus et malesuada fames ac turpis 
          egestas. </div>
          <Link to='/auth' className='nav_button'>Sign Up</Link>
        </div>
        <div className='home_image'>
          <img src={home} alt='home_image' className='the_image' />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
