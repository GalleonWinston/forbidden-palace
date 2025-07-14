#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>
#include <FirebaseESP32.h>

// Firebase credentials
#define FIREBASE_AUTH "yDAA23xOH19qUredZIYkyRzuEK4UCROedOimK5tF"
#define FIREBASE_HOST "https://express-app-a357f-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Sensor pin definitions
#define TRIG_PIN 12
#define ECHO_PIN 14
#define MQ4_PIN 34

// Configuration button pin
const int CONFIG_BUTTON_PIN = 0; // GPIO0 (BOOT button)
bool config_mode_triggered = false;

#define MAX_READINGS 60  // Store up to 60 readings (1 per minute)
#define UPDATE_INTERVAL 300000 // 300 seconds (5 minute)

unsigned long lastUpdateTime = 0;
int readingIndex = 0;

// Create web server on port 80
WebServer server(80);
Preferences preferences;

// Define FirebaseESP32 data objects
FirebaseData firebaseData;
FirebaseConfig config;
FirebaseAuth auth;

// Variables to store WiFi credentials
String stored_ssid = "";
String stored_password = "";

// Variables to store user configuration
String user_id = "";
String device_id = "";

// System state
bool firebase_initialized = false;
bool sensors_active = false;

// HTML for the configuration page
const char* configPage = R"(
<!DOCTYPE html>
<html>
<head>
    <title>ESP32 Sensor System Setup</title>
    <style>
        body { font-family: Arial; margin: 40px; background: #f0f0f0; }
        .container { background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto; }
        h1 { color: #333; text-align: center; }
        .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
        .section h3 { margin-top: 0; color: #495057; }
        input[type="text"], input[type="password"] { 
            width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box;
        }
        input[type="submit"] { 
            background: #007bff; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; width: 100%;
        }
        input[type="submit"]:hover { background: #0056b3; }
        .status { margin: 15px 0; padding: 10px; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        .sensor-info { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; margin-top: 20px; }
        .help-text { font-size: 0.9em; color: #6c757d; margin-top: 5px; }
        .preview { background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 0.9em; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>ESP32 Sensor System</h1>
        <div class="status info">
            <strong>Current Status:</strong> Configuration Mode<br>
            <strong>Device IP:</strong> 192.168.4.1
        </div>
        <div class="sensor-info">
            <strong>Connected Sensors:</strong><br>
            Ultrasonic Distance Sensor (HC-SR04)<br>
            Gas Sensor (MQ4)<br>
            Firebase Cloud Database
        </div>
        
        <form action="/save" method="POST">
            <div class="section">
                <h3>WiFi Configuration</h3>
                <label for="ssid">WiFi Network Name (SSID):</label>
                <input type="text" id="ssid" name="ssid" placeholder="Enter WiFi SSID" required>
                
                <label for="password">WiFi Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter WiFi Password" required>
            </div>
            
            <div class="section">
                <h3>🔧 Device Configuration</h3>
                <label for="user_id">User ID:</label>
                <input type="text" id="user_id" name="user_id" placeholder="e.g., john_smith_home" required 
                       pattern="[a-zA-Z0-9_-]+" title="Only letters, numbers, underscores and hyphens allowed">
                <div class="help-text">Unique identifier for your account (letters, numbers, _, - only)</div>
                
                <label for="device_id">Device ID:</label>
                <input type="text" id="device_id" name="device_id" placeholder="e.g., living_room_sensors" required
                       pattern="[a-zA-Z0-9_-]+" title="Only letters, numbers, underscores and hyphens allowed">
                <div class="help-text">Unique identifier for this sensor device (letters, numbers, _, - only)</div>
                
                <div class="preview">
                    <strong>Firebase Path Preview:</strong><br>
                    users/<span id="preview_user">your_user_id</span>/<span id="preview_device">your_device_id</span>/
                </div>
            </div>
            
            <input type="submit" value="Connect & Start Monitoring">
        </form>
        
        <div style="margin-top: 20px; text-align: center;">
            <a href="/scan" style="color: #007bff; text-decoration: none;">Scan for Networks</a> | 
            <a href="/reset" style="color: #dc3545; text-decoration: none;">Reset Settings</a>
        </div>
    </div>
    
    <script>
        // Update preview in real-time
        document.getElementById('user_id').addEventListener('input', function() {
            document.getElementById('preview_user').textContent = this.value || 'your_user_id';
        });
        
        document.getElementById('device_id').addEventListener('input', function() {
            document.getElementById('preview_device').textContent = this.value || 'your_device_id';
        });
    </script>
</body>
</html>
)";

const char* successPage = R"(
<!DOCTYPE html>
<html>
<head>
    <title>ESP32 Sensor System - Connecting</title>
    <style>
        body { font-family: Arial; margin: 40px; background: #f0f0f0; }
        .container { background: white; padding: 30px; border-radius: 10px; max-width: 400px; margin: auto; text-align: center; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .loading { display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .config-summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; text-align: left; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Starting Sensor System!</h1>
        <div class="success">
            <div class="loading"></div><br><br>
            Connecting to WiFi and initializing sensors...<br>
            <strong>Please wait while we set everything up.</strong>
        </div>
        <div class="config-summary" id="config-info">
            <strong>Configuration Summary:</strong><br>
            <span id="config-details">Loading configuration...</span>
        </div>
        <div id="status">Establishing connection...</div>
    </div>
    
    <script>
        let attempts = 0;
        const maxAttempts = 30;
        
        function checkConnection() {
            attempts++;
            document.getElementById('status').innerHTML = `Setting up system... (${attempts}/${maxAttempts})`;
            
            fetch('/status')
                .then(response => response.json())
                .then(data => {
                    // Update configuration display
                    if (data.user_id && data.device_id) {
                        document.getElementById('config-details').innerHTML = 
                            `User ID: ${data.user_id}<br>Device ID: ${data.device_id}<br>Firebase Path: users/${data.user_id}/${data.device_id}/`;
                    }
                    
                    if (data.connected && data.ip && data.firebase_ready) {
                        document.getElementById('status').innerHTML = `System Ready! Redirecting to http://${data.ip}`;
                        setTimeout(() => {
                            window.location.href = `http://${data.ip}`;
                        }, 2000);
                    } else if (attempts < maxAttempts) {
                        setTimeout(checkConnection, 1000);
                    } else {
                        document.getElementById('status').innerHTML = 'Setup timeout. Please check your network.';
                    }
                })
                .catch(error => {
                    if (attempts < maxAttempts) {
                        setTimeout(checkConnection, 1000);
                    } else {
                        document.getElementById('status').innerHTML = 'Unable to connect. Please check settings.';
                    }
                });
        }
        
        setTimeout(checkConnection, 3000);
    </script>
</body>
</html>
)";

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("Starting ESP32 Sensor System with WiFi Manager...");
    
    // Initialize sensor pins
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(MQ4_PIN, INPUT);
    Serial.println("Sensors initialized");
    
    // Initialize configuration button
    pinMode(CONFIG_BUTTON_PIN, INPUT_PULLUP);
    
    // Check if config button is pressed during startup
    if (digitalRead(CONFIG_BUTTON_PIN) == LOW) {
        Serial.println("Configuration button pressed - entering config mode");
        config_mode_triggered = true;
    }
    
    // Initialize preferences
    preferences.begin("wifi-config", false);
    
    // Try to load saved credentials and configuration
    stored_ssid = preferences.getString("ssid", "");
    stored_password = preferences.getString("password", "");
    user_id = preferences.getString("user_id", "");
    device_id = preferences.getString("device_id", "");
    
    // Check if all required configuration is available
    bool config_complete = (stored_ssid.length() > 0 && user_id.length() > 0 && device_id.length() > 0);
    
    // Try connecting to saved WiFi first (unless config mode triggered or config incomplete)
    if (config_complete && !config_mode_triggered) {
        Serial.println("Attempting to connect to saved WiFi: " + stored_ssid);
        Serial.println("User ID: " + user_id);
        Serial.println("Device ID: " + device_id);
        
        WiFi.mode(WIFI_STA);
        WiFi.begin(stored_ssid.c_str(), stored_password.c_str());
        
        // Wait for connection (timeout after 10 seconds)
        int attempts = 0;
        while (WiFi.status() != WL_CONNECTED && attempts < 20) {
            delay(500);
            Serial.print(".");
            attempts++;
        }
        
        if (WiFi.status() == WL_CONNECTED) {
            Serial.println("\nWiFi Connected!");
            Serial.print("IP address: ");
            Serial.println(WiFi.localIP());
            
            // Initialize Firebase
            initializeFirebase();
            
            // Start connected web server
            startConnectedWebServer();
            
            // Enable sensors
            sensors_active = true;
            Serial.println("Sensor monitoring started!");
            return;
        } else {
            Serial.println("\nFailed to connect to saved WiFi. Starting configuration mode...");
        }
    } else if (config_mode_triggered) {
        Serial.println("Entering configuration mode due to button press...");
    } else {
        Serial.println("Configuration incomplete. Starting configuration mode...");
    }
    
    // Start Access Point mode for configuration
    startConfigMode();
}

void initializeFirebase() {
    // Configure Firebase
    config.host = FIREBASE_HOST;
    config.signer.tokens.legacy_token = FIREBASE_AUTH;
    
    // Initialize Firebase
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
    
    firebase_initialized = true;
    Serial.println("Firebase initialized!");
}

void startConnectedWebServer() {
    server.on("/", []() {
        String html = "<!DOCTYPE html><html><head><title>ESP32 Sensor Dashboard</title>";
        html += "<style>body{font-family:Arial;margin:40px;background:#f0f0f0;}";
        html += ".container{background:white;padding:30px;border-radius:10px;max-width:700px;margin:auto;}";
        html += ".status{margin:15px 0;padding:10px;border-radius:5px;}";
        html += ".connected{background:#d4edda;color:#155724;border:1px solid #c3e6cb;}";
        html += ".sensor{background:#f8f9fa;margin:10px 0;padding:15px;border-radius:5px;border-left:4px solid #007bff;}";
        html += ".config-info{background:#fff3cd;color:#856404;border:1px solid #ffeaa7;margin:15px 0;padding:10px;border-radius:5px;}";
        html += "a{display:inline-block;background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;margin:5px;}";
        html += "a:hover{background:#0056b3;} .refresh{background:#28a745;} .refresh:hover{background:#1e7e34;}";
        html += ".path{font-family:monospace;background:#e9ecef;padding:5px;border-radius:3px;}";
        html += "</style><meta http-equiv='refresh' content='30'></head><body>";
        html += "<div class='container'><h1>🌡️ ESP32 Sensor Dashboard</h1>";
        html += "<div class='status connected'><strong>Status:</strong> Online & Monitoring<br>";
        html += "<strong>Network:</strong> " + WiFi.SSID() + "<br>";
        html += "<strong>IP Address:</strong> " + WiFi.localIP().toString() + "<br>";
        html += "<strong>Firebase:</strong> " + String(firebase_initialized ? "Connected " : "Disconnected ") + "</div>";
        
        // Show device configuration
        html += "<div class='config-info'><strong> Device Configuration:</strong><br>";
        html += "User ID: <strong>" + user_id + "</strong><br>";
        html += "Device ID: <strong>" + device_id + "</strong><br>";
        html += "Firebase Path: <span class='path'>users/" + user_id + "/" + device_id + "/</span></div>";
        
        // Show live sensor readings
        if (sensors_active) {
            float distance = readDistance();
            float gasLevel = readMQ4();
            
            html += "<div class='sensor'><strong>Distance Sensor:</strong><br>" + String(distance, 2) + " cm</div>";
            html += "<div class='sensor'><strong>Gas Sensor (MQ4):</strong><br>ADC Value: " + String(gasLevel, 0) + "</div>";
        }
        
        html += "<a href='/' class='refresh'>Refresh Data</a>";
        html += "<a href='/config'> Reconfigure</a>";
        html += "<a href='/restart'>⚡ Restart Device</a>";
        html += "<br><small> Data updates every 10 seconds to Firebase</small>";
        html += "</div></body></html>";
        server.send(200, "text/html", html);
    });
    
    server.on("/config", []() {
        server.send(200, "text/html", configPage);
    });
    
    server.on("/save", HTTP_POST, handleSave);
    server.on("/scan", handleScan);
    server.on("/reset", handleReset);
    server.on("/status", handleStatus);
    
    server.on("/restart", []() {
        server.send(200, "text/html", 
            "<html><body style='font-family:Arial;text-align:center;margin-top:50px;'>"
            "<h1>Restarting Sensor System...</h1><p>Device will restart in 3 seconds</p></body></html>");
        delay(3000);
        ESP.restart();
    });
    
    server.begin();
    Serial.println("Web dashboard started");
}

void startConfigMode() {
    WiFi.disconnect();
    delay(100);
    
    Serial.println("Starting Access Point for configuration...");
    WiFi.mode(WIFI_AP);
    WiFi.softAP("ESP32-Sensors", "12345678");
    
    IPAddress IP = WiFi.softAPIP();
    Serial.print("Access Point IP address: ");
    Serial.println(IP);
    Serial.println("Connect to 'ESP32-Sensors' network and go to 192.168.4.1");
    
    server.on("/", handleRoot);
    server.on("/save", HTTP_POST, handleSave);
    server.on("/scan", handleScan);
    server.on("/reset", handleReset);
    server.on("/status", handleStatus);
    server.onNotFound(handleRoot);
    
    server.begin();
    Serial.println("Configuration web server started");
}

void attemptWiFiConnection(String ssid, String password) {
    Serial.println("Attempting to connect to: " + ssid);
    WiFi.mode(WIFI_AP_STA);
    WiFi.begin(ssid.c_str(), password.c_str());
}

void handleRoot() {
    server.send(200, "text/html", configPage);
}

void handleSave() {
    String ssid = server.arg("ssid");
    String password = server.arg("password");
    String new_user_id = server.arg("user_id");
    String new_device_id = server.arg("device_id");
    
    if (ssid.length() > 0 && new_user_id.length() > 0 && new_device_id.length() > 0) {
        preferences.putString("ssid", ssid);
        preferences.putString("password", password);
        preferences.putString("user_id", new_user_id);
        preferences.putString("device_id", new_device_id);
        
        // Update global variables
        user_id = new_user_id;
        device_id = new_device_id;
        
        Serial.println("Configuration saved:");
        Serial.println("SSID: " + ssid);
        Serial.println("Password: [HIDDEN]");
        Serial.println("User ID: " + user_id);
        Serial.println("Device ID: " + device_id);
        
        server.send(200, "text/html", successPage);
        
        delay(1000);
        attemptWiFiConnection(ssid, password);
    } else {
        server.send(400, "text/html", "<h1>Error: All fields are required!</h1><a href='/'>Go Back</a>");
    }
}

void handleStatus() {
    String json = "{";
    json += "\"connected\":" + String(WiFi.status() == WL_CONNECTED ? "true" : "false") + ",";
    json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
    json += "\"ssid\":\"" + WiFi.SSID() + "\",";
    json += "\"rssi\":" + String(WiFi.RSSI()) + ",";
    json += "\"firebase_ready\":" + String(firebase_initialized ? "true" : "false") + ",";
    json += "\"sensors_active\":" + String(sensors_active ? "true" : "false") + ",";
    json += "\"user_id\":\"" + user_id + "\",";
    json += "\"device_id\":\"" + device_id + "\"";
    json += "}";
    
    server.send(200, "application/json", json);
}

void handleScan() {
    String html = "<!DOCTYPE html><html><head><title>Available Networks</title>";
    html += "<style>body{font-family:Arial;margin:40px;background:#f0f0f0;}";
    html += ".container{background:white;padding:30px;border-radius:10px;max-width:500px;margin:auto;}";
    html += ".network{padding:10px;margin:5px 0;background:#f8f9fa;border-radius:5px;cursor:pointer;}";
    html += ".network:hover{background:#e9ecef;}</style></head><body>";
    html += "<div class='container'><h1>Available WiFi Networks</h1>";
    
    int n = WiFi.scanNetworks();
    if (n == 0) {
        html += "<p>No networks found</p>";
    } else {
        for (int i = 0; i < n; ++i) {
            html += "<div class='network' onclick='selectNetwork(\"" + WiFi.SSID(i) + "\")'>";
            html += "<strong>" + WiFi.SSID(i) + "</strong> (Signal: " + String(WiFi.RSSI(i)) + " dBm)";
            html += "</div>";
        }
    }
    
    html += "<br><a href='/'>Back to Configuration</a>";
    html += "<script>function selectNetwork(ssid){window.location.href='/?ssid='+encodeURIComponent(ssid);}</script>";
    html += "</div></body></html>";
    
    server.send(200, "text/html", html);
}

void handleReset() {
    preferences.clear();
    Serial.println("All settings cleared!");
    server.send(200, "text/html", 
        "<html><body style='font-family:Arial;text-align:center;margin-top:50px;'>"
        "<h1>Settings Reset!</h1><p>All settings cleared. Device restarting...</p></body></html>");
    delay(3000);
    ESP.restart();
}

float readDistance() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    
    long duration = pulseIn(ECHO_PIN, HIGH);
    float distance = (duration * 0.034) / 2;
    return distance;
}

float readMQ4() {
    int sensorValue = analogRead(MQ4_PIN);
    float gasLevel = sensorValue;
    return gasLevel;
}

void sendSensorData() {
  if (!firebase_initialized || !sensors_active) return;
  
  float distance = readDistance();
  float gasLevel = readMQ4();
  
  Serial.println("📊 Reading sensors...");
  Serial.print("Distance: ");
  Serial.print(distance, 2);
  Serial.println(" cm");
  Serial.print("Gas Level (ADC): ");
  Serial.println(gasLevel, 0);
  
  // Build Firebase path
  String basePath = "users/" + user_id + "/devices/" + device_id + "/readings/";
  
  // Create a JSON object for this reading
  FirebaseJson reading;
  reading.set("distance", distance);
  reading.set("gas", gasLevel);
  
  // Use Firebase server timestamp
  FirebaseJson timestamp;
  timestamp.set(".sv", "timestamp");
  reading.set("timestamp", timestamp);
  
  // Push the reading to the array
  if (Firebase.pushJSON(firebaseData, basePath, reading)) {
    Serial.println("✅ Data sent successfully");
    Serial.println("Path: " + firebaseData.pushName());
  } else {
    Serial.println("❌ Failed to send data");
    Serial.println("Error: " + firebaseData.errorReason());
  }
  
  // Keep only the last MAX_READINGS entries
  if (readingIndex >= MAX_READINGS) {
    String oldestPath = basePath + "0";
    Firebase.deleteNode(firebaseData, oldestPath);
  } else {
    readingIndex++;
  }
  
  Serial.println("--------------------");
}


void loop() {
    server.handleClient();
    
    // Check WiFi status and switch modes if needed
    static unsigned long lastWiFiCheck = 0;
    if (millis() - lastWiFiCheck > 5000) {
        if (WiFi.getMode() == WIFI_AP_STA && WiFi.status() == WL_CONNECTED) {
            Serial.println("✅ WiFi connected successfully!");
            Serial.print("New IP address: ");
            Serial.println(WiFi.localIP());
            
            initializeFirebase();
            WiFi.mode(WIFI_STA);
            delay(1000);
            
            server.stop();
            startConnectedWebServer();
            sensors_active = true;
            Serial.println("🚀 Sensor monitoring activated!");
        }
        lastWiFiCheck = millis();
    }
    
    // Send sensor data every minute when active
    if (sensors_active && millis() - lastUpdateTime > UPDATE_INTERVAL) {
        sendSensorData();
        lastUpdateTime = millis();
    }
    
    delay(10);
}