// api.js — Frontend helper to connect HTML pages to backend
// Place this file in your frontend folder (same as index.html)
// Include in HTML with: <script src="api.js"></script>

const API_BASE = 'https://skill-linkr-project.vercel.app//api';
// ⬆️ Replace with your actual Render URL after deployment

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

// Save/get token from localStorage
const getToken = () => localStorage.getItem('sl_token');
const setToken = (token) => localStorage.setItem('sl_token', token);
const setUser  = (user)  => localStorage.setItem('sl_user', JSON.stringify(user));
const getUser  = () => JSON.parse(localStorage.getItem('sl_user') || 'null');
const logout   = () => { localStorage.removeItem('sl_token'); localStorage.removeItem('sl_user'); window.location.href = 'login.html'; };

// Base fetch with auth
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ─────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────

// Register student
const registerStudent = async (formData) => {
  const data = await apiFetch('/auth/register/student', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  setToken(data.token);
  setUser(data.user);
  return data;
};

// Register client
const registerClient = async (formData) => {
  const data = await apiFetch('/auth/register/client', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  setToken(data.token);
  setUser(data.user);
  return data;
};

// Login
const login = async (email, password, role) => {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
  setToken(data.token);
  setUser(data.user);
  return data;
};

// Get current user
const getMe = async () => apiFetch('/auth/me');

// ─────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────

// Browse projects (public)
const getProjects = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/projects?${qs}`);
};

// Get single project
const getProject = async (id) => apiFetch(`/projects/${id}`);

// Post new project (client only)
const postProject = async (formData) => apiFetch('/projects', {
  method: 'POST',
  body: JSON.stringify(formData),
});

// Get my projects (client)
const getMyProjects = async () => apiFetch('/projects/client/my-projects');

// Update project
const updateProject = async (id, data) => apiFetch(`/projects/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

// Hire a student
const hireStudent = async (projectId, studentId) => apiFetch(`/projects/${projectId}/hire/${studentId}`, { method: 'PUT' });

// Release payment
const releasePayment = async (projectId) => apiFetch(`/projects/${projectId}/release-payment`, { method: 'PUT' });

// ─────────────────────────────────────────────
//  APPLICATIONS
// ─────────────────────────────────────────────

// Apply to project (student)
const applyToProject = async (projectId, formData) => apiFetch(`/applications/${projectId}`, {
  method: 'POST',
  body: JSON.stringify(formData),
});

// Get my applications (student)
const getMyApplications = async () => apiFetch('/applications/my');

// Get applicants for a project (client)
const getProjectApplicants = async (projectId) => apiFetch(`/applications/project/${projectId}`);

// Update application status (client)
const updateApplicationStatus = async (appId, status) => apiFetch(`/applications/${appId}/status`, {
  method: 'PUT',
  body: JSON.stringify({ status }),
});

// Submit review
const submitReview = async (appId, rating, review) => apiFetch(`/applications/${appId}/review`, {
  method: 'POST',
  body: JSON.stringify({ rating, review }),
});

// ─────────────────────────────────────────────
//  PROFILE
// ─────────────────────────────────────────────

// Update student profile
const updateStudentProfile = async (data) => apiFetch('/students/profile', {
  method: 'PUT',
  body: JSON.stringify(data),
});

// Update client profile
const updateClientProfile = async (data) => apiFetch('/clients/profile', {
  method: 'PUT',
  body: JSON.stringify(data),
});

// ─────────────────────────────────────────────
//  REDIRECT HELPERS
// ─────────────────────────────────────────────

// Redirect if not logged in
const requireAuth = () => {
  if (!getToken()) { window.location.href = 'login.html'; return false; }
  return true;
};

// Redirect to correct dashboard
const redirectToDashboard = () => {
  const user = getUser();
  if (!user) { window.location.href = 'login.html'; return; }
  window.location.href = user.role === 'student' ? 'dashboard-student.html' : 'dashboard-client.html';
};
