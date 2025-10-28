import { EMAIL_REGEX, PHONE_REGEX, URL_REGEX } from '../config/constants';

export const validateEmail = (email) => EMAIL_REGEX.test(email);
export const validatePhone = (phone) => PHONE_REGEX.test(phone);
export const validateURL = (url) => URL_REGEX.test(url);
export const validateAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);
export const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
