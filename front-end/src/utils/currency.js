export const INR_TO_USD_RATE = 87; // 1 USD ≈ 87 INR

/**
 * Converts Indian Rupee (INR) amount to US Dollar (USD) number.
 * @param {number|string} inrAmount - Amount in INR
 * @param {number} [rate=INR_TO_USD_RATE] - Exchange rate
 * @returns {number} Converted amount in USD
 */
export const convertInrToUsd = (inrAmount, rate = INR_TO_USD_RATE) => {
    const num = Number(inrAmount);
    if (isNaN(num) || num <= 0) return 0;
    return Number((num / rate).toFixed(2));
};

/**
 * Converts US Dollar (USD) amount to Indian Rupee (INR) number.
 * @param {number|string} usdAmount - Amount in USD
 * @param {number} [rate=INR_TO_USD_RATE] - Exchange rate
 * @returns {number} Converted amount in INR
 */
export const convertUsdToInr = (usdAmount, rate = INR_TO_USD_RATE) => {
    const num = Number(usdAmount);
    if (isNaN(num) || num <= 0) return 0;
    return Number((num * rate).toFixed(2));
};

/**
 * Converts Indian Rupee (INR) amount to formatted US Dollar string (e.g. "$12.50").
 * @param {number|string} inrAmount - Amount in INR
 * @param {number} [rate=INR_TO_USD_RATE] - Exchange rate
 * @returns {string} Formatted USD string
 */
export const formatInrToUsd = (inrAmount, rate = INR_TO_USD_RATE) => {
    const usd = convertInrToUsd(inrAmount, rate);
    return `$${usd.toFixed(2)}`;
};
