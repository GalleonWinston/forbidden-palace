const { db } = require('../library/db');
const admin = require("firebase-admin");

const createEsp32 = async(req, res) => {
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

const getDeviceReadings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { deviceId } = req.body; 

    if (!userId || !deviceId) {
      return res.status(400).json({ message: "userId and deviceId are required" });
    }

    const snapshot = await db.ref(`users/${userId}/devices/${deviceId}/readings`).once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "No readings found" });
    }

    const readings = snapshot.val();
    res.status(200).json({ success: true, readings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { createEsp32, getDeviceReadings };