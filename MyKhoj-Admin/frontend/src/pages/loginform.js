import React, { useState } from 'react'
import Header from '../components/Lheader'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './loginform.css'

const Loginform = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    credentials: "", Password: ""
  });

  let name, value;

  const handleinput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });

  }

  const isValidPassword = (Password) => {
    // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(user.Password);
  };
  const SubmitData = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/", user)

        .then((response) => {
          console.log(response)
          toast.success(response.data);
          navigate('/dashboard')
        })

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.log(status, data);

        if (data.errors && data.errors.length > 0) {
          data.errors.forEach(errorMessage => {
            toast.error(errorMessage);
          });
        }
        else if (!isValidPassword(user.Password)) {
          toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character');
          return;
        }

        else {
          toast.error(error.response.data);
        }
      }

    }
  };

  return (
    <>
      <div style={{ width: "100%", backgroundColor: "hsl(0, 0%, 96%)", position: "absolute", zIndex: "1" }}>
        <Header />
      </div>
      <section className="position-relative" >
        <div className="px-4 py-5 px-md-5 text-center text-lg-start" style={{ height: "90.5vh" }}>
          
          <div className="container-fluid">
            <div className="row gx-lg-5 align-items-top " style={{ marginLeft: "0px", marginRight: "0px", marginTop: "50px" }}>
              <div className="col-lg-6 col-md-6 mb-5 mb-lg-0">
                <h1 className="my-5 display-4 fw-bold ls-tight ">
                  The best offer <br />
                  <span className="text-primary">for your business</span>
                </h1>
                <p style={{ color: "hsl(217, 10%, 50.8%)", }} className='text-left'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
                  itaque accusantium odio, soluta, corrupti aliquam quibusdam
                  tempora at cupiditate quis eum maiores libero veritatis? Dicta
                  facilis sint aliquid ipsum atque?
                </p>
              </div>
              <div className="col-lg-6 col-md-6 mb-5 mb-lg-0 d-flex justify-content-center">
                <div className="card" style={{ width: "380px" }}>
                  <div className="card-body py-3 px-md-3">
                    <form method='POST'>
                      <div className="form-outline mb-2">
                        <label className="form-label  d-flex justify-content-start" id='username'> User Name </label>
                        <input
                          type="text"
                          id="credentials"
                          className="form-control"
                          name='credentials'
                          placeholder='enter your Username'
                          autoComplete='off'
                          value={user.credentials}
                          onChange={handleinput}
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label d-flex justify-content-start" id='password'>
                          Password
                        </label>
                        <input
                          type="password"
                          id="Password"
                          className="form-control"
                          name='Password'
                          minLength={8}
                          maxLength={15}
                          placeholder='enter your Password'
                          autoComplete='off'
                          value={user.Password}
                          onChange={handleinput}
                        /> </div>
                      <div className="col text-start mb-3 mt-0 ">

                        <Link to="/forgotpassword">Forgot password?</Link>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary  mb-4 d-flex justify-content-start" onClick={SubmitData}
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
  )
}
export default Loginform