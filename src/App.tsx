import { useState } from 'react'
import './App.css'
import { Button } from './components/Button/Button'
import TimeSeriesBarChart from './components/charts/TimeSeriesBarChart/TimeSeriesBarChart'
import { TimeSeriesDataItem } from './components/charts/TimeSeriesBarChart/ITimeSeriesBarChartProps'
import CategoricalBarChart from './components/charts/CategoricalBarChart/CategoricalBarChart'
import { CategoricalDataItem } from './components/charts/CategoricalBarChart/ICategoricalBarChartProps'

// Sample data for TimeSeriesBarChart
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

// Sample data for CategoricalBarChart - Apple product revenue by fiscal year
const appleRevenueData: CategoricalDataItem[] = [
  // FY 2022
  {group: "FY 2022", category: "iPhone", value: 205},
  {group: "FY 2022", category: "Mac", value: 40},
  {group: "FY 2022", category: "iPad", value: 29},
  {group: "FY 2022", category: "Wearables", value: 41},
  {group: "FY 2022", category: "Services", value: 78},
  // FY 2023
  {group: "FY 2023", category: "iPhone", value: 200},
  {group: "FY 2023", category: "Mac", value: 29},
  {group: "FY 2023", category: "iPad", value: 28},
  {group: "FY 2023", category: "Wearables", value: 39},
  {group: "FY 2023", category: "Services", value: 85},
  // FY 2024
  {group: "FY 2024", category: "iPhone", value: 201},
  {group: "FY 2024", category: "Mac", value: 30},
  {group: "FY 2024", category: "iPad", value: 27},
  {group: "FY 2024", category: "Wearables", value: 37},
  {group: "FY 2024", category: "Services", value: 96},
  // FY 2025 (projected)
  {group: "FY 2025", category: "iPhone", value: 210},
  {group: "FY 2025", category: "Mac", value: 35},
  {group: "FY 2025", category: "iPad", value: 32},
  {group: "FY 2025", category: "Wearables", value: 42},
  {group: "FY 2025", category: "Services", value: 105},
]

