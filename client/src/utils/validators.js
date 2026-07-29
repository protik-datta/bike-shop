/**
 * Form validation helpers for checkout and contact forms.
 * Each function returns { valid: boolean, message: string }.
 */

const BD_PHONE_RE = /^(?:\+?880|0)1[3-9]\d{8}$/;
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value, label = "This field") {
  if (!value || String(value).trim() === "") {
    return { valid: false, message: `${label} is required.` };
  }
  return { valid: true, message: "" };
}

export function validateMinLength(value, min, label = "This field") {
  if (!value || value.trim().length < min) {
    return { valid: false, message: `${label} must be at least ${min} characters.` };
  }
  return { valid: true, message: "" };
}

export function validateMaxLength(value, max, label = "This field") {
  if (value && value.trim().length > max) {
    return { valid: false, message: `${label} must not exceed ${max} characters.` };
  }
  return { valid: true, message: "" };
}

export function validatePhone(value) {
  if (!value || String(value).trim() === "") {
    return { valid: false, message: "Phone number is required." };
  }
  if (!BD_PHONE_RE.test(value.trim())) {
    return { valid: false, message: "Enter a valid Bangladeshi phone number." };
  }
  return { valid: true, message: "" };
}

export function validateEmail(value, required = false) {
  if (!value || String(value).trim() === "") {
    if (required) return { valid: false, message: "Email is required." };
    return { valid: true, message: "" };
  }
  if (!EMAIL_RE.test(value.trim())) {
    return { valid: false, message: "Enter a valid email address." };
  }
  return { valid: true, message: "" };
}

export function validateCheckoutForm(fields) {
  const errors = {};

  const firstName = validateRequired(fields.firstName, "First name");
  if (!firstName.valid) errors.firstName = firstName.message;

  const phone = validatePhone(fields.phone);
  if (!phone.valid) errors.phone = phone.message;

  const streetAddress = validateRequired(fields.streetAddress, "Street address");
  if (!streetAddress.valid) errors.streetAddress = streetAddress.message;

  const division = validateRequired(fields.division, "Division");
  if (!division.valid) errors.division = division.message;

  const district = validateRequired(fields.district, "District");
  if (!district.valid) errors.district = district.message;

  if (fields.email) {
    const email = validateEmail(fields.email);
    if (!email.valid) errors.email = email.message;
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export function validateContactForm(fields) {
  const errors = {};

  const name = validateRequired(fields.name, "Name");
  if (!name.valid) errors.name = name.message;

  const email = validateEmail(fields.email, true);
  if (!email.valid) errors.email = email.message;

  const message = validateMinLength(fields.message, 10, "Message");
  if (!message.valid) errors.message = message.message;

  return { errors, isValid: Object.keys(errors).length === 0 };
}
