import ReactApexChart from "react-apexcharts";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router";
import { fetchCoinHistory } from "../api";

interface ChartProps {
  coinId: string;
}

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
  x: number;
}

function Chart() {
  const { coinId } = useOutletContext<ChartProps>();
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000, // 10초마다 갱신
    }
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ReactApexChart
          type="candlestick"
          series={[
            // 차트에 표시하려는 데이터
            {
              data:
                data?.map((price) => {
                  return {
                    x: price.time_close.slice(2, 10),
                    y: [
                      price.open.toFixed(2),
                      price.high.toFixed(2),
                      price.low.toFixed(2),
                      price.close.toFixed(2),
                    ],
                  };
                }) ?? [],
            },
          ]}
          options={{
            // 차트의 구성 옵션
            theme: {
              mode: "dark",
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            // grid: { show: false },
            // stroke: { // 둥근 마감처리
            //   curve: "smooth",
            //   width: 4,
            // },
            // yaxis: {
            //   show: false,
            // },
            // xaxis: {
            //   axisBorder: { show: false },
            //   axisTicks: { show: false },
            //   labels: { show: false },
            // },
            // plotOptions: {
            //   candlestick: {
            //     colors: {
            //       upward: "#DF7D46", // 상승 시 색상
            //       downward: "#3C90EB", // 하락 시 색상
            //     },
            //   },
            // },
          }}
        ></ReactApexChart>
      )}
    </div>
  );
}

export default Chart;
