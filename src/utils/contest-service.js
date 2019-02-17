import {authHeader} from './auth-header';
import axios from 'axios';

export const contestService = {
    getAll,
    getAllByUser,
    deleteContest
};

function getAllByUser(id){
    return axios.get(`${process.env.REACT_APP_ROOT_URL}/users/${id}/contests`, authHeader());
}

function deleteContest(id){
    return axios.delete(`${process.env.REACT_APP_ROOT_URL}/contest/${id}`, authHeader());
}