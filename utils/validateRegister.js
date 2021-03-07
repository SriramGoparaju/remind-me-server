module.exports.validateRegister = (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  // check if the firstname and lastname are empty
  if (firstName.trim() === "") {
    errors.firstName = "First name field cannot be left empty";
  }
  if (lastName.trim() === "") {
    errors.lastName = "Last name field cannot be left empty";
  }

  //check if the email is empty and then checked if the format matches that of an email
  if (email.trim === "") {
    errors.email = "Email field cannot be left empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  //check if the password field is empty and if not then check if the two passwords match
  if (password === "") {
    errors.password = "Password field cannot be left empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
