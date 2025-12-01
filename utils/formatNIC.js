export const formatNIC = (value) => {
  // remove all non-digits
  const digits = value.replace(/\D/g, "");

  let formatted = "";

  if (digits.length <= 5) {
    formatted = digits;
  } else if (digits.length <= 12) {
    formatted = digits.slice(0, 5) + "-" + digits.slice(5);
  } else {
    formatted =
      digits.slice(0, 5) +
      "-" +
      digits.slice(5, 12) +
      "-" +
      digits.slice(12, 13);
  }

  return formatted;
};
