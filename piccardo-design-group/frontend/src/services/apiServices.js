const BASE = import.meta.env.VITE_BASE_URL;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

// ─── Account / Password ───────────────────────────────────────────────────────

export const fetchAnalyticsStats = () =>
  fetch(`${BASE}/api/analytics/stats`, { headers: authHeaders() }).then((r) => r.json());

export const changePassword = (currentPassword, newPassword) =>
  fetch(`${BASE}/api/auth/change-password`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.message || "Errore");
    return data;
  });

// ─── Brands (Homepage) ───────────────────────────────────────────────────────

export const fetchBrands = () =>
  fetch(`${BASE}/api/brands`).then((r) => r.json());

export const addBrand = (brand) => {
  const fd = new FormData();
  fd.append("name", brand.name);
  fd.append("logo", brand.logo);
  fd.append("website", brand.website);
  return fetch(`${BASE}/api/brands`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  }).then((r) => r.json());
};

export const updateBrand = (brandId, brand) => {
  const fd = new FormData();
  fd.append("name", brand.name);
  if (brand.logo instanceof File) fd.append("logo", brand.logo);
  fd.append("website", brand.website);
  return fetch(`${BASE}/api/brands/${brandId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: fd,
  }).then((r) => r.json());
};

export const deleteBrand = (brandId) =>
  fetch(`${BASE}/api/brands/${brandId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

// ─── Team ─────────────────────────────────────────────────────────────────────

export const fetchTeamMembers = () =>
  fetch(`${BASE}/api/team`).then((r) => r.json());

export const addTeamMember = (member) => {
  const fd = new FormData();
  fd.append("name", member.name);
  fd.append("role", member.role);
  fd.append("photo", member.photo);
  return fetch(`${BASE}/api/team`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  }).then((r) => r.json());
};

export const updateTeamMember = (id, member) => {
  const fd = new FormData();
  fd.append("name", member.name);
  fd.append("role", member.role);
  if (member.photo instanceof File) fd.append("photo", member.photo);
  return fetch(`${BASE}/api/team/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: fd,
  }).then((r) => r.json());
};

export const deleteTeamMember = (id) =>
  fetch(`${BASE}/api/team/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

// ─── Material Brands ──────────────────────────────────────────────────────────

export const fetchMaterialBrands = () =>
  fetch(`${BASE}/api/materialpage/brands`).then((r) => r.json());

export const addMaterialBrand = (brand) => {
  const fd = new FormData();
  fd.append("name", brand.name);
  fd.append("logo", brand.logo);
  fd.append("website", brand.website);
  return fetch(`${BASE}/api/materialpage/brands`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  }).then((r) => r.json());
};

export const updateMaterialBrand = (brandId, brand) => {
  const fd = new FormData();
  fd.append("name", brand.name);
  if (brand.logo instanceof File) fd.append("logo", brand.logo);
  fd.append("website", brand.website);
  return fetch(`${BASE}/api/materialpage/brands/${brandId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: fd,
  }).then((r) => r.json());
};

export const deleteMaterialBrand = (brandId) =>
  fetch(`${BASE}/api/materialpage/brands/${brandId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

// ─── Contract Brands ──────────────────────────────────────────────────────────

export const fetchContractBrands = () =>
  fetch(`${BASE}/api/contract/brands`).then((r) => r.json());

export const addContractBrand = (brand) => {
  const fd = new FormData();
  fd.append("name", brand.name);
  fd.append("logo", brand.logo);
  fd.append("website", brand.website);
  return fetch(`${BASE}/api/contract/brands`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  }).then((r) => r.json());
};

export const updateContractBrand = (brandId, brand) => {
  const fd = new FormData();
  fd.append("name", brand.name);
  if (brand.logo instanceof File) fd.append("logo", brand.logo);
  fd.append("website", brand.website);
  return fetch(`${BASE}/api/contract/brands/${brandId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: fd,
  }).then((r) => r.json());
};

export const deleteContractBrand = (brandId) =>
  fetch(`${BASE}/api/contract/brands/${brandId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

// ─── Contacts ─────────────────────────────────────────────────────────────────

export const fetchContacts = () =>
  fetch(`${BASE}/api/contact`, { headers: authHeaders() }).then((r) => r.json());

export const deleteContact = (contactId) =>
  fetch(`${BASE}/api/contact/${contactId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const fetchSubscribers = () =>
  fetch(`${BASE}/api/subscribers`, { headers: authHeaders() }).then((r) => r.json());

export const deleteSubscriber = (email) =>
  fetch(`${BASE}/api/unsubscribe/${email}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
