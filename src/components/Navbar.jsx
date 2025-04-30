import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";
import API from "../services/api";

const Navbar = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const dropdownRef = useRef(null);

  console.log(currentUser, "mm");

  useEffect(() => {
    if (token) {
      fetch_current_user();
    }
  }, [token]);

  const handleLogout = () => {
    setCurrentUser("");
    dispatch(logoutUser());
    localStorage.removeItem("token");

    toast.success("Logout successful!");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    // fetch_current_user();

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetch_current_user = async () => {
    try {
      const response = await API.get("/users/user_current");
      console.log(response.data.avatar_url, "check it");
      const userOptions = response.data;
      setCurrentUser(userOptions);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.log(error);
    }
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
            {token && (
              <>
                <li>
                  <Link to="/projects">Projects</Link>
                </li>
                <li>
                  <Link to="/tasks">Tasks</Link>
                </li>
              </>
            )}
          </ul>

          <div className="user-profile" ref={dropdownRef}>
            {token ? (
              <img
                src={currentUser.avatar_url}
                alt="User"
                className="user-avatar"
                onClick={toggleDropdown}
              />
            ) : (
              <i
                className="fa-solid fa-user-plus user-icon"
                onClick={toggleDropdown}
              />
            )}

            {dropdownOpen && (
              <div className="dropdown-menu">
                {token ? (
                  <>
                    <Link to={`/users/${currentUser.id}`}>Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
