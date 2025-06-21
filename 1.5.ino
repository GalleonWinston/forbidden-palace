#define TRIG 13
#define ECHO 14
void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  digitalWrite(TRIG, LOW);
  delay(2);
  digitalWrite(TRIG, HIGH);
  delay(10);
  digitalWrite(TRIG, LOW);
  float time = pulseIn(ECHO, HIGH);
  float distance = time * 0.034 / 2 ;
  delay(100);
}
