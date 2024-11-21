import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserData from "./UserData";
import DisplayTable from "./DisplayTable";
import SignUp from "./SignUp";
import Login from "./Login";

export default function App() {
  const labels = [
    "name",
    "age",
    "password",
    "image",
  ];

  return (
      <Routes>
        <Route path="*" element={<SignUp />} />
        <Route path="/user-data/:id" element={<UserData labels={labels} />} />
        <Route path="/all-users" element={<DisplayTable />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  );
}