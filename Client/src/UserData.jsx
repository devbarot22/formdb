import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./UserData.css";
import AddUserSvg from "./public/person-plus-fill-svgrepo-com.svg";
import MultipleUserSvg from "./public/multiple-user-profile-images-svgrepo-com.svg";
import CrossSvg from "./public/cross-svgrepo-com.svg";
import "./App.css";

function UserData() {
  const location = useLocation();
  const { formData } = location.state || {};
  const [allUsers, setAllUsers] = useState([]);
  const [isUsersVisible, setIsUsersVisible] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState();

  const labels = ["firstName", "lastName", "age", "phone", "gender"];
  const inputTypes = {
    firstName: "text",
    lastName: "text",
    age: "number",
    phone: "number",
    gender: "radio",
  };

  const genderOptions = ["Male", "Female"];

  const gettingData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
        if (data.length == 0) {
          navigate("/");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deletingUser = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedUsers = allUsers.filter((user) => user.id !== userId);
        setAllUsers(updatedUsers);

        if (updatedUsers.length > 0) {
          setSelectedUser(updatedUsers[0]);
        } else {
          setSelectedUser(null);
        }
      } else {
        console.error(`Failed to delete user. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = () => {
    setIsEditing(true);
    setEditFormData(selectedUser);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const updateUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );
      if (response.ok) {
        const updateUser = await response.json();
        const updatedUsers = allUsers.map((user) =>
          user.id === updateUser.id ? updateUser : user
        );
        setAllUsers(updatedUsers);
        setSelectedUser(updateUser);
        setIsEditing(false);
      } else {
        console.log(`Failed to update user. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    gettingData();
  }, []);

  const toggleUsersVisibility = () => {
    setIsUsersVisible(!isUsersVisible);
  };

  const addUser = () => {
    navigate("/");
  };

  const viewFromAllUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="UserDataParentDiv">
      <button
        className="UsersBtn"
        style={{ position: "absolute", top: "10px", right: "20px" }}
        onClick={toggleUsersVisibility}>
        {isUsersVisible ? (
          <img
            src={CrossSvg}
            alt="TabClosingIcon"
            style={{
              position: "absolute",
              height: "10px",
              right: "14px",
              top: "0",
            }}
          />
        ) : (
          <img
            src={MultipleUserSvg}
            alt="SeeAllUserIcon"
            style={{
              position: "absolute",
              height: "20px",
              right: "10px",
              top: "-5px",
              background: "gray",
              borderRadius: "10vw",
            }}
          />
        )}
      </button>
      <img
        src={AddUserSvg}
        alt="AddUserSvg"
        style={{
          position: "absolute",
          left: "15px",
          top: "5px",
          height: "20px",
          background: "transparent",
          cursor: "pointer",
        }}
        onClick={addUser}
      />

      {selectedUser ? (
        <>
          {isEditing ? (
            <div className="FormParent">
              <h1>User Data</h1>
              <div className="Form">
                <div className="FormChildContainer">
                  <div className="UpdateForm" onSubmit={updateUser}>
                    {labels.map((label) => {
                      const isFocused = editFormData[label] ? "focused" : "";
                      return (
                        <div className="FormChild" key={label}>
                          {inputTypes[label] === "radio" ? (
                            <div className="FormRadio">
                              <label>
                                {label.charAt(0).toUpperCase() + label.slice(1)}
                                :
                              </label>
                              <div className="OutRadioInput">
                                {genderOptions.map((value, index) => (
                                  <label key={index}>
                                    <input
                                      type="radio"
                                      name={label}
                                      value={value}
                                      checked={editFormData[label] === value}
                                      onChange={handleInputChange}
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
                                value={editFormData[label]}
                                onChange={handleInputChange}
                                onFocus={(e) =>
                                  e.target.parentNode.classList.add("focused")
                                }
                                onBlur={(e) => {
                                  if (!e.target.value) {
                                    e.target.parentNode.classList.remove(
                                      "focused"
                                    );
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
                              {/* {errors[label] && (
                            <div className="error">{errors[label]}</div>
                          )} */}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <button className="SaveBtn" onClick={updateUser}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="UserDataDiv">
              <div className="UserData">
                <p>First Name: {selectedUser.firstName}</p>
                <p>Last Name: {selectedUser.lastName}</p>
                <p>Age: {selectedUser.age}</p>
                <p>Phone: {selectedUser.phone}</p>
                <p>Gender: {selectedUser.gender}</p>
                <button
                  className="DeleteBtn"
                  onClick={() => deletingUser(selectedUser.id)}>
                  Delete
                </button>
                <button className="UpdateBtn" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No user data available.</p>
      )}

      <div className={`usersParent ${isUsersVisible ? "visible" : "hidden"}`}>
        {allUsers.length > 0 ? (
          allUsers.map((user, index) => (
            <div
              className="Users"
              key={index}
              onClick={() => viewFromAllUser(user)}>
              <p>Id: {user.id}</p>
              <p>First Name: {user.firstName}</p>
              <p>Last Name: {user.lastName}</p>
            </div>
          ))
        ) : (
          <p>No users available.</p>
        )}
      </div>
    </div>
  );
}

export default UserData;
