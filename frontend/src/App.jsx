import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [binData, setBinData] = useState(null)
  const [methaneData, setMethaneData] = useState(null)
  const [temperatureData, setTemperatureData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all data concurrently
        const [binResponse, methaneResponse, temperatureResponse] = await Promise.all([
          axios.get('/api/getBinCapacity'),
          axios.get('/api/getMethaneLevel'),
          axios.get('/api/getTemperature') // You'll need to create this endpoint
        ])

        console.log('Bin response:', binResponse.data)
        console.log('Methane response:', methaneResponse.data)
        console.log('Temperature response:', temperatureResponse.data)

        // Set data if responses are successful
        if (binResponse.data.message === "Data retrieved successfully") {
          setBinData(binResponse.data.data)
        }
        if (methaneResponse.data.message === "Data retrieved successfully") {
          setMethaneData(methaneResponse.data.data)
        }
        if (temperatureResponse.data.message === "Data retrieved successfully") {
          setTemperatureData(temperatureResponse.data.data)
        }

        setLoading(false)
      } catch (err) {
        console.log('Error fetching data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  console.log('Bin data:', binData)
  console.log('Methane data:', methaneData)
  console.log('Temperature data:', temperatureData)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <div>
        <h1>Environmental Monitoring Dashboard</h1>
        
        {/* Bin Capacity */}
        <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Bin Capacity</h2>
          {binData ? (
            <h3 style={{ color: binData.percentage > 80 ? 'red' : 'green' }}>
              {binData.percentage}%
            </h3>
          ) : (
            <p>No bin capacity data available</p>
          )}
        </div>

        {/* Methane Level */}
        <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Methane Level</h2>
          {methaneData ? (
            <h3 style={{ color: methaneData.percentage > 50 ? 'red' : 'green' }}>
              {methaneData.percentage}%
            </h3>
          ) : (
            <p>No methane data available</p>
          )}
        </div>

        {/* Temperature */}
        <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Temperature</h2>
          {temperatureData ? (
            <h3 style={{ color: temperatureData.temperature > 30 ? 'red' : 'blue' }}>
              {temperatureData.temperature}°C
            </h3>
          ) : (
            <p>No temperature data available</p>
          )}
        </div>
      </div>
    </>
  )
}

export default App