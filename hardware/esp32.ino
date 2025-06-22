#include <WiFi.h>
#include <FirebaseESP32.h>

// Network and Firebase credentials
#define WIFI_SSID "Cleon WIFI"
#define WIFI_PASSWORD "WILL2530"

#define FIREBASE_AUTH "AIzaSyA2BqkOhIa01-qkV1hGMgrmo2bKfkpahTI"
#define FIREBASE_HOST "https://esp-project-90a46-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Sensor pin definitions
#define TRIG_PIN 12
#define ECHO_PIN 14
#define MQ4_PIN 34

// Define FirebaseESP32 data objects
FirebaseData firebaseData;
FirebaseConfig config;
FirebaseAuth auth;

void setup() {
  Serial.begin(115200);

  // Initialize sensor pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(MQ4_PIN, INPUT);
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Configure Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  
  // Initialize Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase initialized!");
}

float readDistance() {
  // Clear the trigger pin
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  // Send ultrasonic pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Read echo pin and calculate distance
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = (duration * 0.034) / 2; // Convert to cm
  
  return distance;
}

float readMQ4() {
  int sensorValue = analogRead(MQ4_PIN);
  
  // Convert to voltage (ESP32 ADC is 12-bit, 0-4095 for 0-3.3V)
  float voltage = (sensorValue / 4095.0) * 3.3;
  
  // Convert to gas concentration (ppm) - simplified conversion
  // Note: For accurate readings, you should calibrate the sensor
  float gasLevel = sensorValue; // Raw ADC value
  
  return gasLevel;
}

void loop() {
  // Read sensor data
  float distance = readDistance();
  float gasLevel = readMQ4();
  
  Serial.println("Reading sensors...");
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  Serial.print("Gas Level (ADC): ");
  Serial.println(gasLevel);
  
  // Send distance data
  if (Firebase.setFloat(firebaseData, "/sensor_data/distance_cm", distance)) {
    Serial.println("Distance data sent successfully");
  } else {
    Serial.println("Failed to send distance data");
    Serial.println("Error: " + firebaseData.errorReason());
  }
  
  // Send gas level data
  if (Firebase.setFloat(firebaseData, "/sensor_data/gas_level", gasLevel)) {
    Serial.println("Gas level data sent successfully");
  } else {
    Serial.println("Failed to send gas level data");
    Serial.println("Error: " + firebaseData.errorReason());
  }
  
  // Send timestamp
  if (Firebase.setTimestamp(firebaseData, "/sensor_data/last_update")) {
    Serial.println("Timestamp updated successfully");
  } else {
    Serial.println("Failed to update timestamp");
  }
  
  Serial.println("--------------------");
  
  delay(10000);
}