import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./UserData.css";
import AddUserSvg from "./public/person-plus-fill-svgrepo-com.svg";
import MultipleUserSvg from "./public/multiple-user-profile-images-svgrepo-com.svg";
import CrossSvg from "./public/cross-svgrepo-com.svg";

function UserData() {
  const location = useLocation();
  const { formData } = location.state || {};
  const [allUsers, setAllUsers] = useState([]);
  const [isUsersVisible, setIsUsersVisible] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(formData);

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

  const deletingUser = async () => {
    try {
      console.log(`Attempting to delete user with id: ${id}`);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("User Deleted");
        navigate("/");
      } else {
        console.error(`Failed to delete user. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletingUsers = async (userId) => {
    try {
      if (confirm("Do you really want to delete this user?")) {
        console.log(`Attempting to delete user with id: ${userId}`);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          console.log("User Deleted");
          gettingData();
        } else {
          console.error(`Failed to delete user. Status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        console.log("Update Your details");
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
  }

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

      <h1>User Data</h1>
      {selectedUser ? (
        <div className="UserDataDiv">
          <div className="UserData">
            <p>First Name: {selectedUser.firstName}</p>
            <p>Last Name: {selectedUser.lastName}</p>
            <p>Age: {selectedUser.age}</p>
            <p>Phone: {selectedUser.phone}</p>
            <p>Gender: {selectedUser.gender}</p>
            <button className="DeleteBtn" onClick={deletingUser}>
              Delete
            </button>
            <button className="UpdateBtn" onClick={updateUser}>
              Update
            </button>
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      <div className={`usersParent ${isUsersVisible ? "visible" : "hidden"}`}>
        {allUsers.length > 0 ? (
          allUsers.map((user, index) => (
            <div className="Users" key={index} onClick={() => viewFromAllUser(user) }>
              <p>Id: {user.id}</p>
              <p>First Name: {user.firstName}</p>
              <p>Last Name: {user.lastName}</p>
              <button
                className="DeleteBtnn"
                onClick={(e) => {
                  e.stopPropagation();
                  deletingUsers(user.id);
                }}>
                Delete
              </button>
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
