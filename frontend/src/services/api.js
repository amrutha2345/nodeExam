import axios from 'axios';
const API_URL = 'http://localhost:3000/users';
export const getUsers = async () => axios.get(API_URL);
export const addUser = async (name, email) => axios.post(API_URL, { name, email });
export const updateUser = async (id, name, email) => axios.post(`${API_URL}/update/${id}`, { name, email });
export const deleteUser = async (id) => axios.post(`${API_URL}/delete/${id}`);
