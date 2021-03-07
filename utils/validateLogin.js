module.exports.validatelogin = (email, password) => {
    const errors = {};

    //check if the email is empty and then checked if the format matches that of an email 
    if(email.trim === ""){
        errors.email = "Email field cannot be left empty"
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Email must be a valid email address';
        }
    }

    if(password === ""){
        errors.password = "Password field cannot be left empty"
    } 

    return {
        errors,
        valid : Object.keys(errors).length < 1
    }
}