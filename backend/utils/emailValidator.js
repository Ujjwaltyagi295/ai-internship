// utils/emailValidator.js
export const isBennettEmail = (email = "") => {
  const trimmed = email.trim().toLowerCase();
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicRegex.test(trimmed)) return false;
  return trimmed.endsWith("@bennett.edu.in");
};