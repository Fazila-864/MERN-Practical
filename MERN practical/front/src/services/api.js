import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const IMAGE_BASE = API_BASE_URL.replace(/\/api$/, '');

// Axios instance
const api = axios.create({ baseURL: API_BASE_URL });

// Multipart form-data banata hai (image upload ke liye zaroori)
const toFormData = (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'image') {
      if (value instanceof File) form.append('image', value);
      return;
    }
    form.append(key, typeof value === 'boolean' ? String(value) : value);
  });
  return form;
};

// ---------- CATEGORY ----------
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get('/categories/' + id);
export const createCategory = (data) => api.post('/categories', toFormData(data));
export const updateCategory = (id, data) => api.put('/categories/' + id, toFormData(data));
export const deleteCategory = (id) => api.delete('/categories/' + id);

// ---------- PRODUCT ----------
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get('/products/' + id);
export const createProduct = (data) => api.post('/products', toFormData(data));
export const updateProduct = (id, data) => api.put('/products/' + id, toFormData(data));
export const deleteProduct = (id) => api.delete('/products/' + id);
