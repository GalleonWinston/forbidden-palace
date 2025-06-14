const { db } = require("../library/db")

// ==================== METHANE LEVEL ====================
exports.postMethaneLevel = async (req, res) => {
  try {
    const { methaneLevel } = req.body
    const methaneRef = db.collection('methaneLevel').doc('percentage')
    await methaneRef.set({
      percentage: methaneLevel, // Store the value in percentage field
      timestamp: new Date()
    })
    res.status(200).json({ message: "Methane level sent successfully" })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: "postMethaneLevel Error", error: error.message })
  }
}

exports.getMethaneLevel = async (req, res) => {
  try {
    const methaneRef = db.collection('methaneLevel').doc('percentage')
    const doc = await methaneRef.get()
    
    if (!doc.exists) {
      return res.status(404).json({
        message: "No methane level data found"
      })
    }
    
    const data = doc.data()
    res.status(200).json({
      message: "Data retrieved successfully",
      data: data
    })
  } catch (error) {
    console.error("Error getting methane level:", error)
    res.status(500).json({
      message: "getMethaneLevel Error",
      error: error.message
    })
  }
}

// ==================== BIN CAPACITY ====================
exports.postBinCapacity = async (req, res) => {
  try {
    const { binCapacity } = req.body
    const binRef = db.collection('binCapacity').doc('percentage')
    await binRef.set({
      percentage: binCapacity, // Store the value in percentage field
      timestamp: new Date()
    })
    res.status(200).json({ message: "Bin capacity sent successfully" })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: "postBinCapacity Error", error: error.message })
  }
}

exports.getBinCapacity = async (req, res) => {
  try {
    const binRef = db.collection('binCapacity').doc('percentage')
    const doc = await binRef.get()
    
    if (!doc.exists) {
      return res.status(404).json({
        message: "No bin capacity data found"
      })
    }
    
    const data = doc.data()
    res.status(200).json({
      message: "Data retrieved successfully",
      data: data
    })
  } catch (error) {
    console.error("Error getting bin capacity:", error)
    res.status(500).json({
      message: "getBinCapacity Error", // Fixed the typo here
      error: error.message
    })
  }
}

// ==================== TEMPERATURE ====================
exports.postTemperature = async (req, res) => {
  try {
    const { temperature } = req.body
    const tempRef = db.collection('temperature').doc('current')
    await tempRef.set({
      temperature: temperature, // Store the temperature value
      timestamp: new Date()
    })
    res.status(200).json({ message: "Temperature sent successfully" })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: "postTemperature Error", error: error.message })
  }
}

exports.getTemperature = async (req, res) => {
  try {
    const tempRef = db.collection('temperature').doc('current')
    const doc = await tempRef.get()
    
    if (!doc.exists) {
      return res.status(404).json({
        message: "No temperature data found"
      })
    }
    
    const data = doc.data()
    res.status(200).json({
      message: "Data retrieved successfully",
      data: data
    })
  } catch (error) {
    console.error("Error getting temperature:", error)
    res.status(500).json({
      message: "getTemperature Error",
      error: error.message
    })
  }
}