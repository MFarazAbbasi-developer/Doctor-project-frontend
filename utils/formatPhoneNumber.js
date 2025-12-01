export const formatPhoneNumber = (value) => {
  // Remove non-digit characters
  let digits = value.replace(/\D/g, "");

  let formatted = "";

  // if (digits.length <= 13) {
  //   // 0300
  //   formatted = digits;
  // } else {
  //   // 0300-1234567
  //   formatted = digits.slice(0, 4) + "-" + digits.slice(4, 11);
  // }

   // Limit to 11 digits
  if (digits.length > 11) {
    digits = digits.slice(0, 11);
  }

  // return formatted;
  return digits
};
