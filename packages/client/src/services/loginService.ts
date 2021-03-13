import axios from 'axios';
import { User } from '../types';

const URL = 'http://localhost:4000';

const login = async (userDetails: User): Promise<User> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${URL}/login`, userDetails);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export { login };