function App() {
  const [count, setCount] = useState(0)
  
  // TimeSeriesBarChart controls
  const [barGapDays, setBarGapDays] = useState(2)
  const [barWidthDays, setBarWidthDays] = useState(7)
  const [showXAxisLine, setShowXAxisLine] = useState(true)
  const [showYAxisLine, setShowYAxisLine] = useState(true)
  const [numberOfTicks, setNumberOfTicks] = useState(5)
  
  // CategoricalBarChart controls
  const [barPadding, setBarPadding] = useState(0.1)
  const [groupPadding, setGroupPadding] = useState(0.2)
  const [showCatXAxisLine, setShowCatXAxisLine] = useState(true)
  const [showCatYAxisLine, setShowCatYAxisLine] = useState(true)
  const [catNumberOfTicks, setCatNumberOfTicks] = useState(5)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Grouped Bar Chart App</h1>
        
        {/* CategoricalBarChart Demo */}
        <h2 style={{ marginTop: '40px' }}>Categorical Bar Chart (D3)</h2>
        <div className="card" style={{ marginBottom: '20px' }}>
          <label>barPadding: {barPadding.toFixed(2)}</label>
          <input 
            type="range" 
            min="0" 
            max="0.5" 
            step="0.05"
            value={barPadding} 
            onChange={(e) => setBarPadding(Number(e.target.value))}
            style={{ width: '200px', marginLeft: '10px' }}
          />
        </div>
        <div className="card" style={{ marginBottom: '20px' }}>
          <label>groupPadding: {groupPadding.toFixed(2)}</label>
          <input 
            type="range" 
            min="0" 
            max="0.5" 
            step="0.05"
            value={groupPadding} 
            onChange={(e) => setGroupPadding(Number(e.target.value))}
            style={{ width: '200px', marginLeft: '10px' }}
          />
        </div>
        <div className="card" style={{ marginBottom: '20px' }}>
          <label>numberOfTicks: {catNumberOfTicks}</label>
          <input 
            type="range" 
            min="2" 
            max="15" 
            step="1"
            value={catNumberOfTicks} 
            onChange={(e) => setCatNumberOfTicks(Number(e.target.value))}
            style={{ width: '200px', marginLeft: '10px' }}
          />
        </div>
        <div className="card" style={{ marginBottom: '20px' }}>
          <label>
            <input 
              type="checkbox" 
              checked={showCatXAxisLine}
              onChange={(e) => setShowCatXAxisLine(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Show X-Axis Line
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input 
              type="checkbox" 
              checked={showCatYAxisLine}
              onChange={(e) => setShowCatYAxisLine(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Show Y-Axis Line
          </label>
        </div>
        <div style={{ width: '100%', maxWidth: '1200px', border: '1px solid #2563eb', padding: '10px', marginBottom: '40px' }}>
          <CategoricalBarChart
            data={appleRevenueData}
            title="Apple Revenue by Product Category"
            xLabel="Fiscal Year"
            xLabelStyle={{ fontSize: '16px', fontWeight: 'bold', fill: '#2563eb' }}
            yLabel="Revenue (Billion $)"
            yLabelStyle={{ fontSize: '16px', fontWeight: 'bold', fill: '#dc2626' }}
            yDomain={[0, 250]}
            yTickFormat={(d) => `$${d}B`}
            barPadding={barPadding}
            groupPadding={groupPadding}
            showXAxisLine={showCatXAxisLine}
            showYAxisLine={showCatYAxisLine}
            numberOfTicks={catNumberOfTicks}
            width={1000}
            height={400}
            colors={{
              iPhone: "#5B9BD5",
              Mac: "#ED7D31",
              iPad: "#70AD47",
              Wearables: "#5DADE2",
              Services: "#FFC000",
            }}
          />
        </div>

        {/* TimeSeriesBarChart Demo */}
        <h2>Time Series Bar Chart (D3)</h2>
        <div className="card" style={{ marginBottom: '20px' }}>
          <label>barGapDays: {barGapDays}</label>
          <input 
            type="range" 
            min="0" 
            max="15" 
            step="0.5"
            value={barGapDays} 
            onChange={(e) => setBarGapDays(Number(e.target.value))}
            style={{ width: '200px', marginLeft: '10px' }}
          />
        </div>
        <div className="card" style={{ marginBottom: '20px' }}>
          <label>barWidthDays: {barWidthDays}</label>
          <input 
            type="range" 
            min="1" 
            max="30" 
            step="0.5"
            value={barWidthDays} 
            onChange={(e) => setBarWidthDays(Number(e.target.value))}
            style={{ width: '200px', marginLeft: '10px' }}
          />
        </div>
        <div className="card" style={{ marginBottom: '20px' }}>
          <label>numberOfTicks: {numberOfTicks}</label>
          <input 
            type="range" 
            min="2" 
            max="15" 
            step="1"
            value={numberOfTicks} 
            onChange={(e) => setNumberOfTicks(Number(e.target.value))}
            style={{ width: '200px', marginLeft: '10px' }}
          />
        </div>
        <div className="card" style={{ marginBottom: '20px' }}>
          <label>
            <input 
              type="checkbox" 
              checked={showXAxisLine}
              onChange={(e) => setShowXAxisLine(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Show X-Axis Line
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input 
              type="checkbox" 
              checked={showYAxisLine}
              onChange={(e) => setShowYAxisLine(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Show Y-Axis Line
          </label>
        </div>
        <div style={{ width: '100%', maxWidth: '1200px', border: '1px solid red', padding: '10px' }}>
          <TimeSeriesBarChart
            data={monthlyCabEData}
            xLabel="Month"
            xLabelStyle={{ fontSize: '16px', fontWeight: 'bold', fill: '#2563eb' }}
            yLabel="CabE Values"
            yLabelStyle={{ fontSize: '16px', fontWeight: 'bold', fill: '#dc2626' }}
            yDomain={[0, 30000]}
            yTickFormat={(d) => `${d / 1000}K`}
            offsetLeft={10}
            barGapDays={barGapDays}
            barWidthDays={barWidthDays}
            showXAxisLine={showXAxisLine}
            showYAxisLine={showYAxisLine}
            numberOfTicks={numberOfTicks}
            marginBottom={0}
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