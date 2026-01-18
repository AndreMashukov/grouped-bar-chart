import { useState } from 'react'
import './App.css'
import { Button } from './components/Button/Button'
import TimeSeriesBarChart from './components/charts/TimeSeriesBarChart/TimeSeriesBarChart'
import { TimeSeriesDataItem } from './components/charts/TimeSeriesBarChart/ITimeSeriesBarChartProps'

// Sample data for testing
const monthlyCabEData: TimeSeriesDataItem[] = [
  {date: new Date("2025-02-01"), category: "Sold CabE", value: 10500},
  {date: new Date("2025-02-01"), category: "Total CabE", value: 20500},
  {date: new Date("2025-03-01"), category: "Sold CabE", value: 12000},
  {date: new Date("2025-03-01"), category: "Total CabE", value: 20200},
  {date: new Date("2025-04-01"), category: "Sold CabE", value: 11800},
  {date: new Date("2025-04-01"), category: "Total CabE", value: 21000},
  {date: new Date("2025-05-01"), category: "Sold CabE", value: 13000},
  {date: new Date("2025-05-01"), category: "Total CabE", value: 22500},
  {date: new Date("2025-06-01"), category: "Sold CabE", value: 13500},
  {date: new Date("2025-06-01"), category: "Total CabE", value: 23500},
]

function App() {
  const [count, setCount] = useState(0)
  const [offsetLeft, setOffsetLeft] = useState(10)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Grouped Bar Chart App</h1>
        <div className="card" style={{ marginBottom: '20px' }}>
          <label>offsetLeft: {offsetLeft}</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={offsetLeft} 
            onChange={(e) => setOffsetLeft(Number(e.target.value))}
            style={{ width: '200px', marginLeft: '10px' }}
          />
        </div>
        <div style={{ width: '100%', maxWidth: '1200px', border: '1px solid red', padding: '10px' }}>
          <TimeSeriesBarChart
            data={monthlyCabEData}
            xLabel="Month"
            yLabel="CabE Values"
            yDomain={[0, 30000]}
            yTickFormat={(d) => `${d / 1000}K`}
            offsetLeft={offsetLeft}
            width={1000}
            height={400}
          />
        </div>
        <div className="card">
          <Button 
            label={`count is ${count}`}
            onClick={() => setCount((count) => count + 1)}
          />
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </header>
    </div>
  )
}

export default App