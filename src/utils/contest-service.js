import {authHeader} from './auth-header';
import axios from 'axios';

export const contestService = {
    getAll,
   deleteContest,
   addContest
};


function deleteContest(id){
    return axios.delete(`${process.env.REACT_APP_ROOT_URL}/contest/${id}`, authHeader());
};

function getAll() {
    const id = JSON.parse(localStorage.getItem('user')).id;
    return axios({
        method: 'get',
        url: process.env.REACT_APP_ROOT_URL + "/users/" + id + "/contests",
        headers: authHeader()
    }).then(contests => contests)
        .catch(err => err);
}

function addContest(name, image, url, startDate, endDate, payment, text, recommendations) {
    const id = JSON.parse(localStorage.getItem('user')).id;
    return axios({
        method: 'post',
        url: process.env.REACT_APP_ROOT_URL + "/users/" + id + "/contests",
        data: {
            contest: {
                name,
                image,
                url,
                startDate,
                endDate,
                payment,
                text,
                recommendations
            }
        },
        headers: authHeader()
    }).then(contests => contests)
        .catch(err => err);
}