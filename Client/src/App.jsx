import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import UserData from "./UserData";

export default function App() {
  const labels = ["firstName", "lastName", "age", "phone", "gender"];
  const inputTypes = {
    firstName: "text",
    lastName: "text",
    age: "number",
    phone: "number",
    gender: "radio",
  };

  const initialFormData = {
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    gender: "",
  };

  const genderOptions = ["Male", "Female", "Others"];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    gender: "",
    id: null,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Required";
    if (!formData.lastName) newErrors.lastName = "Required";
    if (!formData.age) newErrors.age = "Required";
    else if (formData.age < 18 || formData.age > 100)
      newErrors.age = "Must be between 18 and 100";
    if (!formData.phone) newErrors.phone = "Required";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";
    if (!formData.gender) newErrors.gender = "Required";
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKeyPress = (event) => {
    const charCode = event.keyCode;
    if (
      charCode !== 8 &&
      charCode !== 46 &&
      (charCode < 37 || charCode > 40) &&
      (charCode < 48 || charCode > 57) &&
      (charCode < 96 || charCode > 105)
    ) {
      event.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Data before sending:", formData);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Form submitted successfully:", data);
          navigate(`/user-data/${data.id}`, {
            state: { labels, formData: data },
          });
        } else {
          console.error("Failed to submit form");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setErrors(validationErrors);
    }
    setFormData(initialFormData);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="FormParent">
            <h1>Form</h1>
            <form className="Form" onSubmit={handleSubmit}>
              <div className="FormChildContainer">
                {labels.map((label) => {
                  const isFocused = formData[name] ? "focused" : "";
                  return (
                    <div className="FormChild" key={label}>
                      {inputTypes[label] === "radio" ? (
                        <div className="FormRadio">
                          <label>
                            {label.charAt(0).toUpperCase() + label.slice(1)}:
                          </label>
                          <div className="OutRadioInput">
                            {genderOptions.map((value, index) => (
                              <label key={index}>
                                <input
                                  type="radio"
                                  name={label}
                                  value={value}
                                  checked={formData[label] === value}
                                  onChange={handleChange}
                                />
                                {value}
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className={`FormParentt ${isFocused}`}>
                          <label htmlFor={label} className="Label">
                            {label.charAt(0).toUpperCase() + label.slice(1)}
                          </label>
                          <input
                            type={inputTypes[label]}
                            name={label}
                            className="FormInput"
                            value={formData[label]}
                            onChange={handleChange}
                            onFocus={(e) =>
                              e.target.parentNode.classList.add("focused")
                            }
                            onBlur={(e) => {
                              if (!e.target.value) {
                                e.target.parentNode.classList.remove("focused");
                              }
                            }}
                            onKeyDown={
                              inputTypes[label] === "number"
                                ? handleKeyPress
                                : undefined
                            }
                            inputMode={
                              inputTypes[label] === "number"
                                ? "numeric"
                                : undefined
                            }
                            pattern={
                              inputTypes[label] === "number"
                                ? "\\d*"
                                : undefined
                            }
                          />
                          {errors[label] && (
                            <div className="error">{errors[label]}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <input type="submit" value="Submit" className="SubmitBtn" />
            </form>
          </div>
        }
      />
      <Route path="/user-data/:id" element={<UserData labels={labels} />} />
    </Routes>
  );
}
