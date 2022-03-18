// import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fecthAllCoinsTickers } from "../api";

const Container = styled.div`
  padding: 0px 20px;
  width: 70%;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 50px;
`;

const Title = styled.h1`
  font-size: 72px;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

interface PercentProps {
  isPriceUp: boolean;
}

const Price = styled.div<PercentProps>`
  display: flex;
  align-items: center;
  margin-right: 10px;
  color: ${(props) =>
    props.isPriceUp ? props.theme.upColor : props.theme.downColor};
  transition: color 1s ease;
`;

const ArrowStatus = styled.span`
  font-size: 20px;
`;

const PriceStatus = styled.h1`
  font-size: 20px;
  font-weight: 700;
`;

const PricePercentStatus = styled.div`
  font-size: 20px;
`;

const PricePercent = styled.div<PercentProps>`
  display: flex;
  align-items: center;
  margin-right: 20px;
  padding: 5px 7px;
  background-color: ${(props) =>
    props.isPriceUp ? props.theme.upColor : props.theme.downColor};
  color: white;
  border-radius: 5px;
  transition: background-color 1s ease;
`;

const CoinsList = styled.ul`
  width: 100%;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
`;

const Coin = styled.li`
  display: flex;
  align-items: center;
  background-color: whitesmoke;
  color: ${(props) => props.theme.bgColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    padding: 20px;
    transition: color 0.2s ease-in; // 속성을 서서히 변화
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 20px;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
  ${Price} {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;

interface IQuotes {
  price: number;
  volume_24h: number;
  volume_24h_change_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  percent_change_15m: number;
  percent_change_30m: number;
  percent_change_1h: number;
  percent_change_6h: number;
  percent_change_12h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_1y: number;
  ath_price: number;
  ath_date: Date;
  percent_from_price_ath: number;
}

interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: Date;
  last_updated: Date;
  quotes: { USD: IQuotes };
}

// &rarr; => 화살표 모양
function Coins() {
  // react-query 사용 전
  // const [coins, setCoins] = useState<CoinInterface[]>([]);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   (async () => {
  //     const json = await (
  //       await fetch("https://api.coinpaprika.com/v1/coins")
  //     ).json();
  //     setCoins(json.slice(0, 100));
  //     setLoading(false);
  //   })();
  // }, []);

  //react-query 사용
  const { isLoading, data } = useQuery<IPriceData[]>(
    "Alltickers",
    fecthAllCoinsTickers,
    {
      refetchInterval: 10000, // 10초마다 갱신
    }
  );

  return (
    <Container>
      <Helmet>
        <title>COIN TRACKER</title>
      </Helmet>
      <Header>
        <Title>COIN TRACKER</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`}>
                <Img
                  src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name}
              </Link>
              <Price
                isPriceUp={
                  coin?.quotes.USD.percent_change_24h
                    ? coin?.quotes.USD.percent_change_24h > 0
                    : false
                }
              >
                <PriceStatus>
                  $
                  {coin?.quotes.USD.price
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                </PriceStatus>
              </Price>
              <PricePercent
                isPriceUp={
                  coin?.quotes.USD.percent_change_24h
                    ? coin?.quotes.USD.percent_change_24h > 0
                    : false
                }
              >
                <ArrowStatus>
                  {(
                    coin?.quotes.USD.percent_change_24h
                      ? coin?.quotes.USD.percent_change_24h > 0
                      : false
                  )
                    ? "▲ "
                    : "▼ "}
                </ArrowStatus>
                <PricePercentStatus>
                  {(
                    coin?.quotes.USD.percent_change_24h
                      ? coin?.quotes.USD.percent_change_24h > 0
                      : false
                  )
                    ? coin!.quotes.USD.percent_change_24h.toFixed(1).toString()
                    : coin!.quotes.USD.percent_change_24h
                        .toFixed(1)
                        .toString()
                        .replace("-", "")}
                  %
                </PricePercentStatus>
              </PricePercent>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
