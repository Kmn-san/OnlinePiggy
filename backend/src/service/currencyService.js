import axios from 'axios';
import { EXCHANGE_API_ENDPOINTS } from '../utlis/api.js';

/**
 * Fetches the current exchange rate ratio between a base currency and target currency.
 */
export const fetchExchangeRate = async (baseCurrency, targetCurrency) => {
    const options = {
        method: 'GET',
        url: `${EXCHANGE_API_ENDPOINTS.EXCHANGE_BASE_URL}${EXCHANGE_API_ENDPOINTS.CONVERT}`,
        params: {
            base: baseCurrency,
            target: targetCurrency
        },
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': process.env.RAPID_API_HOST,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data.convert_result.rate;
    } catch (error) {
        console.error('Failed to fetch currency exchange rate:', error);
        throw new Error('Currency conversion service unavailable');
    }
};