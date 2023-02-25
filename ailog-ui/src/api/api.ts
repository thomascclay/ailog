import axios from "axios";
import {API_URL} from "../config";
import {Feedback} from "ailog-common";


export const Api = (config: {username: string, token: string}) => {
  const baseApi = axios.create({
    baseURL: API_URL,
    headers: {
      'authorization': `Bearer ${config.token}`,
      'username': config.username
    }
  })
  return ({
    Feedback: {
      put: (feedback: Feedback) => baseApi.put('/feedback', feedback)
    },
    Login: {
      post: (username: string, password: string) => baseApi.post('/login', {username, password})
    }
  })
}