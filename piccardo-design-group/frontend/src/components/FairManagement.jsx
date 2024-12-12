import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { addFair, deleteFair, updateFair } from "../services/apiServices";

const FairManagement = () => {
  const [newFair, setNewFair] = useState({ name: "", location: "", date: "" });
  const [editIndex, setEditIndex] = useState(null);
  const { data: fairs, loading, error } = useFetchData("/api/fairs");

  const handleFairInputChange = (e) => {
    const { name, value } = e.target;
    setNewFair({ ...newFair, [name]: value });
  };

  const handleAddFair = () => {
    addFair(newFair).then((data) => {
      setNewFair({ name: "", location: "", date: "" });
    });
  };

  const handleEditFair = (index) => {
    setEditIndex(index);
    setNewFair(fairs[index]);
  };

  const handleUpdateFair = () => {
    const id = fairs[editIndex]._id;
    updateFair(newFair, id).then((data) => {
      setEditIndex(null);
      setNewFair({ name: "", location: "", date: "" });
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching fairs: {error.message}</div>;

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h5 className="card-title">Add or Edit a Fair</h5>
        <form>
          <div className="form-group mb-3">
            <label htmlFor="name">Fair Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Fair Name"
              value={newFair.name}
              onChange={handleFairInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              placeholder="Location"
              value={newFair.location}
              onChange={handleFairInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="date">Date</label>
            <input
              type="text"
              className="form-control"
              id="date"
              name="date"
              placeholder="Date (dd-mm-yyyy)"
              value={newFair.date}
              onChange={handleFairInputChange}
            />
          </div>
          <div className="form-group">
            {editIndex !== null ? (
              <button
                type="button"
                className="btn btn-success w-100"
                onClick={handleUpdateFair}
              >
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleAddFair}
              >
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="row mt-5">
        {fairs.map((fair, index) => (
          <div className="col-md-4 mb-4" key={fair._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{fair.name}</h5>
                <p className="card-text">{fair.location}</p>
                <p className="card-text">{fair.date}</p>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditFair(index)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteFair(fair._id)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FairManagement;
