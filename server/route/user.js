const auth = require('../config/auth');
const User = require('../controller/user');

// Users
module.exports = (app) => {
    
    // User registration
    app.post('/users', auth.optional, User.registerUser);

    // User login
    app.post('/login', auth.optional, User.logIn);

    // Contest of the user with id :id
    app.get('/users/:id/contests', auth.required, User.getContests);

    // Create contests for the user with id :id
    app.post('/users/:id/contests', auth.required, User.addContests);
    
};