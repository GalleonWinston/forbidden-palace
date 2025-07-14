import React, { useEffect } from 'react'
import { useEsp32Store } from '../store/useEsp32Store'
import NoDeviceFound from './NoDeviceFound';

const Sidebar = () => {
  const { getDevices, devices, isDevicesLoading, setSelectedDevice, getData, setData, setDeviceName } = useEsp32Store();

  useEffect(() => {
    getDevices();
  }, []);

  const handleSelectDevice = (deviceId, deviceName) => {
    setData([]); // Clear previous data
    setSelectedDevice(deviceId);
    setDeviceName(deviceName);
    getData();
  };

  return (
    <div className='bg-gray-300'>
      <h2 className="text-lg font-bold p-2">Your Devices</h2>
      {isDevicesLoading ? (
        <p>Loading devices...</p>
      ) : devices.length === 0 ? (
        <NoDeviceFound />
      ) : (
        <div className="flex flex-col">
          {devices.map(device => (
            <button
              key={device.id}
              className="p-4 rounded shadow bg-gray-200 text-left hover:bg-blue-200 transition-colors"
              onClick={() => handleSelectDevice(device.id, device.deviceName)}
            >
              <div>{device.deviceName}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Sidebar