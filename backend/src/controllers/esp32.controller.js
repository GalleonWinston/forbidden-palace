const { db } = require("../library/db");
const admin = require("firebase-admin");

// this function will be deleted because we cannot allowed the user to create their own devices
const createEsp32 = async (req, res) => {
  try {
    const { deviceName } = req.body;
    const userId = req.user.userId;

    if (!userId || !deviceName) {
      throw new Error("userId and deviceName are required");
    }

    // Create a new device reference under the user's devices
    const deviceRef = db.ref(`users/${userId}/devices`).push();
    const deviceId = deviceRef.key;

    await deviceRef.set({
      deviceName,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    });

    res.status(201).json({
      success: true,
      deviceId: deviceRef.key,
      message: "device created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDevices = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const snapshot = await db.ref(`users/${userId}/devices`).once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "No devices found" });
    }

    const devicesObj = snapshot.val() || {};
    const devices = Object.entries(devicesObj).map(([id, data]) => ({
      id,
      deviceName: data.deviceName,
      createdAt: data.createdAt,
    }));

    res.status(200).json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: error.message });
  }
}

const getDeviceReadings = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.userId;

    if (!userId || !deviceId) {
      return res
        .status(400)
        .json({ message: "userId and deviceId are required" });
    }

    const snapshot = await db
      .ref(`users/${userId}/devices/${deviceId}/readings`)
      .once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "No readings found" });
    }
    const readingsObj = snapshot.val() || {};
    const readings = Object.entries(readingsObj).map(([id, data]) => ({
      id,
      ...data,
    }));

    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { createEsp32, getDevices, getDeviceReadings };
