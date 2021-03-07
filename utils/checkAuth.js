const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { SECRET_KEY_JWT } = require('../config');


const checkAuth = (context) => {
    // context here contains the req which contains all the headers including the authorization header
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        // authHeader is of the form Bearer [token]
        const token = authHeader.split('Bearer ')[1];
        if(token) {
            try {
                // verify the token and get the user
                const user = jwt.verify(token, SECRET_KEY_JWT);
                return user;
            } catch(err) {
                throw new AuthenticationError('Invalid / Expired token')
            }
        } 
        throw new Error("Authentication token must be 'Bearer [token]'")
    }
    throw new Error('Authorization header must be provided');
};

module.exports = checkAuth;