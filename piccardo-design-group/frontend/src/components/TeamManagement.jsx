import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../services/apiServices";

const TeamManagement = () => {
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    role: "",
    photo: null,
  });
  const [editIndex, setEditIndex] = useState(null);
  const { data: teamMembers, loading, error } = useFetchData(`${import.meta.env.VITE_BASE_URL}/api/team`);

  const handleTeamMemberInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "photo") {
      setNewTeamMember({ ...newTeamMember, photo: e.target.files[0] });
    } else {
      setNewTeamMember({ ...newTeamMember, [name]: value });
    }
  };

  const handleAddTeamMember = () => {
    addTeamMember(newTeamMember).then(() => {
      setNewTeamMember({ name: "", role: "", photo: null });
    });
  };

  const handleEditTeamMember = (index) => {
    setEditIndex(index);
    setNewTeamMember(teamMembers[index]);
  };

  const handleUpdateTeamMember = () => {
    const id = teamMembers[editIndex]._id;
    updateTeamMember(id, newTeamMember).then(() => {
      setEditIndex(null);
      setNewTeamMember({ name: "", role: "", photo: null });
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching team members: {error.message}</div>;

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h5 className="card-title">
          {editIndex !== null ? "Edit Team Member" : "Add Team Member"}
        </h5>
        <form>
          <div className="form-group mb-3">
            <label htmlFor="teamMemberName">Team Member Name</label>
            <input
              type="text"
              className="form-control"
              id="teamMemberName"
              name="name"
              placeholder="Team Member Name"
              value={newTeamMember.name}
              onChange={handleTeamMemberInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="teamMemberRole">Team Member Role</label>
            <input
              type="text"
              className="form-control"
              id="teamMemberRole"
              name="role"
              placeholder="Team Member Role"
              value={newTeamMember.role}
              onChange={handleTeamMemberInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="teamMemberPhoto">Team Member Photo</label>
            <input
              type="file"
              className="form-control"
              id="teamMemberPhoto"
              name="photo"
              onChange={handleTeamMemberInputChange}
            />
          </div>
          <div className="form-group">
            {editIndex !== null ? (
              <button
                type="button"
                className="btn btn-success w-100"
                onClick={handleUpdateTeamMember}
              >
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleAddTeamMember}
              >
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="row mt-5">
        {teamMembers.map((teamMember, index) => (
          <div className="col-md-4 mb-4" key={teamMember._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{teamMember.name}</h5>
                <p className="card-text">{teamMember.role}</p>
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/${teamMember.photo}`}
                  alt={teamMember.name}
                  className="img-fluid"
                />
                <button
                  className="btn btn-warning btn-sm mt-3 me-2"
                  onClick={() => handleEditTeamMember(index)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  className="btn btn-danger btn-sm mt-3"
                  onClick={() => deleteTeamMember(teamMember._id)}
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

export default TeamManagement;
