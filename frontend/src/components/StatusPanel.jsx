import React, { useEffect } from "react";
import { useEsp32Store } from "../store/useEsp32Store";

const StatusPanel = () => {
  const { devices, getDataForDevice, statusReadings, setStatusReadings, isDevicesLoading } = useEsp32Store();

useEffect(() => {
  if (devices.length > 0) {
    devices.forEach(async (device) => {
      const readings = await getDataForDevice(device.id, 1); // correct: "id" is from backend
      if (readings.length > 0) {
        setStatusReadings(device.id, readings[0]);
      }
    });
  }
}, [devices]);

  useEffect(() => {
    if (devices.length > 0) {
      // For each device, fetch the latest data
      devices.forEach(async (device) => {
        const readings = await getDataForDevice(device.id, 1); // fetch only the last 1 reading
        if (readings && readings.length > 0) {
          setStatusReadings(device.id, readings[0]);
        }
      });
    }
  }, [devices]);

  if (isDevicesLoading) return <div>Loading devices...</div>;
  if (!devices || devices.length === 0) return <div>No devices found.</div>;

  return (
    <div className="p-6 bg-white shadow rounded w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Device Status Panel</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Device Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Time</th>
              <th className="px-4 py-2 text-left text-gray-600">Distance (cm)</th>
              <th className="px-4 py-2 text-left text-gray-600">H2S Gas</th>
              <th className="px-4 py-2 text-left text-gray-600">CH4 Gas</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => {
              const reading = statusReadings[device.id];
              if (!reading) return null;

              const formattedTime = new Date(reading.timestamp).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              return (
                <tr key={device.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-semibold">{device.deviceName}</td>
                  <td className="px-4 py-2 text-sm">{formattedTime}</td>
                  <td className="px-4 py-2 text-sm">{reading.Distance?.toFixed(2) ?? ""}</td>
                  <td className="px-4 py-2 text-sm">{reading.H2Sgas?.toFixed(0) ?? ""}</td>
                  <td className="px-4 py-2 text-sm">{reading.CH4gas?.toFixed(0) ?? ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusPanel;
