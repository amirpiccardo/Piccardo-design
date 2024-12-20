export const fetchBrands = () =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/brands`).then((res) =>
    res.json()
  );

export const addBrand = (brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/brands`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
};

export const updateBrand = (brandId, brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/brands/${brandId}`, {
    method: "PUT",
    body: formData,
  }).then((res) => res.json());
};

export const deleteBrand = (brandId) =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/brands/${brandId}`, {
    method: "DELETE",
  });

export const fetchTeamMembers = () =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/team`).then((res) => res.json());

export const addTeamMember = (teamMember) => {
  const formData = new FormData();
  formData.append("name", teamMember.name);
  formData.append("role", teamMember.role);
  formData.append("photo", teamMember.photo);

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/team`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
};

export const updateTeamMember = (teamMemberId, teamMember) => {
  const formData = new FormData();
  formData.append("name", teamMember.name);
  formData.append("role", teamMember.role);
  formData.append("photo", teamMember.photo);

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/team/${teamMemberId}`, {
    method: "PUT",
    body: formData,
  }).then((res) => res.json());
};

export const deleteTeamMember = (teamMemberId) =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/team/${teamMemberId}`, {
    method: "DELETE",
  });

export const fetchMaterialBrands = () =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/materialpage/brands`).then(
    (res) => res.json()
  );

export const addMaterialBrand = (brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/materialpage/brands`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
};

export const updateMaterialBrand = (brandId, brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(
    `${import.meta.env.VITE_BASE_URL}/api/materialpage/brands/${brandId}`,
    {
      method: "PUT",
      body: formData,
    }
  ).then((res) => res.json());
};

export const deleteMaterialBrand = (brandId) =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/materialpage/brands/${brandId}`, {
    method: "DELETE",
  });

export const fetchContractBrands = () =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/contract/brands`).then((res) =>
    res.json()
  );

export const addContractBrand = (brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/contract/brands`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
};

export const updateContractBrand = (brandId, brand) => {
  const formData = new FormData();
  formData.append("name", brand.name);
  formData.append("logo", brand.logo);
  formData.append("website", brand.website);

  return fetch(
    `${import.meta.env.VITE_BASE_URL}/api/contract/brands/${brandId}`,
    {
      method: "PUT",
      body: formData,
    }
  ).then((res) => res.json());
};

export const deleteContractBrand = (brandId) =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/contract/brands/${brandId}`, {
    method: "DELETE",
  });

export const fetchContacts = () =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/contact`).then((res) =>
    res.json()
  );

export const deleteContact = (contactId) =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/contact/${contactId}`, {
    method: "DELETE",
  });

export const fetchSubscribers = () =>
  fetch(`${import.meta.env.VITE_BASE_URL}/api/subscribers`).then((res) =>
    res.json()
  );

export const deleteSubscriber = (email) =>
  fetch(`${import.meta.env.VITE_BASE_URL}/unsubscribe/${email}`, {
    method: "DELETE",
  });
