import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link} from "react-router-dom";
import './Login.css';
import LoginImage from "./login.jpg";
import { toast } from "react-toastify";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div className="container">
      <div className="image">
        <img src={LoginImage} alt="Illustration" />
      </div>
      <div className="form">
        <h2>Signup</h2>
        <Formik
          initialValues={{ email: "", password: "", password_confirmation: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email().required("Required"),
            password: Yup.string().min(6).required("Required"),
            password_confirmation: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
          })}
          onSubmit={(values) => {
            dispatch(signupUser(values))
              .then((response) => {
                if (response.error) {
                  throw new error(response.error.message || 'SignUp fail')
                }
                toast.success("✅ Sign Up successful!");
                navigate("/login")
            })
            .catch((error)=> {
              toast.error(`❌ ${error.message || "Sign Up failed. Please try again."}`)
            });
          }}
        >
          <Form>
            <div className="input-group">
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div className="input-group">
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <div className="input-group">
              <Field type="password" name="password_confirmation" placeholder="Confirm Password" />
              <ErrorMessage name="password_confirmation" component="div" />
            </div>
            <p>
              <Link to="/login">I have already account</Link>
            </p>
            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </button>
            {error && <p>{error.message}</p>}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
