class ReactFormValidation {
    static notNull(value, fieldName) {
      if (value === null || value === undefined || value === "") {
        return `${fieldName} cannot be empty`;
      }
      return null;
    }
  
    static minLength(value, length, fieldName) {
      if (value.length < length) {
        return `${fieldName} should have at least ${length} characters`;
      }
      return null;
    }
  
    static maxLength(value, length, fieldName) {
      if (value.length > length) {
        return `${fieldName} cannot exceed ${length} characters`;
      }
      return null;
    }

    static hasCapitalLetter(value, fieldName) {
      if (!/[A-Z]/.test(value)) {
        return `${fieldName} should have at least 1 capital letter`;
      }
      return null;
    }
  
    static hasSmallLetter(value, fieldName) {
      if (!/[a-z]/.test(value)) {
        return `${fieldName} should have at least 1 small letter`;
      }
      return null;
    }
  
    static hasNumber(value, fieldName) {
      if (!/\d/.test(value)) {
        return `${fieldName} should have at least 1 number`;
      }
      return null;
    }
  
    static hasSpecialCharacter(value, fieldName) {
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return `${fieldName} should have at least 1 special character`;
      }
      return null;
    }
  
    static hasNoSequence(value, fieldName) {
      if (/(.)\1\1/.test(value)) {
        return `${fieldName} should not have a sequence of three or more identical characters`;
      }
      return null;
    }

    static onlyAlphabets(value, fieldName) {
      const regex = /^[a-zA-Z]+$/;
      if (!regex.test(value)) {
        return `${fieldName} should contain only alphabets`;
      }
      return null;
    }
  
    static onlyNumbers(value, fieldName) {
      const regex = /^[0-9]+$/;
      if (!regex.test(value)) {
        return `${fieldName} should contain only numbers`;
      }
      return null;
    }
  
    static indianPincode(value, fieldName) {
      const regex = /^[1-9][0-9]{5}$/;
      if (!regex.test(value)) {
        return `${fieldName} should be a valid Indian pincode`;
      }
      return null;
    }
  
    static indianMobileNumber(value, fieldName) {
      const regex = /^[6-9][0-9]{9}$/;
      if (!regex.test(value)) {
        return `${fieldName} should be a valid Indian mobile number`;
      }
      return null;
    }
  }
  
  module.exports = {ReactFormValidation};
  