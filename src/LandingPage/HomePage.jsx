import "./HomePage.sass";
import Navbar from "./Navbar";

import { Link } from "react-router-dom";

import home from "../assets/fix.png";

const HomePage = () => {
  return (
    <div className="HomePage">
      <Navbar />
      <div className="home_content">
        <div className="home_text">
          <h1 className="home_header">Empower Your Financial Workflow</h1>
          <div className="home_sub_text">
            Streamline your financial requisition process with our user-friendly
            platform. Simplify requests and approvals, ensuring
            optimal control and transparency in your organization's spending.
            Experience a smarter way to manage expenses with our Financial
            Requisition System.{" "}
          </div>
          <div className="hompeage_buttons">
            <Link to="/auth" className="nav_button">
              Get Started
            </Link>
            <Link to="/login" className="nav_button2">
              Log in
            </Link>
          </div>
        </div>
        <div className="home_image">
          <img src={home} alt="home_image" className="the_image" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
