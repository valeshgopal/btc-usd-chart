import React, { useState, useEffect } from 'react';
import { getBtcUsdData } from './api/coinGecko';
import Chart from './components/Chart';
import './App.css';

const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const tabs = ['Summary', 'Chart', 'Statistics', 'Analysis', 'Settings'];
const timeRanges = [
  { key: '1', value: '1d' },
  { key: '3', value: '3d' },
  { key: '7', value: '1w' },
  { key: '180', value: '6m' },
  { key: '365', value: '1y' },
  { key: 'max', value: 'max' },
];
function App() {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7');
  const [netChange, setNetChange] = useState(0);
  const [netChangePercent, setNetChangePercent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `btc-usd-${selectedTimeRange}`;
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));
      const currentTime = Date.now();

      if (cachedData && currentTime - cachedData.timestamp < CACHE_EXPIRY_MS) {
        // Use cached data if it's less than 1 day old
        setChartData(cachedData.data);
        setCurrentPrice(cachedData.data[cachedData.data.length - 1][1]);
        setNetChange(
          cachedData.data[cachedData.data.length - 1][1] - cachedData.data[0][1]
        );
        setNetChangePercent(
          ((cachedData.data[cachedData.data.length - 1][1] -
            cachedData.data[0][1]) /
            cachedData.data[0][1]) *
          100
        );
      } else {
        try {
          const data = await getBtcUsdData(selectedTimeRange);
          setChartData(data.prices);
          setCurrentPrice(data.prices[data.prices.length - 1][1]);
          setNetChange(
            data.prices[data.prices.length - 1][1] - data.prices[0][1]
          );
          setNetChangePercent(
            ((data.prices[data.prices.length - 1][1] - data.prices[0][1]) /
              data.prices[0][1]) *
            100
          );

          // Store the data in local storage with a timestamp
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: data.prices, timestamp: currentTime })
          );
        } catch (error) {
          console.error('Error fetching BTC/USD data', error);
        }
      }
    };

    fetchData();
  }, [selectedTimeRange]);

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='current-price'>
          {currentPrice.toLocaleString()}
          <sup
            style={{
              fontSize: '24px',
              color: '#BDBEBF',
              position: 'absolute',
              top: 18,
            }}
          >
            USD
          </sup>
        </h1>
        <h3
          style={{ color: netChange >= 0 ? 'green' : 'red', fontSize: '18px' }}
        >
          {netChange >= 0
            ? `+${netChange.toFixed(2)}`
            : `-${netChange.toFixed(2)}`}{' '}
          <span
            style={{
              color: netChange >= 0 ? 'green' : 'red',
              fontSize: '18px',
            }}
          >
            ({`${netChangePercent.toFixed(2)}%`})
          </span>
        </h3>
      </header>


      <div className='tabs-container'>
        {tabs.map((tab) => {
          return <button key={tab}>{tab}</button>;
        })}
      </div>
      <div className='buttons-container'>
        <div className='icons-container'>
          <div className='icon'>
            <img src='/fullscreen.png' alt='fullscreen' width={'24px'} height={'24px'} />
            <h3>Full screen</h3>
          </div>

          <div className='icon'>
            <img src='/compare.png' alt='compare' width={'24px'} height={'24px'} />
            <h3>Compare</h3>
          </div>
        </div>
        <div className='time-range-buttons'>
          {timeRanges.map((timeRange) => {
            return (
              <button
                key={timeRange.key}
                onClick={() => setSelectedTimeRange(timeRange.key)}
                style={
                  selectedTimeRange === timeRange.key
                    ? { background: 'rgb(75, 64, 238)', color: '#fff' }
                    : {}
                }
              >
                {timeRange.value}
              </button>
            );
          })}
        </div>
      </div>


      <Chart data={chartData} />
    </div>
  );
}

export default App;
