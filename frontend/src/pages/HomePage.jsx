import React from "react";
import { useEsp32Store } from "../store/useEsp32Store";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NoDeviceSelected from "../components/NoDeviceSelected";
import DataContainer from "../components/DataContainer";
import StatusPanel from "../components/StatusPanel"; // ✅ import

const HomePages = () => {
  const { selectedDevice, activePanel } = useEsp32Store();

  const renderRightPanel = () => {
    if (activePanel === "status") return <StatusPanel />;
    if (selectedDevice) return <DataContainer />;
    return <NoDeviceSelected />;
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="flex sm:flex-row gap-4">
        <Sidebar />
        {renderRightPanel()}
      </div>
    </div>
  );
};

export default HomePages;
