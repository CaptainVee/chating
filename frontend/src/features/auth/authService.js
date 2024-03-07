import axios from "axios";
import { API_URL } from "../../../constants.js"

const REGISTER_URL =  API_URL + 'auth/registeration/'
const LOGIN_URL = API_URL + 'dj-rest-auth/login/'
const ACTIVATE_URL = API_URL + 'users/activation/'

// register user
const register = async (userData) => {
    const config = {
        header: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(REGISTER_URL, userData, config)
    return response.data
}

// login user
const login = async (userData) => {
    const config = {
        header: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(LOGIN_URL, userData, config)
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data
}

// Logout user
const logout = () => localStorage.removeItem('user')

// activate user
const activate = async (userData) => {
    const config = {
        header: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(ACTIVATE_URL, userData, config)
    return response.data
}

const getUsers = async (token) => {

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
    const response = await axios.get(API_URL + "users/", config);
    return response.data;
  };

const authService = {register, login, logout, activate, getUsers}
export default authService