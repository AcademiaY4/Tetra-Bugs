import React, { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitization
import { useNavigate } from "react-router-dom";
import "./ViewUser.css";

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/admin/users/get-all-users')
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const downloadUserListAsPDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '', 'width=600,height=600');

    // Create a sanitized content string
    const sanitizedContent = `
      <html>
        <head>
          <title>User List</title>
        </head>
        <body>
          <h1>User List</h1>
          <table>
            <thead>
              <tr>
                <th>User first name</th>
                <th>User second name</th>
                <th>Email</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              ${users
                .map(
                  (user) => `
                  <tr>
                    <td>${DOMPurify.sanitize(user.firstName)}</td>
                    <td>${DOMPurify.sanitize(user.lastName)}</td>
                    <td>${DOMPurify.sanitize(user.emailAddress)}</td>
                    <td>${DOMPurify.sanitize(user.country)}</td>
                  </tr>
                `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Set the content of the new window to the sanitized HTML content
    printWindow.document.open();
    printWindow.document.write(DOMPurify.sanitize(sanitizedContent)); // Sanitize the entire content
    printWindow.document.close();

    // Print the window as a PDF
    printWindow.print();
  };

  return (
    <div className="table-container">
      <h1>User List</h1>
      <a className="download-link" href="#" onClick={downloadUserListAsPDF}>
        Download User List as PDF
      </a>
      <table>
        <thead>
          <tr>
            <th>User first name</th>
            <th>User second name</th>
            <th>Email</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.emailAddress}</td>
              <td>{user.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewUsers;