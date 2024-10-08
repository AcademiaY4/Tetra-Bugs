import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@nextui-org/react"; // Removed unused Button import
import { LoginUser } from "./apiCalls/users";
import { message } from "antd";
import imgSrc from "./loginImg.jpg";
import { Icon } from '@iconify/react';
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./apiCalls/api";

export default function Login({ isDark }) {
  
  // State variables to store form data
  const [formData, setFormData] = useState({
    emailAddress: "",
    password: "",
  });
  const navigate = useNavigate();

  // Text Input
  const handleInputFocus = (e) => {
    e.target.parentNode.classList.add("active-label");
  };

  const handleInputBlur = (e) => {
    if (e.target.value === "") {
      e.target.parentNode.classList.remove("active-label");
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onFinish = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await LoginUser(formData);
      console.log("Response:", response);
      if (response.success) {
        message.success("response.message");
        localStorage.setItem("AuthToken", response.data);
        navigate("/"); // Use navigate to redirect within the app
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message);
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/dashboard");
  //   }
  // }, []);

  const responseGoogle = async (authResult) => {
		try {
			if (authResult["code"]) {
				const result = await googleAuth(authResult.code);
				const {email, name, image} = result.data.user;
				const token = result.data.token;
				const obj = {email,name, token, image};
				localStorage.setItem('user-info',JSON.stringify(obj));
        navigate('/');
        window.location.reload();
			} else {
				console.log(authResult);
				throw new Error(authResult);
			}
		} catch (e) {
			console.log('Error while Google Login...', e);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: "auth-code",
	});

  return (
    <div className="page-container">
      <div className="flex-container">
        <div className="image-container">
          <img src={imgSrc} alt="Your Image" className="custom-image" />
        </div>
        <div className="form-container">
          <Card className="custom-card">
            <form onSubmit={onFinish}>
              <div className="logo-container">
                <h1
                  className="logo-text"
                  style={{ marginTop: "20px", textAlign: "center" }}
                >
                  CodePedia
                </h1>
              </div>
              <span className="heading1">Sign in</span>

              {/* Email address */}
              <div className="input-container" style={{ marginTop: "20px" }}>
                <input
                  className="primary-form-element"
                  type="email"
                  id="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={onInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
                <label
                  className={`primary-form-element ${isDark ? "dark" : "light"}`}
                  htmlFor="email"
                >
                  Email
                </label>
              </div>

              {/* Password */}
              <div className="input-container" style={{ marginTop: "20px" }}>
                <input
                  className="primary-form-element"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
                <label
                  className={`primary-form-element ${isDark ? "dark" : "light"}`}
                  htmlFor="password"
                >
                  Password
                </label>
              </div>

              <section
                className="center"
                style={{ justifyContent: "center", flexDirection:'column', gap:'6px', margin: "20px 0"}}
              >
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: '100%'
                  }}
                >
                  Submit
                </button>
                <button
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    padding: "10px 20px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: '100%',
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    gap: "10px"
                  }}
                  onClick={googleLogin}
                >
                  <Icon icon="logos:google-icon" />Sign in with Google
                </button>
              </section>
              <p className="link-container">
                Don't have an account?{" "}
                <Link to="/register">Click here to register</Link>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
