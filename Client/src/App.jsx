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
import ClosedEye from "./public/icons8-closed-eye-96.png";
import OpenedEye from "./public/icons8-eye-96.png";

export default function App() {
  const labels = [
    "firstName",
    "lastName",
    "age",
    "phone",
    "password",
    "gender",
    "image",
  ];
  const inputTypes = {
    firstName: "text",
    lastName: "text",
    age: "number",
    phone: "number",
    password: "password",
    gender: "radio",
    image: "file",
  };

  const initialFormData = {
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    password: "",
    gender: "",
    image: null,
  };

  const genderOptions = ["Male", "Female", "Others"];
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState(formData.image);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    errors:{},
    isError: false,
  });

  /**
   * Handles changes to form inputs and updates the form data state.
   *
   * If the input is a file input (name === "image"), it updates the "image" field
   * with the first selected file. For all other inputs, it updates the corresponding
   * field in the form data based on the input's name and value.
   *
   * @param {Object} event - The event object from the input field.
   * @param {string} event.target.name - The name of the input field.
   * @param {string} event.target.value - The value of the input field (for text inputs).
   * @param {FileList} event.target.files - The list of files (for file inputs).
   */

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

  /*--------------------------------------------- handleKeyPress Function --------------------------------------*/

  /*this function is used to prevent user to enter characters inside phone field and age field which should be populated with numbers only*/

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

  /*--------------------------------------------- Handle Submit Function --------------------------------------*/
  /* this function send is called inside form's onsubmit method where this function will take its child function to be called with it which is postMethod */

  const handleSubmit = async (e) => {
    e.preventDefault();

    postMethod(formData);
  };

  /*--------------------------------------------- PostMethod Function --------------------------------------*/

  /* this function sends formdata to the backend along with uploadPostImage function(which basically sends the image to the backend) and will check if we have image with us then only the uploadImage function will be called and it will upload image with it*/

  /*Once we are able to send the data(without facing any error) to the server it will navigate us to the UserData page where we will display it along with other functionalities and elements for more info checkout UserData component */

  const postMethod = (data) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/users/createUser`, data)
      .then((response) => {
        const data = response.data;

        /*checking for formdata image value if its not null it will proceed to submit it along with all data */

        if (formData.image) {
          uploadPostImage(formData.image, data.id)

            /*this catch block will catch any error which will occur during the submission of our image*/

            .catch((error) => {
              console.log("Error in Uploading Image !! ");
              console.error(error);
            });
        }

        /*If there is no error it will console the response data id and it will navigate to the UserData component and it will empty the fields*/
        if (!error.isError) {
          setError({}); 
          navigate(`user-data/${response.data.id}`, {
            state: { labels, formData: data },
          });
          setUser({});
          setFormData(initialFormData);
        }
      })

      /*this will catch any error we will encounter during the submission of our data */

      .catch((error) => {
        console.log("Error! Something went wrong");
        console.log(error);

        if (error.response && error.response.data) {
          setError({
            errors: error.response.data,
            isError: true,
          });
        }
      });
  };

  /*----------------------------------------------- Upload image function -----------------------------------------*/
  /*this function basically post and its been called inside the postMethod and this method will send the post request to the backend to store the image*/

  const uploadPostImage = async (image, id) => {
    /*storing creating new object called formData and appending image with key 'image', And returning the response data we will get.*/

    let formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/image/${id}`,
      formData
    );
    return response.data;
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="FormParent">
            <h1>Sign Up</h1>
            <form className="Form" onSubmit={handleSubmit}>
              <div className="FormChildContainer">
                {labels.map((label) => {
                  const isFocused = formData[label] ? "focused" : "";
                  return (
                    <div className="FormChild" key={label}>
                      {/*-------------------------------------------------- Radio Field ---------------------------------------------*/}
                      {/* this field has radio field */}

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
                          {error[label] && (
                            <div className="error">{error[label]}</div>
                          )}
                        </div>
                      ) : /*--------------------------------------------------- file Field ------------------------------------------------*/

                      /*this is the file field */

                      inputTypes[label] === "file" ? (
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
                            accept="image/png, image/jpeg"
                            className="FormInputFile"
                            onChange={handleChange}
                          />
                          {error[label] && (
                            <div className="error">{error[label]}</div>
                          )}
                        </div>
                      ) : /*-------------------------------------------------- Password Field ----------------------------------------------*/
                      //this is the password field

                      inputTypes[label] === "password" ? (
                        <div
                          className={`FormParentt ${isFocused}`}
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}>
                          <label htmlFor={label} className="Label">
                            {label.charAt(0).toUpperCase() + label.slice(1)}
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
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
                          <img
                            src={showPassword ? ClosedEye : OpenedEye}
                            alt=""
                            style={{
                              position: "absolute",
                              height: "15px",
                              right: "10px",
                              cursor: "pointer",
                            }}
                            onClick={togglePasswordVisibility}
                          />
                        </div>
                      ) : (
                        /*--------------------------------------------------- All Fields ---------------------------------------------*/
                        //this are all the fields which have text,number.

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
                            {error[label] && (
                              <div className="error">{error[label]}</div>
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
