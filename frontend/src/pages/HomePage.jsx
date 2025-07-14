import React from "react";
import { useEsp32Store } from "../store/useEsp32Store";


import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NoDeviceSelected from "../components/NoDeviceSelected";
import DataContainer from "../components/DataContainer";

const HomePages = () => {

  const { selectedDevice } = useEsp32Store();
  return (
    <div>

      <div>
        <Navbar />
      </div>
      <div className="flex sm:flex-row gap-4">
        <Sidebar />
        {!selectedDevice ? <NoDeviceSelected /> : <DataContainer />}
      </div>

    </div>
  );
};

export default HomePages;
