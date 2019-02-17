import axios from 'axios';

export const userService = {
    login,
    logout,
    register
};

function login(email, password) {
    return axios.post(process.env.REACT_APP_ROOT_URL + '/login', {
        user: {
            email,
            password
        }
    }).then(response => {
        // login successful if there's a user in the response
        if (response.data.user) {
            // store token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data.user;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(email, password, firstName, lastName) {
    return axios.post(process.env.REACT_APP_ROOT_URL + '/users', {
        user: {
            email,
            password,
            firstName,
            lastName
        }
    }).then(response => {
        // login successful if there's a user in the response
        if (response.data.user) {
            // store token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data.user;
    }).catch(err => {
        return Promise.reject(err);
    });
}