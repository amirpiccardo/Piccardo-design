import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { addBrand, updateBrand, deleteBrand } from "../services/apiServices";

const BrandManagement = () => {
  const [newBrand, setNewBrand] = useState({
    name: "",
    logo: null,
    website: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const {
    data: brands,
    loading,
    error,
  } = useFetchData(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/brands`);

  const handleBrandInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "logo") {
      setNewBrand({ ...newBrand, logo: e.target.files[0] });
    } else {
      setNewBrand({ ...newBrand, [name]: value });
    }
  };

  const handleAddBrand = () => {
    addBrand(newBrand).then((data) => {
      setNewBrand({ name: "", logo: null, website: "" });
    });
  };

  const handleEditBrand = (index) => {
    setEditIndex(index);
    setNewBrand(brands[index]);
  };

  const handleUpdateBrand = () => {
    const id = brands[editIndex]._id;
    updateBrand(id, newBrand).then((data) => {
      setEditIndex(null);
      setNewBrand({ name: "", logo: null, website: "" });
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching brands: {error.message}</div>;

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h5 className="card-title">
          {editIndex !== null ? "Edit Brand" : "Add Brand"}
        </h5>
        <form>
          <div className="form-group mb-3">
            <label htmlFor="brandName">Brand Name</label>
            <input
              type="text"
              className="form-control"
              id="brandName"
              name="name"
              placeholder="Brand Name"
              value={newBrand.name}
              onChange={handleBrandInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="brandLogo">Brand Logo</label>
            <input
              type="file"
              className="form-control"
              id="brandLogo"
              name="logo"
              onChange={handleBrandInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="brandWebsite">Brand Website</label>
            <input
              type="text"
              className="form-control"
              id="brandWebsite"
              name="website"
              placeholder="Brand Website"
              value={newBrand.website}
              onChange={handleBrandInputChange}
            />
          </div>
          <div className="form-group">
            {editIndex !== null ? (
              <button
                type="button"
                className="btn btn-success w-100"
                onClick={handleUpdateBrand}
              >
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleAddBrand}
              >
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="row mt-5">
        {brands.map((brand, index) => (
          <div className="col-md-4 mb-4" key={brand._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{brand.name}</h5>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/${brand.logo}`}
                    alt={brand.name}
                    className="img-fluid"
                  />
                </a>
                <button
                  className="btn btn-warning btn-sm mt-3 me-2"
                  onClick={() => handleEditBrand(index)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  className="btn btn-danger btn-sm mt-3"
                  onClick={() => deleteBrand(brand._id)}
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

export default BrandManagement;
