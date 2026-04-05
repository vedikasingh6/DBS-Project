const BASE_URL = "http://localhost:5000";

// STARTUPS
export const getStartups = async () => {
  const res = await fetch(`${BASE_URL}/startups`);
  return res.json();
};

export const addStartup = async (data) => {
  const res = await fetch(`${BASE_URL}/startups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// POLICIES
export const getPolicies = async () => {
  const res = await fetch(`${BASE_URL}/policies`);
  return res.json();
};

// STATUS
export const getStatus = async () => {
  const res = await fetch(`${BASE_URL}/status`);
  return res.json();
};

export const addStatus = async (data) => {
  const res = await fetch(`${BASE_URL}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};  