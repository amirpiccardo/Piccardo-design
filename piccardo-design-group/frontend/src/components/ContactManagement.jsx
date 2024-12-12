import React from "react";
import useFetchData from "../hooks/useFetchData";
import { deleteContact } from "../services/apiServices";

const ContactManagement = () => {
  const { data: contacts, loading, error } = useFetchData(`${process.env.REACT_APP_BACKEND_URL}/api/contact`);

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
