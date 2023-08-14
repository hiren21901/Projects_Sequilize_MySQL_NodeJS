import { stripHtml } from "string-strip-html";

class DataCleaner {
  /**
   * Middleware to clean the data in the request body.
   * Performs various cleaning operations on string values in JSON data.
   */
  static cleanData(req, res, next) {
    if (req.body) {
      DataCleaner.cleanObjectValues(req.body);
    }
    next();
  }
  /**
   * Recursively cleans string values in an object or array.
   * @param {object|array|string} data - The data to clean.
   */
  static cleanObjectValues(data) {
    if (Array.isArray(data)) {
      data.forEach((value, index) => {
        if (typeof value === "object") {
          DataCleaner.cleanObjectValues(value);
        } else if (typeof value === "string") {
          data[index] = DataCleaner.cleanString(value);
        }
      });
    } else if (typeof data === "object") {
      for (const key in data) {
        if (typeof data[key] === "object") {
          DataCleaner.cleanObjectValues(data[key]);
        } else if (typeof data[key] === "string") {
          data[key] = DataCleaner.cleanString(data[key]);
        }
      }
    } else if (typeof data === "string") {
      data = DataCleaner.cleanString(data);
    }
  }
  /**
   * Performs various cleaning operations on a string value.
   * @param {string} value - The string value to clean.
   * @returns {string} - The cleaned string value.
   */
  static cleanString(value) {
    value = DataCleaner.trimData(value);
    value = DataCleaner.removeExtraSpaces(value);
    value = DataCleaner.removeSpaceBeforePunctuation(value);
    value = DataCleaner.removeNonASCIICharacters(value);
    value = DataCleaner.removeScript(value);
    return value;
  }
  /**
   * Removes leading and trailing spaces from a string.
   * @param {string} value - The string value to trim.
   * @returns {string} - The trimmed string value.
   */
  static trimData(value) {
    return value.trim();
  }
  /**
   * Removes extra spaces between two words in a string.
   * @param {string} value - The string value to remove extra spaces from.
   * @returns {string} - The string value with extra spaces removed.
   */
  static removeExtraSpaces(value) {
    return value.replace(/\s+/g, " ");
  }
  /**
   * Removes space before commas and full stops in a string.
   * @param {string} value - The string value to remove spaces before commas and full stops from.
   * @returns {string} - The string value with spaces before commas and full stops removed.
   */
  static removeSpaceBeforePunctuation(value) {
    return value.replace(/\s+([,.])/g, "$1");
  }
  /**
   * Removes non-ASCII characters from a string.
   * @param {string} value - The string value to remove spaces before commas and full stops from.
   * @returns {string} - The string value with spaces before commas and full stops removed.
   */
  static removeNonASCIICharacters(value) {
    return value.replace(/[^\x00-\x7F]/g, "");
  }
  /**
   * Removes <script> tags from a string value.
   * @param {string} value - The string value to remove <script> tags from.
   * @returns {string} - The string value with <script> tags removed.
   */
  static removeScript(value) {
    return value.replace(/<script.*?<\/script>/gi, "");
  }
  /**
   * Converts a string to proper case.
   * @param {string} value - The string value to convert to proper case.
   * @returns {string} - The string value in proper case.
   */
  static toProperCase(value) {
    return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
export default DataCleaner;
