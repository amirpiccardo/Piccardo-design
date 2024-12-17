import React, { useState, useEffect } from "react";
import { deleteContact } from "../services/apiServices";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/contact`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching contacts: {error.message}</div>;

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h5 className="card-title">Contact Requests</h5>
        <ul className="list-group">
          {contacts.map((contact) => (
            <li key={contact._id} className="list-group-item">
              <p>
                <strong>Name:</strong> {contact.name}
              </p>
              <p>
                <strong>Email:</strong> {contact.email}
              </p>
              <p>
                <strong>Message:</strong> {contact.message}
              </p>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteContact(contact._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactManagement;
