import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

export const register = (data) =>
  API.post('/auth/register', data, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

export const login = (data) =>
  API.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

export const logout = () => API.post('/auth/logout');

export const uploadDoc = (formData) =>
  API.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => res.data);


export const getAllDocs = () =>
  API.get('/documents')
    .then((res) => res.data)
    .catch((err) => {
      console.error('❌ Failed to fetch documents:', err);
      throw err;
    });

export const getDocViewUrl = (docId) =>
  `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/documents/${docId}/view`;

export const analyzeDoc = (docId) =>
  API.post(`/documents/${docId}/analyze`);

export const addTag = (docId, tag) =>
  API.post(`/tags/${docId}/add`, { tag });

export const createShareLink = (docId) =>
  API.post(`/share/${docId}`);

export const getSharedDoc = (token) =>
  API.get(`/share/view/${token}`);

export default {
  register,
  login,
  logout,
  uploadDoc,
  getAllDocs,
  getDocViewUrl,
  analyzeDoc,
  addTag,
  createShareLink,
  getSharedDoc,
};