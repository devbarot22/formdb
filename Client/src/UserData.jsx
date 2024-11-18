import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./UserData.css";
import AddUserSvg from "./public/person-plus-fill-svgrepo-com.svg";
import MultipleUserSvg from "./public/multiple-user-profile-images-svgrepo-com.svg";
import CrossSvg from "./public/cross-svgrepo-com.svg";
import TableView from "./public/table-column-solid-svgrepo-com.svg";
import ClosedEye from "./public/icons8-closed-eye-96.png";
import OpenedEye from "./public/icons8-eye-96.png";
import "./App.css";

function UserData() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [isUsersVisible, setIsUsersVisible] = useState(false);
  const [isTableViewVisible, setIsTableViewVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const genderOptions = ["Male", "Female", "Others"];

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/all-users`,
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
        if (data.length === 0) {
          navigate("/");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
      } else {
        console.error(`Failed to fetch user. Status: ${response.status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
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
    const { name, value, files } = e.target;
    if (name === "image") {
      setImage(files[0]);
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const updateUser = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );
      if (response.ok) {
        const updatedUser = await response.json();
        const updatedUsers = allUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        setAllUsers(updatedUsers);
        setSelectedUser(updatedUser);
        setIsEditing(false);

        if (image) {
          await uploadImage(userId);
        }
      } else {
        const errorData = await response.json();
        console.log(
          `Failed to update user. Status: ${response.status}`,
          errorData
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const uploadImage = async (userId) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/image/update/${userId}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (response.ok) {
        const updatedUser = await response.json();
        setSelectedUser(updatedUser);
        setImageName(updateUser.imageName || "");
      } else {
        console.error(`Failed to upload image. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (selectedUser && !selectedUser.imageName) {
      fetchUserById(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchData();
    if (id) {
      fetchUserById(id);
    }
  }, [id]);

  const toggleUsersVisibility = () => {
    setIsUsersVisible(!isUsersVisible);
    setTimeout(() => {
      setIsTableViewVisible(!isTableViewVisible);
    }, 200); // 0.2 seconds delay
  };

  const addUser = () => {
    navigate("/");
  };

  const viewFromAllUser = (user) => {
    setSelectedUser(user);
    navigate(`/user-data/${user.id}`, { replace: true });
  };

  
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="UserDataParentDiv">
      <div
        className="UsersBtn"
        style={{ position: "absolute", top: "0", right: "10px" }}
        onClick={toggleUsersVisibility}>
        {isUsersVisible ? (
          <div
            style={{
              width: "22vw",
              position: "relative",
              height: "5vh",
              backgroundColor: "white",
              top: "-10px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <img
              src={CrossSvg}
              alt="TabClosingIcon"
              style={{
                position: "absolute",
                height: "14px",
                right: "14px",
                // top: "0",
              }}
            />
            {isTableViewVisible && selectedUser && (
              <img
                src={TableView}
                alt="Table View Svg"
                style={{
                  paddingLeft: "10px",
                  position: "absolute",
                  height: "20px",
                  left: "0",
                  // top: "-5px",
                  zIndex: "999",
                  transition: "0.2s ease-in",
                  // border: "2px solid black",
                }}
                onClick={() =>
                  navigate("/all-users", {
                    state: { selectedUserId: selectedUser.id },
                  })
                }
              />
            )}
          </div>
        ) : (
          selectedUser &&
          selectedUser.imageName && (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/api/users/image/${
                selectedUser.imageName
              }`}
              alt="SeeAllUserIcon"
              style={{
                position: "absolute",
                width: "50px",
                height: "50px",
                right: "10px",
                top: "-5px",
                background: "gray",
                border: "2px solid grey",
                borderRadius: "50%",
              }}
            />
          )
        )}
      </div>
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
              <h1>Update Data</h1>
              <div className="Form">
                <div className="FormChildContainer">
                  <form
                    className="UpdateForm"
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateUser(selectedUser.id);
                    }}>
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
                          ) : inputTypes[label] === "file" ? (
                            <div className="FormFile">
                              <label
                                htmlFor={label}
                                className="Label"
                                style={{
                                  visibility: "hidden",
                                  marginTop: "10px",
                                }}>
                                {label.charAt(0).toUpperCase() + label.slice(1)}
                              </label>
                              <input
                                type="file"
                                name={label}
                                accept="image/png, image/jpeg"
                                className="FormInputFile"
                                onChange={handleInputChange}
                              />
                            </div>
                          ) : inputTypes[label] === "password" ? (
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
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <button className="SaveBtn" type="submit">
                      Save
                    </button>
                  </form>
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
                  onClick={() => deleteUser(selectedUser.id)}>
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
