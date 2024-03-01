import axios from "axios";
import { API_URL } from "../../../constants.js"



const getMessages = async () => {

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + `cower/`, config);
  return response.data;
};


const createMessage = async (token, room, message) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL + "create/chat/",  room, message, config);
  return response.data;
};

const createRoom = async (token, room) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL + "room/create/", room, config);
  console.log(response)
  return response.data;
};



const chatService = { getMessages, createMessage, createRoom };
export default chatService;