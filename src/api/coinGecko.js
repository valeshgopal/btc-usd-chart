// src/api/coinGecko.js
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

export const getBtcUsdData = async (days) => {
    try {
        const response = await axios.get(`${API_URL}/coins/bitcoin/market_chart`, {
            params: {
                vs_currency: 'usd',
                days: days,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching BTC/USD data', error);
        throw error;
    }
};
