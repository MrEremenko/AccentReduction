const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateUserInput(data, {moderator = false, tutor = false} = {}) {
  let errors = {};

  //moderator check
  if(moderator) {
    data.moderatorEmail = !isEmpty(data.moderatorEmail, { ignore_whitespace: true}) ? data.moderatorEmail : "";
    if(Validator.isUUID(data.moderatorEmail, 4)) {
      errors.moderatorEmail = "Moderator Email required";
    }
  }

  //tutor check
  if(tutor) {
    data.tutorEmail = !isEmpty(data.tutorEmail, { ignore_whitespace: true}) ? data.tutorEmail : "";
    if(Validator.isUUID(data.tutorEmail, 4)) {
      errors.tutorEmail = "Tutor Email required";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};