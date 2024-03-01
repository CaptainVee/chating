import axios from "axios";
import { API_URL } from "../../../constants.js"



// get all users transactions
const getTransactions = async (token) => {

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + "transactions/", config);
  return response.data;
};

// create transactions
const createTransaction = async (token, transactionData) => {

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL + `transactions/`, transactionData, config);
  return response.data;
};


// partial edit transactions
const patchTransactions = async (token, transaction_id, newData) => {

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }
  const response = await axios.patch(API_URL + `transactions/${transaction_id}/transaction/`, newData, config);
  return response.data;
};

// get data for dashboard
const getDashboard = async (token) => {

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + "transactions/dashboard/", config);
  return response.data;
};


const transactionService = { getTransactions, getDashboard, patchTransactions, createTransaction };
export default transactionService;
