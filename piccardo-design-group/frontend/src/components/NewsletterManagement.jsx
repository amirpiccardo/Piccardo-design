import React, { useState, useEffect } from "react";
import { deleteSubscriber } from "../services/apiServices";

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/subscribers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setSubscribers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subscribers:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

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
