export const createWhatsAppLink = (phone, message = '') => {
  if (!phone) return '#';
  // Clean phone number: remove spaces, dashes, parentheses
  let cleanPhone = phone.replace(/[\s\-()]/g, '');
  
  // Format Egyptian numbers starting with 01 to international +201
  if (cleanPhone.startsWith('01')) {
    cleanPhone = '20' + cleanPhone.slice(1);
  } else if (cleanPhone.startsWith('+')) {
    cleanPhone = cleanPhone.slice(1);
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
