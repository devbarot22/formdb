import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import UserData from "./UserData";
import DisplayTable from "./DisplayTable";
import axios from "axios";

export default function App() {
  const labels = ["firstName", "lastName", "age", "phone", "gender", "image"];
  const inputTypes = {
    firstName: "text",
    lastName: "text",
    age: "number",
    phone: "number",
    gender: "radio",
    image: "file",
  };

  const initialFormData = {
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    gender: "",
    image: null,
  };

  const genderOptions = ["Male", "Female", "Others"];
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState(formData.image);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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

    postMethod(formData);
  };

  // Creating function to post data on server
  const postMethod = (data) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/users/createUser`, data)
      .then((response) => {
        const data = response.data;
        console.log(formData.image);
        if (formData.image) {
          uploadPostImage(formData.image, data.id)
            .then(() => {
              console.log(formData.image);
            })
            .catch((error) => {
              console.log("Error in Uploading Image !! ");
              console.error(error);
              // console.log(error.response.data);
            });
        }

        if (!errors.isError) {
          console.log(
            "User Registered Successfully! User ID: " + response.data.id
          );
          navigate(`user-data/${response.data.id}`, {
            state: { labels, formData: data },
          });
          setUser({});
          setFormData(initialFormData);
        }
      })
      .catch((error) => {
        console.log("Error! Something went wrong");
        console.log(error);

        if (error.response && error.response.data) {
          setErrors({
            errors: error.response.data,
            isError: true,
          });
        }
      });
  };

  const uploadPostImage = async (image, id) => {
    let formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/image/${id}`,
      formData
    );
    return response.data;
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
                  const isFocused = formData[label] ? "focused" : "";
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
                          {errors[label] && (
                            <div className="error">{errors[label]}</div>
                          )}
                        </div>
                      ) : inputTypes[label] === "file" ? (
                        <div className="FormFile">
                          <label
                            htmlFor={label}
                            className="FileLabel"
                            style={{ visibility: "hidden" }}>
                            {label.charAt(0).toUpperCase() + label.slice(1)}
                          </label>
                          <input
                            type="file"
                            name={label}
                            accept="image/*"
                            className="FormInputFile"
                            onChange={handleChange}
                          />
                          {errors[label] && (
                            <div className="error">{errors[label]}</div>
                          )}
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
                          <div className="error-container">
                            {errors[label] && (
                              <div className="error">{errors[label]}</div>
                            )}
                          </div>
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
      <Route path="/all-users" element={<DisplayTable />} />
    </Routes>
  );
}
