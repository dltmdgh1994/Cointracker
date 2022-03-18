const BASE_URL = `https://api.coinpaprika.com/v1`;

export async function fecthCoins() {
  return await await (await fetch(`${BASE_URL}/coins`)).json();
}

export async function fetchCoinInfo(coinId: string) {
  return await await (await fetch(`${BASE_URL}/coins/${coinId}`)).json();
}

export async function fetchCoinTickers(coinId: string) {
  return await await (await fetch(`${BASE_URL}/tickers/${coinId}`)).json();
}

export async function fetchCoinHistory(coinId: string) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 28;
  return await await (
    await fetch(
      `${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
    )
  ).json();
}
