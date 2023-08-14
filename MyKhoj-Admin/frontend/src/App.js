import React from "react";
import { ToastContainer } from 'react-toastify';
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Loginform from "./pages/loginpage";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Loginform />} />
      </Routes>
    </>
  );
}

export default App;
