import axios from 'axios';

export const userService = {
    login,
    logout
};

function login(email, password) {
    return axios.post(process.env.REACT_APP_ROOT_URL + '/login', {
        user: {
            email: email,
            password: password
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

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}