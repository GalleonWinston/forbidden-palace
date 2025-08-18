import React from 'react'
import { useEsp32Store } from '../store/useEsp32Store'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DataContainer = () => {
  const { data, isDataLoading, selectedDevice, deviceName } = useEsp32Store();

  if (isDataLoading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>No data found.</div>;

  // Format the data with readable timestamps
  const formattedData = data.map(item => ({
    ...item,
    formattedTime: new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    fullDate: new Date(item.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }));

  // Custom tooltip to show full date/time
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.fullDate}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
              {entry.name === 'Distance' ? ' cm' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{deviceName} data</h2>
      
      {/* Distance Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Distance Sensor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="formattedTime" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ value: 'Distance (cm)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Distance" 
              stroke="#8884d8" 
              name="Distance (cm)"
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* H2Gas Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">H2S Gas Sensor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="formattedTime"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ value: 'H2S Gas Level (ADC)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="H2SGas" 
              stroke="#82ca9d" 
              name="H2S Gas Level"
              strokeWidth={2}
              dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CH4Gas Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">CH4 Gas Sensor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="formattedTime"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ value: 'CH4 Gas Level (ADC)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="CH4gas" 
              stroke="#ffb347" 
              name="CH4 Gas Level"
              strokeWidth={2}
              dot={{ fill: '#ffb347', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Recent Readings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Time</th>
                <th className="px-4 py-2 text-left text-gray-600">Distance (cm)</th>
                <th className="px-4 py-2 text-left text-gray-600">H2S Gas Level</th>
                <th className="px-4 py-2 text-left text-gray-600">CH4 Gas Level</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.slice(-10).reverse().map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{item.fullDate}</td>
                  <td className="px-4 py-2 text-sm">{item.Distance?.toFixed(2) ?? item.distance?.toFixed(2) ?? ''}</td>
                  <td className="px-4 py-2 text-sm">{item.H2SGas?.toFixed(0) ?? item.H2Sgas?.toFixed(0) ?? ''}</td>
                  <td className="px-4 py-2 text-sm">{item.CH4Gas?.toFixed(0) ?? item.CH4gas?.toFixed(0) ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataContainer