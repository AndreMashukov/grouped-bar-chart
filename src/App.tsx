import { useState } from 'react'
import './App.css'
import { Button } from './components/Button/Button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Grouped Bar Chart App</h1>
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