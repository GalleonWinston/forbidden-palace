import React from 'react'
import { useEsp32Store } from '../store/useEsp32Store'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Shield, AlertTriangle, CheckCircle, Clock, Scroll } from 'lucide-react'

const DataContainer = () => {
  const { data, isDataLoading, deviceName } = useEsp32Store();

  if (isDataLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-amber-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
        <span className="text-lg">Consulting Imperial Archives...</span>
      </div>
    </div>
  );
  
  if (!data || data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 text-amber-600">
      <Scroll className="h-16 w-16 mb-4 opacity-50" />
      <p className="text-xl">No Imperial Scrolls Found</p>
      <p className="text-amber-500">The sentinel has not yet reported any data</p>
    </div>
  );

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

  // 🔹 Imperial status thresholds
  const getImperialStatus = (gas, value) => {
    if (value == null) return { color: "text-gray-500", status: "No Data", icon: null };

    if (gas === "H2S") {
      if (value < 10) return { color: "text-green-600", status: "Safe", icon: CheckCircle };
      if (value < 20) return { color: "text-yellow-600", status: "Caution", icon: AlertTriangle };
      return { color: "text-red-600", status: "Danger", icon: Shield };
    }

    if (gas === "CH4") {
      if (value < 1000) return { color: "text-green-600", status: "Safe", icon: CheckCircle };
      if (value < 10000) return { color: "text-yellow-600", status: "Caution", icon: AlertTriangle };
      return { color: "text-red-600", status: "Danger", icon: Shield };
    }

    return { color: "text-gray-500", status: "Unknown", icon: null };
  };

  // Custom tooltip with imperial styling
  const ImperialTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-amber-50/95 backdrop-blur-sm p-4 border-2 border-amber-200 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-red-800 font-bold">
            <Clock className="h-4 w-4" />
            {data.fullDate}
          </div>
          {payload.map((entry, index) => {
            const gasType = entry.name.includes('H2S') ? 'H2S' : entry.name.includes('CH4') ? 'CH4' : null;
            const status = gasType ? getImperialStatus(gasType, entry.value) : null;
            const StatusIcon = status?.icon;
            
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="font-semibold text-gray-700">{entry.name}:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{entry.value?.toFixed(2)}</span>
                  {StatusIcon && <StatusIcon className={`h-4 w-4 ${status.color}`} />}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 pr-8 w-full bg-gradient-to-br from-amber-50 to-red-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-red-800" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-800 to-amber-700 bg-clip-text text-transparent">
          {deviceName || "Imperial Sentinel"} Scrolls
        </h2>
      </div>
      
      {/* Imperial Reservoir Levels */}
      <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-amber-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-red-700 rounded"></div>
          Imperial Reservoir Levels
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis 
              dataKey="formattedTime" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ value: 'Fill Level', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<ImperialTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Distance" 
              stroke="#b91c1c" 
              name="Reservoir Level"
              strokeWidth={3}
              dot={{ fill: '#b91c1c', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, fill: '#dc2626' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Palace Air Purity - H2S */}
      <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-amber-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-green-600 rounded"></div>
          Palace Air Purity - H2S
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis 
              dataKey="formattedTime"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ value: 'H2S Level', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<ImperialTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="H2Sgas" 
              stroke="#16a34a" 
              name="H2S Air Purity"
              strokeWidth={3}
              dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, fill: '#22c55e' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Imperial Atmosphere - CH4 */}
      <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-amber-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-amber-500 rounded"></div>
          Imperial Atmosphere - CH4
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis 
              dataKey="formattedTime"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ value: 'CH4 Level', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<ImperialTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="CH4gas" 
              stroke="#d97706" 
              name="CH4 Atmosphere"
              strokeWidth={3}
              dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Imperial Scrolls Table */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-amber-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Scroll className="h-6 w-6 text-red-700" />
          Recent Imperial Scrolls
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-amber-50/50 border-2 border-amber-200 rounded-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-red-700 to-red-800">
              <tr>
                <th className="px-4 py-3 text-left text-amber-100 font-semibold">Imperial Hour</th>
                <th className="px-4 py-3 text-left text-amber-100 font-semibold">Reservoir (cm)</th>
                <th className="px-4 py-3 text-left text-amber-100 font-semibold">H2S Status</th>
                <th className="px-4 py-3 text-left text-amber-100 font-semibold">CH4 Status</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.slice(-10).reverse().map((item, index) => {
                const h2sStatus = getImperialStatus("H2S", item.H2Sgas);
                const ch4Status = getImperialStatus("CH4", item.CH4gas);
                const H2SIcon = h2sStatus.icon;
                const CH4Icon = ch4Status.icon;

                return (
                  <tr key={index} className="border-t border-amber-200 hover:bg-amber-100/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{item.fullDate}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                      {item.Distance?.toFixed(2) ?? '--'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {H2SIcon && <H2SIcon className={`h-4 w-4 ${h2sStatus.color}`} />}
                        <span className={h2sStatus.color}>
                          {item.H2Sgas?.toFixed(0) ?? '--'} 
                          <span className="text-xs ml-1 opacity-75">({h2sStatus.status})</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {CH4Icon && <CH4Icon className={`h-4 w-4 ${ch4Status.color}`} />}
                        <span className={ch4Status.color}>
                          {item.CH4gas?.toFixed(0) ?? '--'}
                          <span className="text-xs ml-1 opacity-75">({ch4Status.status})</span>
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataContainer;