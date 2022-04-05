// import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import {
  Link,
  Outlet,
  useLocation,
  useMatch,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";

const Container = styled.div`
  padding: 0px 20px;
  width: 80%;
  margin: 0 auto;
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
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 50px;
  margin-bottom: 50px;
`;
const CoinBody = styled.div`
  display: flex;
  justify-content: center;
`;
const CoinInfo = styled.div`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  border-radius: 5px;
  margin-bottom: 20px;
`;
const CoinInfoBox = styled.div`
  height: 30vh;
  border-radius: 15px;
  background-color: whitesmoke;
  color: ${(props) => props.theme.bgColor};
`;
const Img = styled.img`
  width: 35px;
  height: 35px;
`;
const CoinTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  h1 {
    font-size: 30px;
    font-weight: 700;
    margin-left: 10px;
  }
`;
const CoinDetail = styled.div`
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-all;
  font-weight: 600;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;
const CoinBasicBox = styled.div`
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  font-weight: 600;
  span:first-child {
    font-size: 11px;
    font-weight: 400;
    padding-bottom: 8px;
  }
  &:last-child {
    border: none;
  }
`;

interface PercentProps {
  isPriceUp: boolean;
}
const Price = styled.div<PercentProps>`
  display: flex;
  align-items: center;
  margin-right: 8px;
  color: ${(props) =>
    props.isPriceUp ? props.theme.upColor : props.theme.downColor};
  transition: color 1s ease;
`;
const ArrowStatus = styled.span`
  font-size: 18px;
`;
const PriceStatus = styled.h1`
  font-size: 30px;
  font-weight: 700;
`;
const PricePercentStatus = styled.div`
  font-size: 20px;
  font-weight: 700;
`;
const PricePercent = styled.div<PercentProps>`
  display: flex;
  align-items: center;
  padding: 5px 7px;
  background-color: ${(props) =>
    props.isPriceUp ? props.theme.upColor : props.theme.downColor};
  color: white;
  border-radius: 5px;
  transition: background-color 1s ease;
`;
const CoinPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;
const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  // 탭이 선택된 상태면 색깔이 변함
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface ILocation {
  state: {
    name: string;
  };
}
interface ITag {
  id: string;
  name: string;
  coin_counter: number;
  ico_counter: number;
}
// http://json2ts.com/ => json을 타입스크립트 타입으로 변환
// console.lop로 받아온 json을 전역변수로 저장 후 Object.keys(temp1).join()
// Ctrl+D: 같은 문자열 선택
// Shift+Alt+i: 선택한 모든 문자열에 가장 우측 끝으로 포커싱
// Ctrl+Shift+오른쪽 화살표: 현재 선택한 문자열을 기준으로 우측 끝까지 문자열 선택
interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  tags: ITag[]; // typescript는 array가 있으면 직접 설명해줘야 한다.
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  links: object;
  links_extended: object;
  whitepaper: object;
  first_data_at: string;
  last_data_at: string;
}
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

function Coin() {
  const { coinId } = useParams();
  // react-router-dom이 보내주는 location object에 접근
  const { state } = useLocation() as ILocation;
  const chartMatch = useMatch("/:coinId/chart");
  const predictionMatch = useMatch("/:coinId/prediction");

  // react-query 사용 전
  // useEffect(() => {
  //   (async () => {
  //     const infoData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //     ).json();
  //     const priceData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //     ).json();
  //     setInfo(infoData);
  //     setPriceInfo(priceData);
  //     setLoading(false);
  //   })();
  // }, [coinId]);

  // react-query 사용
  // !=> 확장 할당 어션셜로 값이 무조건 할당되어있다고 컴파일러에게 전달해 값이 없어도 변수를 사용
  const { isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId!)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<IPriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId!),
    {
      refetchInterval: 10000, // 10초마다 갱신
    }
  );

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Link to={`/`}>
          <Img src="home.png" />
        </Link>
        {/* state가 존재하면 name을 가져오고 아니면 로딩 */}
        {/* state를 통해 홈화면으로 올때만 정보 접근 가능 */}
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : "COIN TRACKER"}
        </Title>
        <div />
      </Header>

      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <CoinBody>
            <CoinInfo>
              <CoinInfoBox>
                <CoinTitle>
                  <Img
                    src={`https://cryptoicon-api.vercel.app/api/icon/${infoData?.symbol.toLowerCase()}`}
                  />
                  <h1>
                    {infoData?.name}({infoData?.symbol})
                  </h1>
                </CoinTitle>
                <CoinDetail>
                  {infoData?.description.length! >= 200
                    ? infoData?.description.substring(0, 200) + "..."
                    : infoData?.description}
                </CoinDetail>
                <CoinBasicBox>
                  <span>Org Structure</span>
                  <span>{infoData?.org_structure}</span>
                </CoinBasicBox>
                <CoinBasicBox>
                  <span>Hash Algorithm</span>
                  <span>{infoData?.hash_algorithm}</span>
                </CoinBasicBox>
              </CoinInfoBox>
              <CoinInfoBox>
                <CoinPrice>
                  <Price
                    isPriceUp={
                      tickersData?.quotes.USD.percent_change_24h
                        ? tickersData?.quotes.USD.percent_change_24h > 0
                        : false
                    }
                  >
                    <PriceStatus>
                      $
                      {tickersData?.quotes.USD.price
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </PriceStatus>
                  </Price>
                  <PricePercent
                    isPriceUp={
                      tickersData?.quotes.USD.percent_change_24h
                        ? tickersData?.quotes.USD.percent_change_24h > 0
                        : false
                    }
                  >
                    <ArrowStatus>
                      {(
                        tickersData?.quotes.USD.percent_change_24h
                          ? tickersData?.quotes.USD.percent_change_24h > 0
                          : false
                      )
                        ? "▲ "
                        : "▼ "}
                    </ArrowStatus>
                    <PricePercentStatus>
                      {(
                        tickersData?.quotes.USD.percent_change_24h
                          ? tickersData?.quotes.USD.percent_change_24h > 0
                          : false
                      )
                        ? tickersData!.quotes.USD.percent_change_24h
                            .toFixed(1)
                            .toString()
                        : tickersData!.quotes.USD.percent_change_24h
                            .toFixed(1)
                            .toString()
                            .replace("-", "")}
                      %
                    </PricePercentStatus>
                  </PricePercent>
                </CoinPrice>
                <CoinBasicBox>
                  <span>All Time High</span>
                  <span>
                    $
                    {tickersData?.quotes.USD.ath_price
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    ← {tickersData?.quotes.USD.ath_date.toString().slice(0, 10)}
                  </span>
                </CoinBasicBox>
                <CoinBasicBox>
                  <span>Market Cap</span>
                  <span>
                    $
                    {tickersData?.quotes.USD.market_cap
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </CoinBasicBox>
                <CoinBasicBox>
                  <span>Supply</span>
                  <span>
                    {tickersData?.total_supply} / {tickersData?.max_supply}(Max)
                  </span>
                </CoinBasicBox>
              </CoinInfoBox>
            </CoinInfo>
          </CoinBody>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={predictionMatch !== null}>
              <Link to={`/${coinId}/prediction`}>Prediction</Link>
            </Tab>
          </Tabs>
          {/* Router에서 nested routes로 정의 */}
          <Outlet context={{ coinId }} />
        </>
      )}
    </Container>
  );
}

export default Coin;
