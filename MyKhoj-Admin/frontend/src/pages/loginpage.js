import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./loginform.css";
// import { ReactFormValidation } from "../utils/ReactFormValidation";
import Header from "../components/Lheader";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL_HTTP, BASE_URL_HTTPS } from "../utils/apiConfig";


const Loginpage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    credentials: "",
    password: "",
  });

  const baseProtocol = window.location.protocol === "https:" ? "https" : "http";
  const baseURL = baseProtocol === "https" ? BASE_URL_HTTPS : BASE_URL_HTTP;

  console.log(baseURL)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const reactValidationResponses = []; // Validation responses array

    // const credentialsNotNull = ReactFormValidation.notNull(
    //   user.credentials,
    //   "User Name"
    // );
    // if (credentialsNotNull) {
    //   reactValidationResponses.push(credentialsNotNull);
    // } else {
    //   const credentialsMinLength = ReactFormValidation.minLength(
    //     user.credentials,
    //     3,
    //     "User Name"
    //   );
    //   if (credentialsMinLength) {
    //     reactValidationResponses.push(credentialsMinLength);
    //   }
    // }

    // const PassNotNull = ReactFormValidation.notNull(user.password, "Password");
    // if (PassNotNull) {
    //   reactValidationResponses.push(PassNotNull);
    // } else {
    //   const PasswordMinLength = ReactFormValidation.minLength(
    //     user.password,
    //     8,
    //     "Password"
    //   );
    //   const PasswordMaxLength = ReactFormValidation.maxLength(
    //     user.password,
    //     12,
    //     "Password"
    //   );
    //   if (PasswordMinLength) {
    //     reactValidationResponses.push(PasswordMinLength);
    //   } else if (PasswordMaxLength) {
    //     reactValidationResponses.push(PasswordMaxLength);
    //   } else {
    //     const PasswordhasCapitalLetter = ReactFormValidation.hasCapitalLetter(
    //       user.password,
    //       "Password"
    //     );
    //     if (PasswordhasCapitalLetter) {
    //       reactValidationResponses.push(PasswordhasCapitalLetter);
    //     }
    //     const PasswordhasSmallLetter = ReactFormValidation.hasSmallLetter(
    //       user.password,
    //       "Password"
    //     );
    //     if (PasswordhasSmallLetter) {
    //       reactValidationResponses.push(PasswordhasSmallLetter);
    //     }
    //     const PasswordhasNumber = ReactFormValidation.hasNumber(
    //       user.password,
    //       "Password"
    //     );
    //     if (PasswordhasNumber) {
    //       reactValidationResponses.push(PasswordhasNumber);
    //     }
    //     const PasswordhasSpecialCharacter =
    //       ReactFormValidation.hasSpecialCharacter(user.password, "Password");
    //     if (PasswordhasSpecialCharacter) {
    //       reactValidationResponses.push(PasswordhasSpecialCharacter);
    //     }
    //     const PasswordhasNoSequence = ReactFormValidation.hasNoSequence(
    //       user.password,
    //       "Password"
    //     );
    //     if (PasswordhasNoSequence) {
    //       reactValidationResponses.push(PasswordhasNoSequence);
    //     }
    //   }
    // }

    // if (reactValidationResponses.length > 0) {
    //   reactValidationResponses.forEach((response) => {
    //     toast.error(response);
    //   });
    //   return;
    // }
    try {
      const response = await axios.post('localhost:5000/userAuth', user);
      toast.success(response.data);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.log(status, data);

        if (data.errors && data.errors.length > 0) {
          data.errors.forEach((errorMessage) => {
            toast.error(errorMessage);
          });
        } else {
          toast.error(error.response.data);
        }
      }
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "hsl(0, 0%, 96%)",
          position: "absolute",
          zIndex: "1",
        }}
      >
        <Header />
      </div>
      <section className="position-relative">
        <div
          className="px-4 py-5 px-md-5 text-center text-lg-start"
          style={{ height: "90.5vh" }}
        >
          <div className="container-fluid">
            <div
              className="row gx-lg-5 align-items-top "
              style={{
                marginLeft: "0px",
                marginRight: "0px",
                marginTop: "50px",
              }}
            >
              <div className="col-lg-6 col-md-6 mb-5 mb-lg-0">
                <h1 className="my-5 display-4 fw-bold ls-tight ">
                  The best offer <br />
                  <span className="text-primary">for your business</span>
                </h1>
                <p
                  style={{ color: "hsl(217, 10%, 50.8%)" }}
                  className="text-left"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Eveniet, itaque accusantium odio, soluta, corrupti aliquam
                  quibusdam tempora at cupiditate quis eum maiores libero
                  veritatis? Dicta facilis sint aliquid ipsum atque?
                </p>
              </div>
              <div className="col-lg-6 col-md-6 mb-5 mb-lg-0 d-flex justify-content-center">
                <div className="card" style={{ width: "380px" }}>
                  <div className="card-body py-3 px-md-3">
                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-2">
                        <label
                          className="form-label  d-flex justify-content-start"
                          htmlFor="credentials"
                        >
                          User Name
                        </label>
                        <input
                          type="text"
                          id="credentials"
                          className="form-control"
                          name="credentials"
                          placeholder="Enter your Username"
                          autoComplete="off"
                          value={user.credentials}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-outline mb-4">
                        <label
                          className="form-label d-flex justify-content-start"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          name="password"
                          placeholder="Enter your Password"
                          autoComplete="off"
                          value={user.password}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col text-start mb-3 mt-0 ">
                        <Link to="/forgotpassword">Forgot password?</Link>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary  mb-4 d-flex justify-content-start"
                      >
                        Sign in
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Loginpage;
