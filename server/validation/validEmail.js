const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateEmailInput(data) {
  let errors = {};

  //title check-- will be autofilled first
  data.email = !isEmpty(data.email) ? data.email : "";
  if(!Validator.isEmail(data.email)) {
    errors.email = "Valid email is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};