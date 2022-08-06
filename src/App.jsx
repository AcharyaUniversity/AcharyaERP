import React from "react";
import Login from "./containers/Login/Login";
import ThemeContext from "./utils/ThemeContext";
import ForgotPassword from "./containers/ForgotPassword/ForgotPassword";
import ResetPassword from "./containers/ResetPassword/ResetPassword";
import StaffLogin from "./components/LoginForms/StaffLogin";
import StudentLogin from "./components/LoginForms/StudentLogin";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <ThemeContext>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
          <Route exact path="/ResetPassword" element={<ResetPassword />} />
          <Route exact path="/StaffLogin" element={<StaffLogin />} />
          <Route exact path="/StudentLogin" element={<StudentLogin />} />
        </Routes>
      </Router>
    </ThemeContext>
  );
}

export default App;
