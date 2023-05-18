precision highp float;

varying vec2 vUv;

uniform float pixelSize;
uniform sampler2D pressure;
uniform float dt;
uniform sampler2D divergence;

void main() {
  float up = texture2D(pressure, vUv + vec2(0.0, 2.0 * pixelSize)).x;
  float down = texture2D(pressure, vUv + vec2(0.0, - 2.0 * pixelSize)).x;
  float left = texture2D(pressure, vUv + vec2(- 2.0 * pixelSize, 0.0)).x;
  float right = texture2D(pressure, vUv + vec2(2.0 * pixelSize, 0.0)).x;
  float currentDivergence = texture2D(divergence, vUv).x;
  float newPressure = (up + down + left + right) / 4.0 - currentDivergence / dt;
  gl_FragColor = vec4(newPressure, 0.0, 0.0, 1.0);
}