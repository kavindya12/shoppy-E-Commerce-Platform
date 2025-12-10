// Currency conversion rates (1 USD = X LKR)
const USD_TO_LKR = 330; // Approximate rate, update as needed

export const formatPrice = (price, currency = 'USD') => {
  if (currency === 'LKR') {
    const lkrPrice = price * USD_TO_LKR;
    return `Rs. ${lkrPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const convertToLKR = (usdPrice) => {
  return usdPrice * USD_TO_LKR;
};

export const convertToUSD = (lkrPrice) => {
  return lkrPrice / USD_TO_LKR;
};

