import axios from 'axios';

export const handleLoginApi = (email, password) => {
    return axios.post('/api/user/login', { email, password });
};
