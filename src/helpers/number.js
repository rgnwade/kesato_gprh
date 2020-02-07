const Numbers = {};

Numbers.formatedPrice = (value, currency = "IDR", locale = "id-ID") => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2
  });
  return formatter.format(value);
};

module.exports = Numbers;
