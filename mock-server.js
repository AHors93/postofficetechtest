// Mock exchange-rate server — mirrors the upstream
// stuartmcvean/ExchangeRateTestData API (same endpoint, same key, same shape).

const express = require('express');

const PORT = 8000;
const API_KEY = '85f7ccfd-677a-4e5a-a5eb-21c19734edf7';

const ratesPerGBP = {
  EUR: { rate: 1.1661482, name: 'Euro', symbol: '€' },
  USD: { rate: 1.2638436, name: 'US Dollar', symbol: '$' },
  CAD: { rate: 1.7173866, name: 'Canadian dollar', symbol: '$' },
  JPY: { rate: 191.63238, name: 'Japanese Yen', symbol: '¥' },
  NZD: { rate: 2.1018546, name: 'New Zealand Dollar', symbol: '$' },
  THB: { rate: 46.45587, name: 'Thai Bhat', symbol: '฿' },
  CNY: { rate: 9.1417166, name: 'Chinese Yuan', symbol: '¥' },
  AUD: { rate: 1.9147731, name: 'Australian Dollar', symbol: '$' },
  CHF: { rate: 1.1399409, name: 'Swiss Franc', symbol: 'Fr' },
  ZAR: { rate: 23.606591, name: 'South African Rand', symbol: 'R' },
};

function getRatesForCurrency(currency) {
  if (currency === 'GBP') return ratesPerGBP;
  const base = ratesPerGBP[currency];
  if (!base) return null;
  const inverseRate = 1 / base.rate;
  const response = {
    GBP: {
      rate: parseFloat(inverseRate.toFixed(7)),
      name: 'British Pound',
      symbol: '£',
    },
  };
  for (const [code, value] of Object.entries(ratesPerGBP)) {
    if (code === currency) continue;
    response[code] = {
      rate: parseFloat((inverseRate * value.rate).toFixed(7)),
      name: value.name,
      symbol: value.symbol,
    };
  }
  return response;
}

const app = express();

app.get('/rates/:basecurrency', (req, res) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey) return res.status(400).send({ message: 'Invalid request' });
  if (apiKey !== API_KEY)
    return res.status(401).send({ message: 'Invalid API key' });

  const rates = getRatesForCurrency(req.params.basecurrency.toUpperCase());
  if (!rates) return res.status(400).send({ message: 'Invalid request' });
  res.send(rates);
});

app.listen(PORT, () => {
  console.log(`Mock rates server listening on http://localhost:${PORT}`);
});
