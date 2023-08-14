class FormValidation {
  static notNull(value, fieldName) {
    if (value === null || value === undefined || value === "") {
      return `${fieldName} cannot be empty`;
    }
    return null;
  }
  static minLength(value, length, fieldName) {
    if (value.length < length) {
      return `${fieldName} should have ${length} characters`;
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
    const regex = /[A-Z]/;
    if (!regex.test(value)) {
      return `${fieldName} should contain at least one capital characters`;
    }
    return null;
  }
  static hasSmallLetter(value, fieldName) {
    const regex = /[a-z]/;
    if (!regex.test(value)) {
      return `${fieldName} should contain at least one small characters`;
    }
    return null;
  }
  static hasSpecialCharacter(value, fieldName) {
    const regex = /[^a-zA-Z0-9\s]/;
    if (!regex.test(value)) {
      return `${fieldName} should contain at least one special character`;
    }
    return null;
  }
  static hasNumber(value, fieldName) {
    const regex = /\d/;
    if (!regex.test(value)) {
      return `${fieldName} should contain at least one number`;
    }
    return null;
  }
  static noSpace(value, fieldName) {
    const regex = /\s/;
    if (regex.test(value)) {
      return `${fieldName} should not contain spaces`;
    }
    return null;
  }
  static noRepetitive(value, fieldName) {
    const regex = /(.{3})(?=.*\1)/;
    const match = value.match(regex);
    if (match !== null) {
      const repetitiveSequence = match[1];
      return `${fieldName} should not contain repetitive sequence of '${repetitiveSequence.replace(/\\/g, '')}'`;
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

export { FormValidation };
