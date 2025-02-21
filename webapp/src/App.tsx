import { ChangeEvent, useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [numDials, setNumDials] = useState<number>(0);
  const [dialValues, setDialValues] = useState<number[]>([]);
  const [result, setResult] = useState<string | number[] | null>(null);
  const [lines, setLines] = useState<JSX.Element[]>([]);
  const [startCircle, setStartCircle] = useState<JSX.Element | null>(null);

  const url: string = "http://127.0.0.1:5000"

  const handleNumDialsChange = (e : ChangeEvent<HTMLInputElement>) => {
    const value: number = parseInt(e.target.value, 10) || 0;
    setNumDials(value);
    setDialValues(new Array(value).fill(0));
  };

  const handleDialValueChange = (index: number, value: string) => {
    const newDialValues: number[] = [...dialValues];
    newDialValues[index] = parseInt(value, 10) || 0;
    setDialValues(newDialValues);
  }

  const handleSolve = async (): Promise<void> => {
    try {
      const response = await axios.post<{ result: string | number[] }>(url+"/solve", {dials: dialValues})
      setResult(response.data.result);
    } catch (error) {
      console.error("Error solving path:", error);
      setResult("Error: Unable to calculate the path.");
    }
  }

  const radius: number = 200;
  const centerX: number = 250;
  const centerY: number = 250;
  const circle_radius: number = 25;

  const dialPositions = Array.from({ length: numDials }, (_, index) => {
    const angle = (360 / numDials) * index;
    return {
      x: centerX + radius * Math.cos((angle - 90) * (Math.PI / 180)),
      y: centerY + radius * Math.sin((angle - 90) * (Math.PI / 180)),
    }
  });

  useEffect(() => {
    setLines([]);
    setStartCircle(null);
  }, [numDials]);

  useEffect(() => {
    if (result && result.length > 1) {
      const newLines = [];
          for (let i = 0; i < result.length - 1; i++) {
            const start = dialPositions[result[i] as number];
            const end = dialPositions[result[i + 1] as number];

            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const angle = Math.atan2(dy, dx);
            const arrowSize = 10;

            const distance = Math.sqrt(dx * dx + dy * dy);
            const adjustedDistance = distance - circle_radius;

            const newEndX = start.x + (adjustedDistance * Math.cos(angle));
            const newEndY = start.y + (adjustedDistance * Math.sin(angle));

            newLines.push(
              <g key={i}>
                <line
                  x1={start.x} y1={start.y} x2={newEndX} y2={newEndY}
                  stroke="red" strokeWidth="2"
                />
                <polygon
                  points={`
                    ${newEndX - arrowSize * Math.cos(angle - Math.PI / 6)},
                    ${newEndY - arrowSize * Math.sin(angle - Math.PI / 6)}
                    ${newEndX},${newEndY}
                    ${newEndX - arrowSize * Math.cos(angle + Math.PI / 6)},
                    ${newEndY - arrowSize * Math.sin(angle + Math.PI / 6)}
                  `}
                  fill="red"
                />
              </g>
            );
          }
        setLines(newLines);

        if (result && result.length > 0) {
          const startPos = dialPositions[result[0] as number];
          setStartCircle(
            <circle cx={startPos.x} cy={startPos.y} r={circle_radius + 5} fill='none' stroke='white'/>
          )
        }
    }
  }, [result])

  return (
    <>
      <div className='flex flex-col items-center p-4'>
        <h1 className='text-2xl font-bold mb-4'>FFXIII-2 Clock Solver</h1>
      
      {/* Input for number of dials */}
      <div className='mb-4'>
        <label htmlFor='numDials' className='mr-2'>Number of dials:</label>
        <input
        id="numDials"
        type='number'
        min="1"
        className='border rounded p-2'
        value={numDials}
        onChange={handleNumDialsChange}
        />
      </div>

      <svg width={500} height={500} className='mb-4'>
        {lines}
        {startCircle}
        
        {dialPositions.map((pos, index) => (
          <g key={index}>
            <circle cx={pos.x} cy={pos.y} r={circle_radius} fill="black" />
            <foreignObject x={pos.x -13} y={pos.y -15} width="30" height="20">
            <input
              
              type='number'
              className='white-number-input'
              value={dialValues[index] || 0}
              onChange={(e) => handleDialValueChange(index, e.target.value)}
              min={0}
              step={1}
            />
            </foreignObject>
          </g>
        ))}
      </svg>

      <div className='relative w-96 h-96 mb-4'>
      </div>

      {/* Solve Button */}
      <button
        className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue 600 mb-4'
        onClick={handleSolve}
      >
        Solve
      </button>
      </div>
    </>
  )
}

export default App
