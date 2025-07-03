function realToCents(price: any) {
  const numericPrice = parseFloat(price.replace(/\./g, "").replace(",", "."));
  const priceInCentes = Math.round(numericPrice * 100);
  const priceIntsToString = priceInCentes.toString();

  return priceIntsToString;
}

function centsToReal(price: any) {
  const priceInReal = price / 100;
  const priceInRealString = priceInReal.toFixed(2).replace(".", ",");

  return priceInRealString;
}

// mascaras input valores
function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
  let { value } = event.target;
  value = value.replace(/\D/g, "");

  if (value) {
    value = (parseInt(value, 10) / 100).toFixed(2);
    value = value.replace(".", ",");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  event.target.value = value;
}

const ConvertCurrency = {
  realToCents,
  centsToReal,
  changeCurrency,
};

export { ConvertCurrency };
