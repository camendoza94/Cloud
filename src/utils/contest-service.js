import {authHeader} from './auth-header';
import axios from 'axios';

export const contestService = {
    getAll,
    deleteContest,
    addContest,
    getByURL,
    updateContest,
    getMostPopular
};

function getByURL(url) {
    return axios.get(`${process.env.REACT_APP_ROOT_URL}/contests/${url}`, authHeader());
}

function getMostPopular() {
    return axios.get(`${process.env.REACT_APP_ROOT_URL}/popular/`, authHeader());
}

function deleteContest(id) {
    return axios({
        method: 'delete',
        url: `${process.env.REACT_APP_ROOT_URL}/contests/${id}`,
        headers: authHeader()
    }).then(contests => contests)
        .catch(err => err);
}

function getAll(lek, forward) {
    const id = JSON.parse(localStorage.getItem('user')).id;
    let url = `${process.env.REACT_APP_ROOT_URL}/users/${id}/contests?forward=${forward}`;
    if (!localStorage.getItem('user'))
        url = `${url}&paginate=20`;
    return axios({
        method: 'get',
        url: url,
        headers: authHeader(),
        data: lek
    }).then(contests => contests)
        .catch(err => err);
}

function addContest(name, image, url, startDate, endDate, payment, text, recommendations) {
    const data = new FormData();
    data.append('file', image);
    data.append('filename', image.name);
    data.append('name', name);
    data.append('url', url);
    data.append('startDate', startDate);
    data.append('endDate', endDate);
    data.append('payment', payment);
    data.append('text', text);
    data.append('recommendations', recommendations);
    const id = JSON.parse(localStorage.getItem('user')).id;
    return axios({
        method: 'post',
        url: `${process.env.REACT_APP_ROOT_URL}/users/${id}/contests`,
        data: data,
        headers: authHeader()
    }).then(contests => contests)
        .catch(err => Promise.reject(err));
}

function updateContest(contestId, name, image, url, startDate, endDate, payment, text, recommendations) {
    const data = new FormData();
    if (image) {
        data.append('file', image);
        data.append('filename', image.name);
    }
    data.append('name', name);
    data.append('url', url);
    data.append('startDate', startDate);
    data.append('endDate', endDate);
    data.append('payment', payment);
    data.append('text', text);
    data.append('recommendations', recommendations);
    return axios({
        method: 'put',
        url: `${process.env.REACT_APP_ROOT_URL}/contests/${contestId}`,
        data: data,
        headers: authHeader()
    }).then(contests => contests)
        .catch(err => Promise.reject(err));
}