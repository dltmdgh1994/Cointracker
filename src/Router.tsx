import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chart from "./routes/Chart";
import Coin from "./routes/Coin";
import Coins from "./routes/Coins";
import Prediction from "./routes/Prediction";

function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Coins />} />
        {/* nested routes */}
        <Route path="/:coinId" element={<Coin />}>
          <Route path="chart" element={<Chart />} />
          <Route path="prediction" element={<Prediction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
