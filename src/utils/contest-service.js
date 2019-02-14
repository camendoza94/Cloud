import {authHeader} from './auth-header';
import axios from 'axios';

export const contestService = {
    getAll
};

function getAll() {
    return axios.get(process.env.REACT_APP_ROOT_URL + "/contests", authHeader())
        .then(contests => contests)
        .catch(err => err);

}