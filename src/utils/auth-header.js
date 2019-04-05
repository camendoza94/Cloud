export function authHeader() {
    // return authorization header with token auth credentials
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token.S) {
        return {'Authorization': 'Token ' + user.token.S};
    } else {
        return {};
    }
}