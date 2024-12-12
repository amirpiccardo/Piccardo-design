import React from "react";
import useFetchData from "../hooks/useFetchData";
import { deleteSubscriber } from "../services/apiServices";

const NewsletterManagement = () => {
  const {
    data: subscribers,
    loading,
    error,
  } = useFetchData("/api/subscribers");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching subscribers: {error.message}</div>;

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h5 className="card-title">Newsletter Subscribers</h5>
        <ul className="list-group">
          {subscribers.map((subscriber) => (
            <li key={subscriber.email} className="list-group-item">
              <p>
                <strong>Email:</strong> {subscriber.email}
              </p>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteSubscriber(subscriber.email)}
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

export default NewsletterManagement;
