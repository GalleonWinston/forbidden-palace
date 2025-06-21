#include <Arduino.h>

const int trigPin = 23; // Trig引脚
const int echoPin = 22; // Echo引脚
const int gasPin = 35;  // A0引脚

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  // 超声波传感器代码
  long duration, distance;
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2; // 计算距离（单位：厘米）
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  // 气体传感器代码
  int gasValue = analogRead(gasPin); // 读取模拟值
  Serial.print("Gas Sensor Value: ");
  Serial.println(gasValue);

  delay(1000); // 每秒测量一次
}
