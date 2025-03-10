import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import LoginImage from "./signin.jpg";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div className="container">
      <div className="image">
        <img src={LoginImage} alt="Illustration" />
      </div>
      <div className="form">
        <h2>Log In</h2>
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
                navigate("/tasks");
              })
              .catch((error) => {
                toast.error(`❌ ${error.message || "Login failed. Please try again."}`);
              });
          }}          
        >
          <Form>
            <div className="input-group">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="input-field"
              />
            </div>
            <ErrorMessage name="email" component="div" />

            <div className="input-group">
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="input-field"
              />
            </div>
            <ErrorMessage name="password" component="div" />

            <div className="remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p>{error.message}</p>}
          </Form>
        </Formik>
        <p>
          <Link to="/signup">Create an account</Link>
        </p>
        <p>Or login with</p>
        <div className="social-icons">
          <a href="#" className="facebook">
            F
          </a>
          <a href="#" className="twitter">
            T
          </a>
          <a href="#" className="google">
            G
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
