import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DisplayTable.css";
import CancelSvg from "./public/cross-svgrepo-com.svg";

export default function DisplayTable() {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 7; // Number of users per page
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedUserId } = location.state || {};

  const labels = [
    "firstName",
    "lastName",
    "age",
    "phone",
    "gender",
    "imageName",
  ];

  const getBackFromTable = () => {
    navigate(`/user-data/${selectedUserId}`);
  };

  const fetchAllUsers = async (pageNumber = 1) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/users/all-users-Paging?pageNumber=${
          pageNumber - 1
        }&pageSize=${usersPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data.content || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error(`Failed to fetch users. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers(currentPage);
  }, [currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredUsers = allUsers.filter((user) =>
    labels.some((label) =>
      user[label]?.toString().toLowerCase().startsWith(searchTerm.toLowerCase())
    )
  );

  const viewUserDetails = (user) => {
    navigate(`/user-data/${user.id}`, {
      state: { labels, formData: user },
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="AllUsersParent">
      <h1>All Users</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="SearchBox"
      />
      <div className="UsersTableContainer">
        {filteredUsers.length > 0 ? (
          <table className="UsersTable">
            <thead>
              <tr className="TableLabelRow">
                {labels.map((label) => (
                  <th key={label}>
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => viewUserDetails(user)}
                  style={{ cursor: "pointer" }}
                  className="TableBodyRow">
                  {labels.map((label) => (
                    <td key={label}>
                      {label === "imageName" ? (
                        <div className="ImageContainer">
                          <img
                            src={`${
                              import.meta.env.VITE_BACKEND_URL
                            }/api/users/image/${user.imageName}`}
                            alt={user.imageName}
                            className="ImagesInTable"
                          />
                        </div>
                      ) : (
                        user[label]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
        <img
          src={CancelSvg}
          alt="CancelSvg"
          onClick={getBackFromTable}
          style={{
            height: "10px",
            position: "absolute",
            right: "20px",
            top: "20px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        />
      </div>
      
      <div className="Pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
