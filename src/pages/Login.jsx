import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import LoginImage from "./signin.jpg";
import { toast } from "react-toastify";

const LogoSVG = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="19" cy="19" r="19" fill="url(#paint0_linear)"/>
    <path d="M12 26L26 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M12 12L26 26" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4f8cff"/>
        <stop offset="1" stopColor="#7f9cf5"/>
      </linearGradient>
    </defs>
  </svg>
);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div className="login-bg premium-bg">
      {/* Abstract SVG shapes for background */}
      <svg className="bg-shape bg-shape-1" width="400" height="400" viewBox="0 0 400 400" fill="none"><ellipse cx="200" cy="200" rx="200" ry="200" fill="url(#ellipse1)" fillOpacity="0.18"/><defs><linearGradient id="ellipse1" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse"><stop stopColor="#7f9cf5"/><stop offset="1" stopColor="#4f8cff"/></linearGradient></defs></svg>
      <svg className="bg-shape bg-shape-2" width="300" height="300" viewBox="0 0 300 300" fill="none"><ellipse cx="150" cy="150" rx="150" ry="150" fill="url(#ellipse2)" fillOpacity="0.13"/><defs><linearGradient id="ellipse2" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse"><stop stopColor="#a084ee"/><stop offset="1" stopColor="#7f9cf5"/></linearGradient></defs></svg>
      <div className="login-card premium-card">
        {/* Left Side */}
        <div className="login-image-col premium-left">
          <div className="premium-logo-row">
            <LogoSVG />
            <span className="premium-app-name">Ticket Board</span>
          </div>
          <div className="premium-tagline">Welcome to Ticket Board — manage tasks effortlessly</div>
          <ul className="premium-features">
            <li>✔️ Track tasks easily</li>
            <li>🤝 Collaborate in real-time</li>
            <li>📅 Stay organized</li>
          </ul>
          <div className="premium-image-abstract">
            <img src={LoginImage} alt="Abstract" className="premium-image" />
          </div>
        </div>
        {/* Right Side (Glassmorphism Card) */}
        <div className="login-form-col premium-form-col">
          <div className="glass-card">
            <h2 className="login-title">Sign In</h2>
            <div className="login-subtext">Access your dashboard</div>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={Yup.object({
                email: Yup.string().email().required("Required"),
                password: Yup.string().required("Required"),
              })}
              onSubmit={(values) => {
                dispatch(loginUser(values))
                  .then((response) => {
                    if (response.error) {
                      throw new Error(response.error.message || "Login failed!");
                    }
                    toast.success("✅ Login successful!");
                    navigate("/");
                  })
                  .catch((error) => {
                    toast.error(`❌ ${error.message || "Login failed. Please try again."}`);
                  });
              }}
            >
              <Form className="login-form">
                <div className="input-group">
                  <span className="input-icon">
                    {/* Email SVG icon */}
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#888" strokeWidth="2" d="M4 4h16v16H4z"/><path stroke="#888" strokeWidth="2" d="M4 4l8 8 8-8"/></svg>
                  </span>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input-field "
                    autoComplete="username"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="input-error" />
                <div className="input-group">
                  <span className="input-icon">
                    {/* Password SVG icon */}
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2" stroke="#888" strokeWidth="2"/><path stroke="#888" strokeWidth="2" d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </span>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input-field"
                    autoComplete="current-password"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="input-error" />
                <div className="remember-row">
                  <label className="remember-label">
                    <input type="checkbox" id="remember" className="remember-checkbox" />
                    Remember me
                  </label>
                </div>
                <button type="submit" className="login-btn premium-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
                {error && <p className="input-error">{error.message}</p>}
              </Form>
            </Formik>
            <div className="login-footer premium-footer">
              <div className="footer-links-row">
                <Link to="/signup" className="signup-link">Create an account</Link>
                <span className="footer-link-divider">|</span>
                <a href="#" className="signup-link">Forgot password?</a>
              </div>
              <div className="login-divider"><span>or login with</span></div>
              <div className="social-login-row">
                <a href="#" className="social-btn google" title="Login with Google">
                  {/* Google SVG */}
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.22-1.39 3.58-5.27 3.58-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.03.77 3.73 1.43l2.55-2.48C16.13 3.99 14.13 3 12 3 6.48 3 2 7.48 2 13s4.48 10 10 10c5.52 0 10-4.48 10-10 0-.67-.07-1.32-.2-1.9z"/></svg>
                </a>
                <a href="#" className="social-btn facebook" title="Login with Facebook">
                  {/* Facebook SVG */}
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/></svg>
                </a>
                <a href="#" className="social-btn twitter" title="Login with Twitter">
                  {/* Twitter SVG */}
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.77c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.11 2.94 3.97 2.97A8.6 8.6 0 012 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 007.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022.46 6z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="premium-footer-bar">
        © 2025 Ticket Board &nbsp;|&nbsp; <a href="#">Terms</a> &nbsp;|&nbsp; <a href="#">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default Login;
