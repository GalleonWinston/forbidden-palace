import React, { useEffect } from 'react'
import { useEsp32Store } from '../store/useEsp32Store'
import NoDeviceFound from './NoDeviceFound';

const Sidebar = () => {
  const { getDevices, devices, isDevicesLoading, setSelectedDevice, getData, setData } = useEsp32Store();

  useEffect(() => {
    getDevices();
  }, []);

  const handleSelectDevice = (deviceId) => {
    setData([]); // Clear previous data
    setSelectedDevice(deviceId);
    getData();
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Your Devices</h2>
      {isDevicesLoading ? (
        <p>Loading devices...</p>
      ) : devices.length === 0 ? (
        <NoDeviceFound />
      ) : (
        <div className="flex flex-col w-40 gap-4">
          {devices.map(device => (
            <button
              key={device.id}
              className="border p-4 rounded shadow bg-white text-left hover:bg-blue-100 transition-colors"
              onClick={() => handleSelectDevice(device.id)}
            >
              <div><strong>Name:</strong> {device.deviceName}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Sidebar