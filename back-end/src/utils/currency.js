export const INR_TO_USD_RATE = 87;

export const convertInrToUsd = (inrAmount, rate = INR_TO_USD_RATE) => {
    const num = Number(inrAmount);
    if (isNaN(num) || num <= 0) return 0;
    return Number((num / rate).toFixed(2));
};

export const convertUsdToInr = (usdAmount, rate = INR_TO_USD_RATE) => {
    const num = Number(usdAmount);
    if (isNaN(num) || num <= 0) return 0;
    return Number((num * rate).toFixed(2));
};
