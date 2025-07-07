import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut } from "lucide-react";

import { useEsp32Store } from "../store/useEsp32Store";

const HomePages = () => {

  const { deviceReading, FetchData, isFetchingData } = useEsp32Store();

  const { logout } = useAuthStore();
  return (
    <div>
      <button className="flex gap-2 items-center" onClick={logout}>
        <LogOut className="size-5" />
        <span className="hidden sm:inline">Logout</span>
      </button>

      
    </div>

    
  );
};

export default HomePages;
