import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { Link } from "react-router-dom";
import "./Navbar.css"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    console.log("Logout button clicked!"); 
    dispatch(logoutUser());
    toast.success("Logout successful!");
    navigate("/login");
  };
  return (
    <>
      <nav>
        <div className="navbar">
          <div className="logo">
            <Link to="/">Ticket Board</Link>
          </div>
          <ul className="menu">
             <li>
                <Link to="/">Home</Link>
              </li>
            {token ? (
              <>
                <li>
                  <Link to="/tasks">Tasks</Link>
                </li>
                <li>
                  <Link to="/create_task">Create Task</Link>
                </li>

                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
