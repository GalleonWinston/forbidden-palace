import React, { useEffect, useState } from "react";
import { useEsp32Store } from "../store/useEsp32Store";
import NoDeviceFound from "./NoDeviceFound";
import { Pencil, Trash2 } from "lucide-react";

const Sidebar = () => {
  const {
    getDevices,
    devices,
    isDevicesLoading,
    setSelectedDevice,
    getData,
    setData,
    setDeviceName,
    createDevice,
    renameDevice,
    deleteDevice,
    setActivePanel,
  } = useEsp32Store();

  const [showForm, setShowForm] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    getDevices();
  }, []);

  const handleSelectDevice = (deviceId, deviceName) => {
    setData([]);
    setSelectedDevice(deviceId);
    setDeviceName(deviceName);
    getData();
  };

  const handleCreateDevice = (e) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;
    createDevice(newDeviceName.trim());
    setNewDeviceName("");
    setShowForm(false);
  };

  const handleRenameDevice = (deviceId) => {
    if (!renameValue.trim()) return;
    renameDevice(deviceId, renameValue.trim());
    setEditingId(null);
    setRenameValue("");
  };

  const handleDeleteDevice = (deviceId) => {
    deleteDevice(deviceId);
    setConfirmDeleteId(null);
  };

  return (
    <div className="bg-gray-300 p-4 min-h-screen">
      <h2 className="text-lg font-bold mb-4">Your Devices</h2>

      <div className="flex flex-col gap-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => setShowForm(true)}
        >
          Add Device
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={() => setActivePanel("status")}
        >
          Open Status Panel
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleCreateDevice}
          className="mb-4 flex flex-col gap-2 bg-white p-4 rounded shadow"
        >
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Device Name"
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 transition-colors"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {isDevicesLoading ? (
        <p>Loading devices...</p>
      ) : devices.length === 0 ? (
        <NoDeviceFound />
      ) : (
        <div className="flex flex-col">
          {devices.map((device) => (
            <div
              key={device.id}
              className="p-4 rounded shadow bg-gray-200 mb-2 flex flex-col gap-2"
            >
              <button
                className="text-left hover:bg-blue-200 transition-colors rounded px-2 py-1"
                onClick={() => handleSelectDevice(device.id, device.deviceName)}
              >
                <div>
                  <span>{device.deviceName}</span>
                </div>
              </button>
              <div>
                <span>{device.id}</span>
              </div>
              {editingId === device.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    placeholder="New name"
                  />
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                    onClick={() => handleRenameDevice(device.id)}
                  >
                    <Pencil size={16} />
                    Save
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => {
                      setEditingId(null);
                      setRenameValue("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                    onClick={() => {
                      setEditingId(device.id);
                      setRenameValue(device.deviceName);
                    }}
                  >
                    <Pencil size={16} />
                    Rename
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                    onClick={() => setConfirmDeleteId(device.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
              {/* Pop-up for delete confirmation */}
              {confirmDeleteId === device.id && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                  <div className="bg-white rounded shadow-lg p-6 flex flex-col gap-4 min-w-[300px]">
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                      <Trash2 size={20} />
                      Confirm Delete
                    </div>
                    <p>
                      Are you sure you want to delete{" "}
                      <span className="font-semibold">{device.deviceName}</span>
                      ?
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-1"
                        onClick={() => handleDeleteDevice(device.id)}
                      >
                        <Trash2 size={16} />
                        Yes, Delete
                      </button>
                      <button
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
