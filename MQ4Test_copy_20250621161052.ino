// ---------- HC-SR04 超声波传感器参数 ----------
#define TRIG_PIN 12  // 触发信号输出引脚
#define ECHO_PIN 14  // 回波信号输入引脚

// ---------- MQ-4 气体传感器参数 ----------
#define MQ4_PIN 34   // 模拟输入引脚（ESP32的ADC1_CH6）

void setup() {
  Serial.begin(115200);          // 初始化串口通信（波特率115200）
  
  // HC-SR04 引脚初始化
  pinMode(TRIG_PIN, OUTPUT);     // Trig设为输出模式
  pinMode(ECHO_PIN, INPUT);      // Echo设为输入模式
}

void loop() {
  // ---------- 读取HC-SR04距离 ----------
  long duration, distance;
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  duration = pulseIn(ECHO_PIN, HIGH);
  distance = duration * 0.034 / 2;  // 计算距离（厘米）

  // ---------- 读取MQ-4模拟值 ----------
  int mq4Value = analogRead(MQ4_PIN);  // 读取模拟值（0-4095）
  float mq4Voltage = mq4Value * (3.3 / 4095.0);  // 换算为电压（V）

  // ---------- 串口输出结果 ----------
  Serial.println("--------------------------");
  Serial.print("HC-SR04 Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  Serial.print("MQ-4 Analog Value: ");
  Serial.print(mq4Value);
  Serial.print("  |  Voltage: ");
  Serial.print(mq4Voltage, 3);  // 保留3位小数
  Serial.println(" V");
  
  delay(1000);  // 每秒更新一次数据（可调整）
}
    