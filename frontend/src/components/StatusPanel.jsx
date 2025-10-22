import React, { useEffect } from "react";
import { useEsp32Store } from "../store/useEsp32Store";
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, Cloud, Wind } from "lucide-react";

const StatusPanel = () => {
  const { devices, getDataForDevice, statusReadings, setStatusReadings, isDevicesLoading } = useEsp32Store();

  // Helper function to decide status and color
  const getImperialStatus = (gas, value) => {
    if (value == null) return { 
      color: "text-gray-500", 
      status: "No Data", 
      icon: Eye,
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300"
    };

    if (gas === "H2S") {
      if (value < 10) return { 
        color: "text-green-600", 
        status: "Pure Air", 
        icon: CheckCircle,
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
      if (value < 20) return { 
        color: "text-yellow-600", 
        status: "Caution", 
        icon: AlertTriangle,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
      };
      return { 
        color: "text-red-600", 
        status: "Danger", 
        icon: Shield,
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      };
    }

    if (gas === "CH4") {
      if (value < 1000) return { 
        color: "text-green-600", 
        status: "Clear Skies", 
        icon: CheckCircle,
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
      if (value < 2000) return { 
        color: "text-yellow-600", 
        status: "Haze", 
        icon: AlertTriangle,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
      };
      return { 
        color: "text-red-600", 
        status: "Foul Air", 
        icon: Shield,
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      };
    }

    return { 
      color: "text-gray-500", 
      status: "Unknown", 
      icon: Eye,
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300"
    };
  };

  useEffect(() => {
    if (devices.length > 0) {
      devices.forEach(async (device) => {
        const readings = await getDataForDevice(device.id, 1);
        if (readings.length > 0) {
          setStatusReadings(device.id, readings[0]);
        }
      });
    }
  }, [devices]);

  if (isDevicesLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-amber-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
        <span className="text-lg">Gathering Imperial Reports...</span>
      </div>
    </div>
  );
  
  if (!devices || devices.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 text-amber-600">
      <Shield className="h-16 w-16 mb-4 opacity-50" />
      <p className="text-xl">No Imperial Sentinels Found</p>
      <p className="text-amber-500">Summon sentinels to begin monitoring</p>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-red-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-red-800" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-800 to-amber-700 bg-clip-text text-transparent">
          Imperial Watchtower
        </h2>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-amber-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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

            const h2sStatus = getImperialStatus("H2S", reading.H2Sgas);
            const ch4Status = getImperialStatus("CH4", reading.CH4gas);
            const H2SIcon = h2sStatus.icon;
            const CH4Icon = ch4Status.icon;

            return (
              <div 
                key={device.id} 
                className="border-2 border-amber-200 rounded-xl p-4 bg-gradient-to-br from-amber-50 to-white hover:shadow-lg transition-all duration-300"
              >
                {/* Sentinel Header */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-200">
                  <Shield className="h-5 w-5 text-red-700" />
                  <h3 className="font-bold text-lg text-gray-800">{device.deviceName}</h3>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formattedTime}</span>
                </div>

                {/* Reservoir Level */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Reservoir Level</span>
                    <span className="text-sm font-bold text-red-700">
                      {reading.Distance?.toFixed(2) ?? "--"} cm
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div 
                      className="bg-red-700 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((reading.Distance || 0) / 100 * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* H2S Status */}
                <div className={`flex items-center justify-between p-2 rounded-lg mb-2 ${h2sStatus.bgColor} ${h2sStatus.borderColor} border`}>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Air Purity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${h2sStatus.color}`}>
                      {reading.H2Sgas?.toFixed(0) ?? "--"}
                    </span>
                    <H2SIcon className={`h-4 w-4 ${h2sStatus.color}`} />
                  </div>
                </div>

                {/* CH4 Status */}
                <div className={`flex items-center justify-between p-2 rounded-lg ${ch4Status.bgColor} ${ch4Status.borderColor} border`}>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Atmosphere</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${ch4Status.color}`}>
                      {reading.CH4gas?.toFixed(0) ?? "--"}
                    </span>
                    <CH4Icon className={`h-4 w-4 ${ch4Status.color}`} />
                  </div>
                </div>

                {/* Status Summary */}
                <div className="mt-3 pt-2 border-t border-amber-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">H2S: {h2sStatus.status}</span>
                    <span className="text-gray-600">CH4: {ch4Status.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-amber-200">
          <h4 className="font-semibold text-gray-700 mb-2">Imperial Status Codes:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-700">All Clear - Conditions Normal</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-700">Caution - Monitor Closely</span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-200">
              <Shield className="h-4 w-4 text-red-600" />
              <span className="text-red-700">Danger - Immediate Attention Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;