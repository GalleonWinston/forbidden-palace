#include <WiFi.h>
#include <FirebaseESP32.h>

// Network and Firebase credentials
#define WIFI_SSID "windwillknow"
#define WIFI_PASSWORD "yuexin123"

#define FIREBASE_AUTH "AIzaSyA2BqkOhIa01-qkV1hGMgrmo2bKfkpahTI"
#define FIREBASE_HOST "https://esp-project-90a46-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Sensor pin definitions
#define TRIG_PIN 16
#define ECHO_PIN 17
#define MQ4_PIN 34
#define LED 4
#define BUZZER 13

// Firebase paths
#define FIREBASE_DISTANCE_PATH "/sensor_data/distance_cm"
#define FIREBASE_GAS_LEVEL_PATH "/sensor_data/gas_level"
#define FIREBASE_TIMESTAMP_PATH "/sensor_data/last_update"

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
  pinMode(LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  
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

void sendFirebaseData(const char* path, float value) {
  if (Firebase.setFloat(firebaseData, path, value)) {
    Serial.println("Data sent successfully");
  } else {
    Serial.println("Failed to send data");
    Serial.println("Error: " + firebaseData.errorReason());
  }
}

void loop() {
  // Read sensor data
  float distance = readDistance();
  float gasLevel = readMQ4();
  
  // Control LED and Buzzer based on sensor data
  if (distance < 3) { // If distance is less than 3cm
    digitalWrite(LED, HIGH); // Turn on LED
  } else {
    digitalWrite(LED, LOW); // Turn off LED
  }

  // Assuming the explosion threshold value for the gas sensor is a high value, e.g., 1023
  if (gasLevel < 1023) { // If gas value is below the explosion threshold
    tone(BUZZER, 1535, 500); // Buzz for 500ms
    delay(1000); // Wait for 1 second
  } else {
    noTone(BUZZER); // Stop the buzzer
  }

  // Send sensor data to Firebase
  sendFirebaseData(FIREBASE_DISTANCE_PATH, distance);
  sendFirebaseData(FIREBASE_GAS_LEVEL_PATH, gasLevel);
  
  // Send timestamp
  if (Firebase.setTimestamp(firebaseData, FIREBASE_TIMESTAMP_PATH)) {
    Serial.println("Timestamp updated successfully");
  } else {
    Serial.println("Failed to update timestamp");
  }
  
  delay(10000); // Adjust delay as needed
}