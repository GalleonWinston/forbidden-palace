import React, { useEffect, useState } from "react";
import { useEsp32Store } from "../store/useEsp32Store";
import NoDeviceFound from "./NoDeviceFound";
import { Pencil, Trash2, Copy, Plus, Shield, Scroll, Castle } from "lucide-react";

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
    <div className="bg-gradient-to-b from-amber-50 to-red-50 p-4 min-h-screen border-r-2 border-amber-200">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-red-800" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-red-800 to-amber-700 bg-clip-text text-transparent">
          Imperial Sentinels
        </h2>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <button
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-700 to-red-800 text-amber-50 rounded-lg hover:from-red-800 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border border-amber-200"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5" />
          Summon Sentinel
        </button>

        <button
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-amber-50 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border border-amber-300"
          onClick={() => setActivePanel("status")}
        >
          <Scroll className="h-5 w-5" />
          Imperial Scrolls
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateDevice}
          className="mb-6 flex flex-col gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-amber-200"
        >
          <input
            type="text"
            className="border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-amber-50/50"
            placeholder="Bestow a name upon your sentinel"
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-red-700 text-amber-50 px-4 py-2 rounded-lg hover:bg-red-800 transition-colors font-semibold border border-amber-200"
            >
              <Castle className="h-4 w-4" />
              Conjure
            </button>
            <button
              type="button"
              className="flex-1 bg-amber-500 text-amber-50 px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-semibold border border-amber-300"
              onClick={() => setShowForm(false)}
            >
              Dismiss
            </button>
          </div>
        </form>
      )}

      {isDevicesLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-amber-700">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700"></div>
          <span>Consulting the Imperial Archives...</span>
        </div>
      ) : devices.length === 0 ? (
        <NoDeviceFound />
      ) : (
        <div className="flex flex-col gap-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="p-4 rounded-xl shadow-lg bg-white/80 backdrop-blur-sm border border-amber-200 hover:border-amber-300 transition-all duration-300"
            >
              <button
                className="text-left w-full hover:bg-amber-100/50 transition-colors rounded-lg px-3 py-2 mb-2 border border-transparent hover:border-amber-200"
                onClick={() => handleSelectDevice(device.id, device.deviceName)}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-700" />
                  <span className="font-semibold text-gray-800">{device.deviceName}</span>
                </div>
              </button>

              {/* Device ID with copy button */}
              <div className="flex items-center gap-2 bg-amber-50/50 rounded-lg px-3 py-2 mb-3 border border-amber-200">
                <span className="text-xs font-mono text-gray-600 flex-1 truncate">{device.id}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(device.id);
                  }}
                  className="p-1 bg-amber-200 text-red-800 rounded hover:bg-amber-300 transition-colors shadow hover:scale-105"
                  title="Copy Imperial Seal"
                >
                  <Copy size={14} />
                </button>
              </div>

              {editingId === device.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-amber-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 bg-amber-50/50"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    placeholder="Bestow new name"
                  />
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 flex items-center gap-1 transition-colors text-sm"
                    onClick={() => handleRenameDevice(device.id)}
                  >
                    <Pencil size={14} />
                    Seal
                  </button>
                  <button
                    className="bg-amber-500 text-white px-2 py-1 rounded-lg hover:bg-amber-600 transition-colors text-sm"
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
                    className="flex-1 bg-amber-500 text-white px-2 py-1 rounded-lg hover:bg-amber-600 flex items-center justify-center gap-1 transition-colors text-sm"
                    onClick={() => {
                      setEditingId(device.id);
                      setRenameValue(device.deviceName);
                    }}
                  >
                    <Pencil size={14} />
                    Rename
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 transition-colors text-sm"
                    onClick={() => setConfirmDeleteId(device.id)}
                  >
                    <Trash2 size={14} />
                    Banish
                  </button>
                </div>
              )}

              {/* Pop-up for delete confirmation */}
              {confirmDeleteId === device.id && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-4 min-w-[300px] border-2 border-amber-200">
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                      <Trash2 size={20} />
                      Imperial Decree
                    </div>
                    <p className="text-gray-700">
                      Banish the sentinel{" "}
                      <span className="font-semibold text-red-700">{device.deviceName}</span>
                      ? This action cannot be undone.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        className="bg-red-700 text-amber-50 px-4 py-2 rounded-lg hover:bg-red-800 flex items-center gap-1 transition-colors font-semibold border border-amber-200"
                        onClick={() => handleDeleteDevice(device.id)}
                      >
                        <Trash2 size={16} />
                        Banish Forever
                      </button>
                      <button
                        className="bg-amber-500 text-amber-50 px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-semibold border border-amber-300"
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