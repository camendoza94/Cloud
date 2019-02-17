import {authHeader} from './auth-header';
import axios from 'axios';

export const contestService = {
    getAll,
    getAllByUser
};

function getAll() {
    return axios.get(process.env.REACT_APP_ROOT_URL + "/contests", authHeader())
        .then(contests => contests)
        .catch(err => err);

}

function getAllByUser(id){
    return axios.get(`${process.env.REACT_APP_ROOT_URL}/${id}/contests`, authHeader())
    .then(contests => contests)
    .catch(err => err);
}