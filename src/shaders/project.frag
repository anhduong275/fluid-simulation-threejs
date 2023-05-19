precision highp float;

varying vec2 vUv;

uniform sampler2D velocity;
uniform sampler2D pressure;
uniform float dt;
uniform float pixelSize;

void main() {
  float pressureUp = texture2D(pressure, vUv - vec2(0.0, pixelSize)).x;
  float pressureDown = texture2D(pressure, vUv + vec2(0.0, pixelSize)).x;
  float pressureLeft = texture2D(pressure, vUv - vec2(pixelSize, 0.0)).x;
  float pressureRight = texture2D(pressure, vUv + vec2(pixelSize, 0.0)).x;
  vec2 pressureGradient = vec2(pressureRight - pressureLeft, pressureDown - pressureUp) * 0.5; 

  vec2 currentVelocity = texture2D(velocity, vUv).xy;
  vec2 newVelocity = currentVelocity - dt * pressureGradient;
  gl_FragColor = vec4(newVelocity, 0.0, 1.0);
}