const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api`;

export const fetchBrands = () =>
  fetch(`${API_BASE_URL}/brands`).then((res) => res.json());

export const addBrand = (brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${API_BASE_URL}/brands`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
};

export const updateBrand = (brandId, brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${API_BASE_URL}/brands/${brandId}`, {
    method: "PUT",
    body: formData,
  }).then((res) => res.json());
};

export const deleteBrand = (brandId) =>
  fetch(`${API_BASE_URL}/brands/${brandId}`, { method: "DELETE" });

export const fetchFairs = () =>
  fetch(`${API_BASE_URL}/fairs`).then((res) => res.json());

export const addFair = (fair) =>
  fetch(`${API_BASE_URL}/fairs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fair),
  }).then((res) => res.json());

export const deleteFair = (fairId) =>
  fetch(`${API_BASE_URL}/fairs/${fairId}`, { method: "DELETE" });

export const updateFair = (fair, id) =>
  fetch(`${API_BASE_URL}/fairs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fair),
  }).then((res) => res.json());

export const fetchTeamMembers = () =>
  fetch(`${API_BASE_URL}/team`).then((res) => res.json());

export const addTeamMember = (teamMember) => {
  const formData = new FormData();
  formData.append("name", teamMember.name);
  formData.append("role", teamMember.role);
  formData.append("photo", teamMember.photo);

  return fetch(`${API_BASE_URL}/team`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
};

export const updateTeamMember = (teamMemberId, teamMember) => {
  const formData = new FormData();
  formData.append("name", teamMember.name);
  formData.append("role", teamMember.role);
  formData.append("photo", teamMember.photo);

  return fetch(`${API_BASE_URL}/team/${teamMemberId}`, {
    method: "PUT",
    body: formData,
  }).then((res) => res.json());
};

export const deleteTeamMember = (teamMemberId) =>
  fetch(`${API_BASE_URL}/team/${teamMemberId}`, { method: "DELETE" });

export const fetchMaterialBrands = () =>
  fetch(`${API_BASE_URL}/materialpage/brands`).then((res) => res.json());

export const addMaterialBrand = (brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${API_BASE_URL}/materialpage/brands`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
};

export const updateMaterialBrand = (brandId, brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${API_BASE_URL}/materialpage/brands/${brandId}`, {
    method: "PUT",
    body: formData,
  }).then((res) => res.json());
};

export const deleteMaterialBrand = (brandId) =>
  fetch(`${API_BASE_URL}/materialpage/brands/${brandId}`, { method: "DELETE" });

export const fetchContractBrands = () =>
  fetch(`${API_BASE_URL}/contract/brands`).then((res) => res.json());

export const addContractBrand = (brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${API_BASE_URL}/contract/brands`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
};

export const updateContractBrand = (brandId, brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${API_BASE_URL}/contract/brands/${brandId}`, {
    method: "PUT",
    body: formData,
  }).then((res) => res.json());
};

export const deleteContractBrand = (brandId) =>
  fetch(`${API_BASE_URL}/contract/brands/${brandId}`, { method: "DELETE" });

export const fetchContacts = () =>
  fetch(`${API_BASE_URL}/contact`).then((res) => res.json());

export const deleteContact = (contactId) =>
  fetch(`${API_BASE_URL}/contact/${contactId}`, { method: "DELETE" });

export const fetchSubscribers = () =>
  fetch(`${API_BASE_URL}/subscribers`).then((res) => res.json());

export const deleteSubscriber = (email) =>
  fetch(`${API_BASE_URL}/unsubscribe/${email}`, { method: "DELETE" });
